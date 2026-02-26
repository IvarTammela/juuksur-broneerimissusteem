# Juuksurisalongi Broneerimissüsteem

Juuksurisalongi veebipõhine broneerimissüsteem, mis võimaldab klientidel broneerida aegu ja adminil hallata broneeringuid, juuksureid ja teenuseid.

**Live:** [http://koolihaldus.ee/](http://koolihaldus.ee/)

## Tehnoloogiad

- **PHP 8.4** (kohandatud MVC raamistik)
- **PostgreSQL 17** (andmebaas)
- **Apache 2.4** (mod_rewrite)
- **Tailwind CSS** (CDN)
- **Vanilla JavaScript** (booking wizard)
- **Composer** (PSR-4 autoloading)

## Arhitektuur

Kohandatud MVC (Model-View-Controller) raamistik:

- **Model** — andmebaasipäringud (PDO prepared statements)
- **View** — PHP template failid Tailwind CSS-iga
- **Controller** — äriloogika, marsruutimine, sisendi valideerimine

Turvalisus:
- CSRF tokenid kõikidel vormidel
- SQL injection kaitse (PDO prepared statements)
- XSS kaitse (htmlspecialchars väljunditel)
- bcrypt paroolihashimine
- Sessioonipõhine autentimine

Topeltbroneeringu vältimine: PostgreSQL `pg_advisory_xact_lock()` transaktsioonisiseselt.

## Projekti struktuur

```
php/
├── index.php                    # Front controller
├── .htaccess                    # URL rewrite
├── composer.json                # PSR-4 autoloading
├── config/
│   ├── database.php             # Andmebaasi seaded
│   └── app.php                  # Rakenduse seaded
├── src/
│   ├── Core/                    # MVC raamistik
│   │   ├── App.php              # Bootstrap + marsruudid
│   │   ├── Router.php           # GET/POST marsruutija
│   │   ├── Controller.php       # Base controller
│   │   ├── Database.php         # PDO singleton
│   │   ├── Session.php          # Sessioon + CSRF
│   │   └── Validator.php        # Sisendi valideerimine
│   ├── Controllers/
│   │   ├── PageController.php           # Avalikud lehed
│   │   ├── BookingController.php        # Broneerimise wizard + salvestamine
│   │   ├── AvailabilityController.php   # JSON API vabade aegade jaoks
│   │   ├── AdminAuthController.php      # Admin login/logout
│   │   ├── AdminAppointmentController.php # Broneeringute haldus
│   │   ├── AdminBarberController.php    # Juuksurite CRUD
│   │   └── AdminServiceController.php   # Teenuste CRUD
│   ├── Models/                  # Andmemudelid
│   └── Services/
│       └── TimeSlotService.php  # Vabade aegade algoritm
├── views/                       # PHP template vaated
├── public/                      # CSS + JavaScript
├── database/
│   ├── schema.sql               # Tabelite loomine
│   └── seed.sql                 # Algandmed
└── docs/
    └── KIRJELDUS.md             # Koolitöö kirjeldus
```

## Paigaldamine

### Eeldused

- PHP 8.4+
- PostgreSQL 14+
- Apache (mod_rewrite)
- Composer

### Seadistamine

```bash
# Klooni repo
git clone https://github.com/ivartammela001-a11y/juuksur-broneerimissusteem.git
cd juuksur-broneerimissusteem/php

# Paigalda autoloader
composer install

# Seadista andmebaas
cp config/database.php config/database.local.php
# Muuda config/database.php oma andmebaasi andmetega

# Loo tabelid
psql -U kasutaja -d andmebaas -f database/schema.sql

# Lisa algandmed
psql -U kasutaja -d andmebaas -f database/seed.sql
```

### Vaikimisi admin sisselogimine

- URL: [http://koolihaldus.ee/admin](http://koolihaldus.ee/admin)
- E-post: `admin@juuksur.ee`
- Parool: `admin123`

## Funktsionaalsus

### Kliendi vaade
- Avalehekülg salongi infoga
- Teenuste ja juuksurite lehed
- Mitmeastmeline broneerimise wizard (juuksur → teenus → kuupäev/kellaaeg → kontaktandmed → kinnitus)
- Vabade aegade arvutamine töögraafiku, pauside ja olemasolevate broneeringute põhjal

### Admin paneel (`/admin`)
- Dashboard tänaste broneeringute ja statistikaga
- Broneeringute haldamine (nimekiri, filtreerimine, staatuse muutmine)
- Juuksurite haldamine (CRUD, teenuste hindade ja kestuste määramine, paroolid)
- Teenuste haldamine (CRUD)

### Juuksuri paneel (`/admin`)
Juuksurid logivad sisse samalt `/admin/login` lehelt oma **nime ja parooliga**. Admin seab juuksuri parooli juuksuri muutmise vormis ("Sisselogimine" sektsioon).

Juuksuri piiratud vaade:
- **Dashboard** — ainult enda broneeringute statistika
- **Broneeringud** — ainult enda broneeringud (filtreeritakse automaatselt)
- **Minu profiil** — saab muuta oma pause ja teenuste hindu/kestusi (nime, e-posti jm põhiandmeid muuta ei saa)
- **Teenused, juuksurite nimekiri** — pole ligipääsu

## Töö kirjeldus

Põhjalik kirjeldus arhitektuuri, raamistiku, turvalisuse ja koodistandardi kohta: **[php/docs/KIRJELDUS.md](php/docs/KIRJELDUS.md)**

## Deploy

Serveris on failid juurkaustas (`~/htdocs/src/`, `~/htdocs/views/`), mitte `php/` all. Git repo hoiab koodi `php/` kaustas. Peale `git pull` tuleb failid kopeerida:

```bash
# SSH serverisse
ssh -p 1022 vhost144452ssh@koolihaldus.ee

# Git pull
cd ~/htdocs && git pull origin main

# Kopeeri uuendatud failid õigesse kohta
cp -r ~/htdocs/php/src/* ~/htdocs/src/
cp -r ~/htdocs/php/views/* ~/htdocs/views/
```

Kui on andmebaasi muudatusi, jooksuta need eraldi (nt `psql` või PHP skriptiga).

## Majutus

Rakendus töötab ElkData jagatud majutusel (Apache + PHP FastCGI + PostgreSQL).
