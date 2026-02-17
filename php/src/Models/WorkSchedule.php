<?php

namespace App\Models;

use App\Core\Database;

class WorkSchedule
{
    public static function forBarberDay(string $barberId, int $dayOfWeek): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT * FROM work_schedules
            WHERE barber_id = :barber_id AND day_of_week = :day_of_week
        ');
        $stmt->execute([':barber_id' => $barberId, ':day_of_week' => $dayOfWeek]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
