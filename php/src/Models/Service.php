<?php

namespace App\Models;

use App\Core\Database;

class Service
{
    public static function all(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM services ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public static function active(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM services WHERE is_active = TRUE ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM services WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
