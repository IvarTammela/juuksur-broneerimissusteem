<?php

namespace App\Models;

use App\Core\Database;

class Barber
{
    public static function all(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM barbers ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public static function active(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM barbers WHERE is_active = TRUE ORDER BY sort_order ASC');
        return $stmt->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM barbers WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findByEmail(string $email): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM barbers WHERE email = :email AND is_active = TRUE');
        $stmt->execute([':email' => $email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findByName(string $name): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM barbers WHERE LOWER(name) = LOWER(:name) AND is_active = TRUE');
        $stmt->execute([':name' => $name]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
