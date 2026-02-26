<?php

namespace App\Models;

use App\Core\Database;
use App\Services\TimeSlotService;

class Appointment
{
    public static function all(array $filters = []): array
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = 'a.status = :status';
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['barber_id'])) {
            $where[] = 'a.barber_id = :barber_id';
            $params[':barber_id'] = $filters['barber_id'];
        }

        if (!empty($filters['from'])) {
            $where[] = 'a.date >= :from_date';
            $params[':from_date'] = $filters['from'];
        }

        if (!empty($filters['to'])) {
            $where[] = 'a.date <= :to_date';
            $params[':to_date'] = $filters['to'];
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        $stmt = $db->prepare("
            SELECT a.*, b.name AS barber_name, s.name_et AS service_name
            FROM appointments a
            JOIN barbers b ON b.id = a.barber_id
            JOIN services s ON s.id = a.service_id
            {$whereClause}
            ORDER BY a.date DESC, a.start_time ASC
        ");
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function find(string $id): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT a.*, b.name AS barber_name, s.name_et AS service_name
            FROM appointments a
            JOIN barbers b ON b.id = a.barber_id
            JOIN services s ON s.id = a.service_id
            WHERE a.id = :id
        ');
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function forBarberDate(string $barberId, string $date): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            SELECT * FROM appointments
            WHERE barber_id = :barber_id
              AND date = :date
              AND status != 'CANCELLED'
        ");
        $stmt->execute([':barber_id' => $barberId, ':date' => $date]);
        return $stmt->fetchAll();
    }

    public static function createWithLock(array $data): array|false
    {
        $db = Database::getInstance();
        $lockKey = crc32($data['barber_id'] . $data['date']);

        try {
            $db->beginTransaction();

            // Advisory lock juuksuri+kuupäeva kombinatsioonile
            $db->exec("SELECT pg_advisory_xact_lock({$lockKey})");

            // Kontrolli uuesti, kas aeg on vaba
            $timeSlotService = new TimeSlotService();
            $slots = $timeSlotService->getAvailableSlots(
                $data['barber_id'],
                $data['service_id'],
                $data['date']
            );

            $slotAvailable = null;
            foreach ($slots as $slot) {
                if ($slot['startTime'] === $data['start_time']) {
                    $slotAvailable = $slot;
                    break;
                }
            }

            if (!$slotAvailable) {
                $db->rollBack();
                return false;
            }

            $barberService = BarberService::find($data['barber_id'], $data['service_id']);
            if (!$barberService) {
                $db->rollBack();
                return false;
            }

            $id = bin2hex(random_bytes(16));

            $stmt = $db->prepare('
                INSERT INTO appointments
                    (id, barber_id, service_id, client_name, client_email,
                     client_phone, date, start_time, end_time, total_price, notes, locale)
                VALUES
                    (:id, :barber_id, :service_id, :client_name, :client_email,
                     :client_phone, :date, :start_time, :end_time, :total_price, :notes, :locale)
            ');

            $stmt->execute([
                ':id'           => $id,
                ':barber_id'    => $data['barber_id'],
                ':service_id'   => $data['service_id'],
                ':client_name'  => $data['client_name'],
                ':client_email' => $data['client_email'] ?? null,
                ':client_phone' => $data['client_phone'],
                ':date'         => $data['date'],
                ':start_time'   => $data['start_time'],
                ':end_time'     => $slotAvailable['endTime'],
                ':total_price'  => $barberService['price'],
                ':notes'        => $data['notes'] ?? null,
                ':locale'       => 'et',
            ]);

            $db->commit();

            return self::find($id);

        } catch (\Exception $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            throw $e;
        }
    }

    public static function updateStatus(string $id, string $status): bool
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE appointments SET status = :status, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    public static function countToday(?string $barberId = null): int
    {
        $db = Database::getInstance();
        $where = "date = CURRENT_DATE AND status != 'CANCELLED'";
        $params = [];
        if ($barberId) {
            $where .= ' AND barber_id = :barber_id';
            $params[':barber_id'] = $barberId;
        }
        $stmt = $db->prepare("SELECT COUNT(*) FROM appointments WHERE {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public static function countWeek(?string $barberId = null): int
    {
        $db = Database::getInstance();
        $where = "date >= date_trunc('week', CURRENT_DATE)
              AND date < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
              AND status != 'CANCELLED'";
        $params = [];
        if ($barberId) {
            $where .= ' AND barber_id = :barber_id';
            $params[':barber_id'] = $barberId;
        }
        $stmt = $db->prepare("SELECT COUNT(*) FROM appointments WHERE {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public static function upcoming(int $limit = 5, ?string $barberId = null): array
    {
        $db = Database::getInstance();
        $barberWhere = $barberId ? 'AND a.barber_id = :barber_id' : '';
        $stmt = $db->prepare("
            SELECT a.*, b.name AS barber_name, s.name_et AS service_name
            FROM appointments a
            JOIN barbers b ON b.id = a.barber_id
            JOIN services s ON s.id = a.service_id
            WHERE a.date >= CURRENT_DATE AND a.status = 'CONFIRMED'
            {$barberWhere}
            ORDER BY a.date ASC, a.start_time ASC
            LIMIT :limit
        ");
        if ($barberId) {
            $stmt->bindValue(':barber_id', $barberId);
        }
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
