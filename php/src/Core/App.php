<?php

namespace App\Core;

use App\Controllers\PageController;
use App\Controllers\BookingController;
use App\Controllers\AvailabilityController;
use App\Controllers\AdminAuthController;
use App\Controllers\AdminAppointmentController;
use App\Controllers\AdminBarberController;
use App\Controllers\AdminServiceController;

class App
{
    private Router $router;

    public function __construct()
    {
        $config = require __DIR__ . '/../../config/app.php';
        date_default_timezone_set($config['timezone']);

        Session::start();

        $this->router = new Router();
        $this->registerRoutes();
    }

    private function registerRoutes(): void
    {
        // Avalikud lehed
        $this->router->get('/', [PageController::class, 'home']);
        $this->router->get('/teenused', [PageController::class, 'services']);
        $this->router->get('/juuksurid', [PageController::class, 'barbers']);

        // Broneerimine
        $this->router->get('/broneeri', [BookingController::class, 'index']);
        $this->router->post('/broneeri', [BookingController::class, 'store']);

        // API - vabad ajad (JSON)
        $this->router->get('/api/barbers', [AvailabilityController::class, 'barbers']);
        $this->router->get('/api/barbers/{barberId}/services', [AvailabilityController::class, 'services']);
        $this->router->get('/api/availability', [AvailabilityController::class, 'slots']);

        // Admin auth
        $this->router->get('/admin/login', [AdminAuthController::class, 'loginForm']);
        $this->router->post('/admin/login', [AdminAuthController::class, 'login']);
        $this->router->post('/admin/logout', [AdminAuthController::class, 'logout']);

        // Admin broneeringud
        $this->router->get('/admin', [AdminAppointmentController::class, 'dashboard']);
        $this->router->get('/admin/broneeringud', [AdminAppointmentController::class, 'index']);
        $this->router->get('/admin/broneeringud/{id}', [AdminAppointmentController::class, 'show']);
        $this->router->post('/admin/broneeringud/{id}/staatus', [AdminAppointmentController::class, 'updateStatus']);

        // Admin teenused (CRUD)
        $this->router->get('/admin/teenused', [AdminServiceController::class, 'index']);
        $this->router->get('/admin/teenused/lisa', [AdminServiceController::class, 'create']);
        $this->router->post('/admin/teenused/salvesta', [AdminServiceController::class, 'store']);
        $this->router->get('/admin/teenused/{id}', [AdminServiceController::class, 'edit']);
        $this->router->post('/admin/teenused/{id}/uuenda', [AdminServiceController::class, 'update']);
        $this->router->post('/admin/teenused/{id}/kustuta', [AdminServiceController::class, 'delete']);

        // Admin juuksurid (CRUD)
        $this->router->get('/admin/juuksurid', [AdminBarberController::class, 'index']);
        $this->router->get('/admin/juuksurid/lisa', [AdminBarberController::class, 'create']);
        $this->router->post('/admin/juuksurid/salvesta', [AdminBarberController::class, 'store']);
        $this->router->get('/admin/juuksurid/{id}', [AdminBarberController::class, 'edit']);
        $this->router->post('/admin/juuksurid/{id}/uuenda', [AdminBarberController::class, 'update']);
        $this->router->post('/admin/juuksurid/{id}/kustuta', [AdminBarberController::class, 'delete']);
    }

    public function run(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];
        $this->router->dispatch($method, $uri);
    }
}
