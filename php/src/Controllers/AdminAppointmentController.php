<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Models\Appointment;
use App\Models\Barber;
use App\Models\SalonSettings;

class AdminAppointmentController extends Controller
{
    public function dashboard(): void
    {
        $this->requireAuth();

        $settings = SalonSettings::get();
        $barberId = $this->isBarber() ? $this->currentBarberId() : null;

        $this->render('admin/dashboard', [
            'title'           => 'Admin - Dashboard',
            'settings'        => $settings,
            'todayCount'      => Appointment::countToday($barberId),
            'weekCount'       => Appointment::countWeek($barberId),
            'barbersCount'    => $barberId ? null : count(Barber::active()),
            'upcoming'        => Appointment::upcoming(5, $barberId),
            'userName'        => Session::get('user_name'),
            'csrfToken'       => Session::generateCsrfToken(),
            'isBarber'        => $this->isBarber(),
        ], 'admin');
    }

    public function index(): void
    {
        $this->requireAuth();

        $settings = SalonSettings::get();
        $filters = [
            'status' => $_GET['status'] ?? null,
            'from'   => $_GET['from'] ?? null,
            'to'     => $_GET['to'] ?? null,
        ];

        if ($this->isBarber()) {
            $filters['barber_id'] = $this->currentBarberId();
        }

        $appointments = Appointment::all($filters);

        $this->render('admin/appointments/index', [
            'title'        => 'Admin - Broneeringud',
            'settings'     => $settings,
            'appointments' => $appointments,
            'filters'      => $filters,
            'userName'     => Session::get('user_name'),
            'csrfToken'    => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function show(string $id): void
    {
        $this->requireAuth();

        $settings = SalonSettings::get();
        $appointment = Appointment::find($id);

        if (!$appointment) {
            http_response_code(404);
            echo '<h1>Broneeringut ei leitud</h1>';
            return;
        }

        if ($this->isBarber() && $appointment['barber_id'] !== $this->currentBarberId()) {
            $this->redirect('/admin/broneeringud');
            return;
        }

        $this->render('admin/appointments/show', [
            'title'       => 'Admin - Broneering',
            'settings'    => $settings,
            'appointment' => $appointment,
            'userName'    => Session::get('user_name'),
            'csrfToken'   => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function updateStatus(string $id): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/broneeringud/' . $id);
            return;
        }

        if ($this->isBarber()) {
            $appointment = Appointment::find($id);
            if (!$appointment || $appointment['barber_id'] !== $this->currentBarberId()) {
                $this->redirect('/admin/broneeringud');
                return;
            }
        }

        $status = $_POST['status'] ?? '';
        $allowed = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];

        if (!in_array($status, $allowed, true)) {
            Session::flash('error', 'Vigane staatus.');
            $this->redirect('/admin/broneeringud/' . $id);
            return;
        }

        Appointment::updateStatus($id, $status);
        Session::flash('success', 'Broneeringu staatus uuendatud.');
        $this->redirect('/admin/broneeringud/' . $id);
    }
}
