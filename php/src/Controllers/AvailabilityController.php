<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Barber;
use App\Models\BarberService;
use App\Models\SalonSettings;
use App\Services\TimeSlotService;

class AvailabilityController extends Controller
{
    public function barbers(): void
    {
        $barbers = Barber::active();
        $this->json($barbers);
    }

    public function services(string $barberId): void
    {
        $services = BarberService::forBarber($barberId);
        $this->json($services);
    }

    public function slots(): void
    {
        $barberId = $_GET['barberId'] ?? '';
        $serviceId = $_GET['serviceId'] ?? '';
        $date = $_GET['date'] ?? '';

        if (!$barberId || !$serviceId || !$date) {
            $this->json(['error' => 'Puuduvad parameetrid'], 400);
            return;
        }

        // Valideeri kuupäev
        $dateObj = \DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $date) {
            $this->json(['error' => 'Vigane kuupäev'], 400);
            return;
        }

        // Kontrolli, kas kuupäev ei ole minevikus
        $today = new \DateTime('today');
        if ($dateObj < $today) {
            $this->json(['error' => 'Kuupäev on minevikus'], 400);
            return;
        }

        // Kontrolli max_advance_days
        $settings = SalonSettings::get();
        $maxDate = (new \DateTime('today'))->modify('+' . $settings['max_advance_days'] . ' days');
        if ($dateObj > $maxDate) {
            $this->json(['error' => 'Kuupäev on liiga kaugel tulevikus'], 400);
            return;
        }

        $timeSlotService = new TimeSlotService();
        $slots = $timeSlotService->getAvailableSlots($barberId, $serviceId, $date);

        $this->json([
            'slots' => $slots,
            'date'  => $date,
        ]);
    }
}
