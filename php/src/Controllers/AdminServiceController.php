<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Core\Validator;
use App\Models\Service;
use App\Models\SalonSettings;
use App\Core\Database;

class AdminServiceController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();

        $services = Service::all();

        $this->render('admin/services/index', [
            'title'    => 'Admin - Teenused',
            'settings' => SalonSettings::get(),
            'services' => $services,
            'userName' => Session::get('user_name'),
            'csrfToken' => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function create(): void
    {
        $this->requireAuth();

        $this->render('admin/services/form', [
            'title'    => 'Admin - Lisa teenus',
            'settings' => SalonSettings::get(),
            'service'  => null,
            'userName' => Session::get('user_name'),
            'csrfToken' => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function store(): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/teenused/lisa');
            return;
        }

        $validator = new Validator();
        $isValid = $validator->validate($_POST, [
            'name_et' => ['required', 'min:2'],
        ]);

        if (!$isValid) {
            Session::flash('error', 'Palun täitke teenuse nimi.');
            $this->redirect('/admin/teenused/lisa');
            return;
        }

        $db = Database::getInstance();
        $id = bin2hex(random_bytes(16));

        $stmt = $db->prepare('
            INSERT INTO services (id, name, name_et, description_et, category_et, is_active, sort_order)
            VALUES (:id, :name, :name_et, :description_et, :category_et, :is_active, :sort_order)
        ');
        $stmt->execute([
            ':id'             => $id,
            ':name'           => trim($_POST['name'] ?? $_POST['name_et']),
            ':name_et'        => trim($_POST['name_et']),
            ':description_et' => !empty($_POST['description_et']) ? trim($_POST['description_et']) : null,
            ':category_et'    => !empty($_POST['category_et']) ? trim($_POST['category_et']) : null,
            ':is_active'      => isset($_POST['is_active']) ? true : false,
            ':sort_order'     => (int) ($_POST['sort_order'] ?? 0),
        ]);

        Session::flash('success', 'Teenus lisatud.');
        $this->redirect('/admin/teenused');
    }

    public function edit(string $id): void
    {
        $this->requireAuth();

        $service = Service::find($id);
        if (!$service) {
            $this->redirect('/admin/teenused');
            return;
        }

        $this->render('admin/services/form', [
            'title'    => 'Admin - Muuda teenust',
            'settings' => SalonSettings::get(),
            'service'  => $service,
            'userName' => Session::get('user_name'),
            'csrfToken' => Session::generateCsrfToken(),
        ], 'admin');
    }

    public function update(string $id): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/teenused/' . $id);
            return;
        }

        $db = Database::getInstance();
        $stmt = $db->prepare('
            UPDATE services SET name = :name, name_et = :name_et, description_et = :description_et,
                category_et = :category_et, is_active = :is_active, sort_order = :sort_order, updated_at = NOW()
            WHERE id = :id
        ');
        $stmt->execute([
            ':id'             => $id,
            ':name'           => trim($_POST['name'] ?? $_POST['name_et']),
            ':name_et'        => trim($_POST['name_et']),
            ':description_et' => !empty($_POST['description_et']) ? trim($_POST['description_et']) : null,
            ':category_et'    => !empty($_POST['category_et']) ? trim($_POST['category_et']) : null,
            ':is_active'      => isset($_POST['is_active']) ? true : false,
            ':sort_order'     => (int) ($_POST['sort_order'] ?? 0),
        ]);

        Session::flash('success', 'Teenus uuendatud.');
        $this->redirect('/admin/teenused');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();

        if (!$this->validateCsrf()) {
            Session::flash('error', 'Vigane CSRF token.');
            $this->redirect('/admin/teenused');
            return;
        }

        $db = Database::getInstance();
        $db->prepare('DELETE FROM services WHERE id = :id')->execute([':id' => $id]);

        Session::flash('success', 'Teenus kustutatud.');
        $this->redirect('/admin/teenused');
    }
}
