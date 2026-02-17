<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Models\User;

class AdminAuthController extends Controller
{
    public function loginForm(): void
    {
        // Kui juba sisse logitud, suuna dashboardile
        if (Session::has('user_id')) {
            $this->redirect('/admin');
            return;
        }

        $this->render('admin/login', [
            'title'     => 'Admin - Sisselogimine',
            'csrfToken' => Session::generateCsrfToken(),
            'error'     => Session::getFlash('login_error'),
            'settings'  => \App\Models\SalonSettings::get(),
        ], 'public');
    }

    public function login(): void
    {
        if (!$this->validateCsrf()) {
            Session::flash('login_error', 'Vigane CSRF token.');
            $this->redirect('/admin/login');
            return;
        }

        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            Session::flash('login_error', 'Palun sisestage e-post ja parool.');
            $this->redirect('/admin/login');
            return;
        }

        $user = User::findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Session::flash('login_error', 'Vale e-post või parool.');
            $this->redirect('/admin/login');
            return;
        }

        // Regenereeri sessioon (session fixation kaitse)
        session_regenerate_id(true);

        Session::set('user_id', $user['id']);
        Session::set('user_name', $user['name']);
        Session::set('user_role', $user['role']);

        $this->redirect('/admin');
    }

    public function logout(): void
    {
        Session::destroy();
        session_start();
        $this->redirect('/admin/login');
    }
}
