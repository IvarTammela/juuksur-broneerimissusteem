<?php

namespace App\Models;

use App\Core\Database;

class SalonSettings
{
    public static function get(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query("SELECT * FROM salon_settings WHERE id = 'default'");
        $result = $stmt->fetch();
        return $result ?: [
            'salon_name_et' => 'Juuksurisalong',
            'time_slot_interval' => 15,
            'booking_lead_time' => 60,
            'max_advance_days' => 30,
        ];
    }
}
