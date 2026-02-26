<?php

namespace App\Core;

class Controller
{
    protected function render(string $view, array $data = [], string $layout = 'public'): void
    {
        extract($data);

        ob_start();
        require __DIR__ . '/../../views/' . $view . '.php';
        $content = ob_get_clean();

        require __DIR__ . '/../../views/layouts/' . $layout . '.php';
    }

    protected function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    protected function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }

    protected function requireAuth(): void
    {
        if (!Session::has('user_id')) {
            $this->redirect('/admin/login');
        }
    }

    protected function isBarber(): bool
    {
        return Session::get('user_role') === 'BARBER';
    }

    protected function currentBarberId(): ?string
    {
        return Session::get('barber_id');
    }

    protected function requireAdmin(): void
    {
        $this->requireAuth();
        if ($this->isBarber()) {
            $this->redirect('/admin');
        }
    }

    protected function getInput(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (str_contains($contentType, 'application/json')) {
            return json_decode(file_get_contents('php://input'), true) ?? [];
        }

        return $_POST;
    }

    protected function validateCsrf(): bool
    {
        $token = $_POST['_csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        return Session::validateCsrfToken($token);
    }
}
