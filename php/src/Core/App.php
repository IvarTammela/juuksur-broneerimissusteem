<?php

namespace App\Core;

use App\Controllers\PageController;
use App\Controllers\BookingController;
use App\Controllers\AvailabilityController;
use App\Controllers\AdminAuthController;
use App\Controllers\AdminAppointmentController;

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
    }

    public function run(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];
        $this->router->dispatch($method, $uri);
    }
}
