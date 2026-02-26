<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Core\Validator;
use App\Models\Barber;
use App\Models\BarberService;
use App\Models\Service;
use App\Models\ScheduleBreak;
use App\Models\SalonSettings;
use App\Core\Database;

class AdminBarberController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();

        $barbers = Barber::all();

        $this->render('admin/barbers/index', [
            'title'    => 'Admin - Juuksurid',
            'settings' => SalonSettings::get(),
            'barbers'  => $barbers,
            'userName' => Session::get('user_name'),
            'csrfToken' => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function create(): void
    {
        $this->requireAuth();

        $this->render('admin/barbers/form', [
            'title'    => 'Admin - Lisa juuksur',
            'settings' => SalonSettings::get(),
            'barber'   => null,
            'services' => Service::active(),
            'barberServices' => [],
            'breaks' => [],
            'userName' => Session::get('user_name'),
            'csrfToken' => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function store(): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/juuksurid/lisa');
            return;
        }

        $validator = new Validator();
        $isValid = $validator->validate($_POST, [
            'name' => ['required', 'min:2'],
        ]);

        if (!$isValid) {
            Session::flash('error', 'Palun täitke nimi.');
            $this->redirect('/admin/juuksurid/lisa');
            return;
        }

        $db = Database::getInstance();
        $id = bin2hex(random_bytes(16));

        $stmt = $db->prepare('
            INSERT INTO barbers (id, name, email, phone, bio_et, is_active, sort_order)
            VALUES (:id, :name, :email, :phone, :bio_et, :is_active, :sort_order)
        ');
        $stmt->execute([
            ':id'         => $id,
            ':name'       => trim($_POST['name']),
            ':email'      => !empty($_POST['email']) ? trim($_POST['email']) : null,
            ':phone'      => !empty($_POST['phone']) ? trim($_POST['phone']) : null,
            ':bio_et'     => !empty($_POST['bio_et']) ? trim($_POST['bio_et']) : null,
            ':is_active'  => isset($_POST['is_active']) ? true : false,
            ':sort_order' => (int) ($_POST['sort_order'] ?? 0),
        ]);

        $this->saveBarberServices($id, $_POST);
        $this->saveBarberBreaks($id, $_POST);

        Session::flash('success', 'Juuksur lisatud.');
        $this->redirect('/admin/juuksurid');
    }

    public function edit(string $id): void
    {
        $this->requireAuth();

        $barber = Barber::find($id);
        if (!$barber) {
            $this->redirect('/admin/juuksurid');
            return;
        }

        $barberServices = BarberService::forBarber($id);
        $bsMap = [];
        foreach ($barberServices as $bs) {
            $bsMap[$bs['service_id']] = $bs;
        }

        $this->render('admin/barbers/form', [
            'title'          => 'Admin - Muuda juuksurit',
            'settings'       => SalonSettings::get(),
            'barber'         => $barber,
            'services'       => Service::active(),
            'barberServices' => $bsMap,
            'breaks' => ScheduleBreak::forBarber($id),
            'userName'       => Session::get('user_name'),
            'csrfToken'      => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function update(string $id): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/juuksurid/' . $id);
            return;
        }

        $db = Database::getInstance();
        $stmt = $db->prepare('
            UPDATE barbers SET name = :name, email = :email, phone = :phone,
                bio_et = :bio_et, is_active = :is_active, sort_order = :sort_order, updated_at = NOW()
            WHERE id = :id
        ');
        $stmt->execute([
            ':id'         => $id,
            ':name'       => trim($_POST['name']),
            ':email'      => !empty($_POST['email']) ? trim($_POST['email']) : null,
            ':phone'      => !empty($_POST['phone']) ? trim($_POST['phone']) : null,
            ':bio_et'     => !empty($_POST['bio_et']) ? trim($_POST['bio_et']) : null,
            ':is_active'  => isset($_POST['is_active']) ? true : false,
            ':sort_order' => (int) ($_POST['sort_order'] ?? 0),
        ]);

        $this->saveBarberServices($id, $_POST);
        $this->saveBarberBreaks($id, $_POST);

        Session::flash('success', 'Juuksur uuendatud.');
        $this->redirect('/admin/juuksurid');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/juuksurid');
            return;
        }

        $db = Database::getInstance();
        $db->prepare('DELETE FROM barbers WHERE id = :id')->execute([':id' => $id]);

        Session::flash('success', 'Juuksur kustutatud.');
        $this->redirect('/admin/juuksurid');
    }

    private function saveBarberBreaks(string $barberId, array $data): void
    {
        ScheduleBreak::deleteForBarber($barberId);

        $breaks = $data['breaks'] ?? [];
        foreach ($breaks as $brk) {
            if (empty($brk['start_time']) || empty($brk['end_time'])) continue;
            if (!isset($brk['day_of_week'])) continue;

            ScheduleBreak::create([
                'barber_id'   => $barberId,
                'day_of_week' => $brk['day_of_week'],
                'start_time'  => $brk['start_time'],
                'end_time'    => $brk['end_time'],
                'label'       => $brk['label'] ?? null,
            ]);
        }
    }

    private function saveBarberServices(string $barberId, array $data): void
    {
        $db = Database::getInstance();

        // Kustuta vanad seosed
        $db->prepare('DELETE FROM barber_services WHERE barber_id = :id')->execute([':id' => $barberId]);

        // Lisa uued
        $services = $data['services'] ?? [];
        foreach ($services as $serviceId => $svc) {
            if (empty($svc['enabled'])) continue;
            $price = (float) ($svc['price'] ?? 0);
            $duration = (int) ($svc['duration'] ?? 30);
            if ($price <= 0) continue;

            $bsId = bin2hex(random_bytes(16));
            $stmt = $db->prepare('
                INSERT INTO barber_services (id, barber_id, service_id, price, duration)
                VALUES (:id, :barber_id, :service_id, :price, :duration)
            ');
            $stmt->execute([
                ':id'         => $bsId,
                ':barber_id'  => $barberId,
                ':service_id' => $serviceId,
                ':price'      => $price,
                ':duration'   => $duration,
            ]);
        }
    }
}
