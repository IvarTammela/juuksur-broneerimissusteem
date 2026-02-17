<?php

namespace App\Services;

use App\Models\WorkSchedule;
use App\Models\ScheduleBreak;
use App\Models\Appointment;
use App\Models\BarberService;
use App\Models\SalonSettings;

class TimeSlotService
{
    /**
     * Tagastab vabad ajad antud juuksuri, teenuse ja kuupäeva jaoks.
     *
     * @return array<array{startTime: string, endTime: string}>
     */
    public function getAvailableSlots(string $barberId, string $serviceId, string $date): array
    {
        $dateObj = new \DateTime($date);
        $dayOfWeek = (int) $dateObj->format('w'); // 0=pühapäev ... 6=laupäev

        // 1. Juuksuri töögraafik sellel päeval
        $schedule = WorkSchedule::forBarberDay($barberId, $dayOfWeek);
        if (!$schedule || !$schedule['is_working']) {
            return [];
        }

        // 2. Pausid sellel päeval
        $breaks = ScheduleBreak::forBarberDay($barberId, $dayOfWeek);

        // 3. Olemasolevad broneeringud (mitte tühistatud)
        $appointments = Appointment::forBarberDate($barberId, $date);

        // 4. Teenuse kestus
        $barberService = BarberService::find($barberId, $serviceId);
        if (!$barberService) {
            return [];
        }

        // 5. Salongi seaded
        $settings = SalonSettings::get();
        $interval = (int) ($settings['time_slot_interval'] ?? 15);
        $leadTime = (int) ($settings['booking_lead_time'] ?? 60);
        $duration = (int) $barberService['duration'];

        $schedStart = $this->timeToMinutes($schedule['start_time']);
        $schedEnd = $this->timeToMinutes($schedule['end_time']);

        // Praegune aeg + ooteaeg (ainult tänase puhul)
        $now = new \DateTime();
        $today = (new \DateTime($date))->format('Y-m-d');
        $isToday = $today === $now->format('Y-m-d');
        $currentMinutes = $isToday
            ? (int) $now->format('H') * 60 + (int) $now->format('i') + $leadTime
            : 0;

        // Teisenda pausid ja broneeringud minutivahemikeks
        $breakRanges = array_map(fn($b) => [
            'start' => $this->timeToMinutes($b['start_time']),
            'end'   => $this->timeToMinutes($b['end_time']),
        ], $breaks);

        $appointmentRanges = array_map(fn($a) => [
            'start' => $this->timeToMinutes($a['start_time']),
            'end'   => $this->timeToMinutes($a['end_time']),
        ], $appointments);

        // 6. Genereeri vabad ajad
        $slots = [];

        for ($slotStart = $schedStart; $slotStart + $duration <= $schedEnd; $slotStart += $interval) {
            $slotEnd = $slotStart + $duration;

            // Liiga vara (ainult täna)
            if ($slotStart < $currentMinutes) {
                continue;
            }

            // Kattub pausiga
            $overlapsBreak = false;
            foreach ($breakRanges as $b) {
                if ($this->slotsOverlap($slotStart, $slotEnd, $b['start'], $b['end'])) {
                    $overlapsBreak = true;
                    break;
                }
            }
            if ($overlapsBreak) {
                continue;
            }

            // Kattub olemasoleva broneeringuga
            $overlapsAppointment = false;
            foreach ($appointmentRanges as $a) {
                if ($this->slotsOverlap($slotStart, $slotEnd, $a['start'], $a['end'])) {
                    $overlapsAppointment = true;
                    break;
                }
            }
            if ($overlapsAppointment) {
                continue;
            }

            $slots[] = [
                'startTime' => $this->minutesToTime($slotStart),
                'endTime'   => $this->minutesToTime($slotEnd),
            ];
        }

        return $slots;
    }

    private function timeToMinutes(string $time): int
    {
        [$h, $m] = explode(':', $time);
        return (int) $h * 60 + (int) $m;
    }

    private function minutesToTime(int $minutes): string
    {
        $h = intdiv($minutes, 60);
        $m = $minutes % 60;
        return sprintf('%02d:%02d', $h, $m);
    }

    private function slotsOverlap(int $s1Start, int $s1End, int $s2Start, int $s2End): bool
    {
        return $s1Start < $s2End && $s1End > $s2Start;
    }
}
