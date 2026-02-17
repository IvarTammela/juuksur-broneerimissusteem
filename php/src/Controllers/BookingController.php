<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Core\Validator;
use App\Models\Appointment;
use App\Models\Barber;
use App\Models\BarberService;
use App\Models\SalonSettings;

class BookingController extends Controller
{
    public function index(): void
    {
        $settings = SalonSettings::get();

        $this->render('public/booking/index', [
            'settings'  => $settings,
            'csrfToken' => Session::generateCsrfToken(),
            'title'     => 'Broneeri aeg',
        ]);
    }

    public function store(): void
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        // Toeta nii JSON kui ka form-encoded päringuid
        if (str_contains($contentType, 'application/json')) {
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
        } else {
            $data = $_POST;
        }

        // CSRF kontroll
        $csrfToken = $data['_csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        if (!Session::validateCsrfToken($csrfToken)) {
            $this->json(['error' => 'Vigane CSRF token. Palun laadige leht uuesti.'], 403);
            return;
        }

        // Valideeri sisend
        $validator = new Validator();
        $isValid = $validator->validate($data, [
            'barber_id'    => ['required'],
            'service_id'   => ['required'],
            'date'         => ['required', 'date'],
            'start_time'   => ['required', 'time'],
            'client_name'  => ['required', 'min:2', 'max:255'],
            'client_phone' => ['required', 'min:5', 'max:50'],
            'client_email' => ['email'],
        ]);

        if (!$isValid) {
            $this->json(['error' => 'Vigased andmed', 'errors' => $validator->getErrors()], 400);
            return;
        }

        // Kontrolli, kas juuksur eksisteerib
        $barber = Barber::find($data['barber_id']);
        if (!$barber || !$barber['is_active']) {
            $this->json(['error' => 'Juuksurit ei leitud'], 404);
            return;
        }

        // Kontrolli, kas teenus eksisteerib juuksuril
        $barberService = BarberService::find($data['barber_id'], $data['service_id']);
        if (!$barberService) {
            $this->json(['error' => 'Teenust ei leitud'], 404);
            return;
        }

        // Proovi broneeringut luua (advisory lock'iga)
        $appointment = Appointment::createWithLock([
            'barber_id'    => trim($data['barber_id']),
            'service_id'   => trim($data['service_id']),
            'date'         => trim($data['date']),
            'start_time'   => trim($data['start_time']),
            'client_name'  => trim($data['client_name']),
            'client_phone' => trim($data['client_phone']),
            'client_email' => !empty($data['client_email']) ? trim($data['client_email']) : null,
            'notes'        => !empty($data['notes']) ? trim($data['notes']) : null,
        ]);

        if ($appointment === false) {
            $this->json(['error' => 'See aeg ei ole enam saadaval. Palun valige teine aeg.'], 409);
            return;
        }

        $this->json(['success' => true, 'appointment' => $appointment], 201);
    }
}
