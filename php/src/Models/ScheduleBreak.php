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
}
