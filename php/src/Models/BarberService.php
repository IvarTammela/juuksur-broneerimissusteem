<?php

namespace App\Models;

use App\Core\Database;

class BarberService
{
    public static function forBarber(string $barberId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT bs.*, s.name, s.name_et, s.description_et, s.category_et
            FROM barber_services bs
            JOIN services s ON s.id = bs.service_id
            WHERE bs.barber_id = :barber_id
              AND bs.is_active = TRUE
              AND s.is_active = TRUE
            ORDER BY s.sort_order ASC
        ');
        $stmt->execute([':barber_id' => $barberId]);
        return $stmt->fetchAll();
    }

    public static function find(string $barberId, string $serviceId): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT * FROM barber_services
            WHERE barber_id = :barber_id AND service_id = :service_id
        ');
        $stmt->execute([':barber_id' => $barberId, ':service_id' => $serviceId]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
