<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Barber;
use App\Models\Service;
use App\Models\BarberService;
use App\Models\SalonSettings;

class PageController extends Controller
{
    public function home(): void
    {
        $barbers = Barber::active();
        $settings = SalonSettings::get();

        $this->render('public/home', [
            'barbers'  => $barbers,
            'settings' => $settings,
            'title'    => $settings['salon_name_et'] ?? 'Juuksurisalong',
        ]);
    }

    public function services(): void
    {
        $services = Service::active();
        $settings = SalonSettings::get();

        // Lisa igale teenusele hinnavahemik
        foreach ($services as &$service) {
            $db = \App\Core\Database::getInstance();
            $stmt = $db->prepare('
                SELECT MIN(price) as min_price, MAX(price) as max_price, MIN(duration) as min_duration
                FROM barber_services
                WHERE service_id = :service_id AND is_active = TRUE
            ');
            $stmt->execute([':service_id' => $service['id']]);
            $pricing = $stmt->fetch();
            $service['min_price'] = $pricing['min_price'];
            $service['max_price'] = $pricing['max_price'];
            $service['min_duration'] = $pricing['min_duration'];
        }

        $this->render('public/services', [
            'services' => $services,
            'settings' => $settings,
            'title'    => 'Teenused',
        ]);
    }

    public function barbers(): void
    {
        $barbers = Barber::active();
        $settings = SalonSettings::get();

        // Lisa igale juuksurile teenused
        foreach ($barbers as &$barber) {
            $barber['services'] = BarberService::forBarber($barber['id']);
        }

        $this->render('public/barbers', [
            'barbers'  => $barbers,
            'settings' => $settings,
            'title'    => 'Juuksurid',
        ]);
    }
}
