<?php

namespace App\Models;

use App\Core\Database;

class ScheduleBreak
{
    public static function forBarberDay(string $barberId, int $dayOfWeek): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT * FROM schedule_breaks
            WHERE barber_id = :barber_id AND day_of_week = :day_of_week
        ');
        $stmt->execute([':barber_id' => $barberId, ':day_of_week' => $dayOfWeek]);
        return $stmt->fetchAll();
    }

    public static function forBarber(string $barberId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT * FROM schedule_breaks
            WHERE barber_id = :barber_id
            ORDER BY day_of_week, start_time
        ');
        $stmt->execute([':barber_id' => $barberId]);
        return $stmt->fetchAll();
    }

    public static function deleteForBarber(string $barberId): void
    {
        $db = Database::getInstance();
        $db->prepare('DELETE FROM schedule_breaks WHERE barber_id = :id')
           ->execute([':id' => $barberId]);
    }

    public static function create(array $data): void
    {
        $db = Database::getInstance();
        $id = bin2hex(random_bytes(16));
        $stmt = $db->prepare('
            INSERT INTO schedule_breaks (id, barber_id, day_of_week, start_time, end_time, label)
            VALUES (:id, :barber_id, :day_of_week, :start_time, :end_time, :label)
        ');
        $stmt->execute([
            ':id'          => $id,
            ':barber_id'   => $data['barber_id'],
            ':day_of_week' => (int) $data['day_of_week'],
            ':start_time'  => $data['start_time'],
            ':end_time'    => $data['end_time'],
            ':label'       => !empty($data['label']) ? trim($data['label']) : null,
        ]);
    }
}
