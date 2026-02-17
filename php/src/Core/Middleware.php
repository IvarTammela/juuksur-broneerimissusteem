<?php

namespace App\Core;

class Middleware
{
    public static function auth(): void
    {
        if (!Session::has('user_id')) {
            header('Location: /admin/login');
            exit;
        }
    }
}
