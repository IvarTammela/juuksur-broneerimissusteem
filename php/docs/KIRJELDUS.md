# Juuksurisalongi broneerimissusteem - Töö kirjeldus

## Avalik URL
**https://koolihaldus.ee** (test: b1l0dc5d53.testlink.ee)

Majutus: ElkData jagatud veebimajutus (Apache 2.4, PHP 8.4, PostgreSQL 17.7)

---

## 1. Klient-server arhitektuur

Rakendus järgib klassikalist klient-server mudelit:

**Klient (brauser)** saadab HTTP päringu (nt GET /broneeri) Apache veebiserverile. Apache suunab päringu läbi .htaccess reegli front controller'ile (index.php), mis analüüsib URL-i ja käivitab vastava kontrolleri meetodi.

Kontroller (nt BookingController) töötleb päringu: valideerib sisendi, suhtleb mudeliga (andmebaasikiht) ja renderdab vastuse kas HTML vaatena või JSON-ina.

**Broneerimise näidis:**
1. Brauser laeb /broneeri lehe (GET) → PHP renderdab HTML + JS wizard
2. JavaScript teeb AJAX päringu /api/availability (GET) → PHP tagastab vabad ajad JSON-ina
3. Kasutaja esitab broneeringu (POST /broneeri) → PHP valideerib, lukustab aja (advisory lock), salvestab andmebaasi, tagastab kinnituse JSON-ina

Frontend ja backend on selgelt eraldatud: HTML/CSS/JS failid (views/ ja public/) moodustavad kasutajaliidese, PHP loogika (src/) moodustab serveripoole.

---

## 2. Raamistik

Rakendus kasutab **kohandatud PHP MVC raamistikku** koos Composer PSR-4 autoloading'iga.

See on raamistik, sest:
- **Router** (src/Core/Router.php) - registreerib URL marsruudid ja seob need kontrolleritega
- **Front Controller muster** - kõik päringud suunatakse läbi ühe sisenemispunkti (index.php)
- **Baaskontroller** (src/Core/Controller.php) - pakub korduvkasutatavaid meetodeid (render, json, redirect, auth kontroll)
- **PSR-4 autoloading** - automaatne klasside laadimine ilma käsitsi require'ideta
- **Middleware** - autentimise vahevara admin-marsruutide kaitsmiseks
- **Sessioonihaldus** - CSRF tokenid, flash-teated, kasutaja sessioon

Raamistik on tahtlikult kerge, et MVC muster oleks koodist selgelt loetav.

---

## 3. Turvalisus

### Peamised ründevektorid ja kaitsemeetmed

| Ründevektor | Risk | Kaitsemeede |
|-------------|------|-------------|
| **SQL injection** | Ründaja sisestab SQL koodi vormiväljadesse | PDO prepared statements kõigis andmebaasipäringutes - parameetrid seotakse eraldi, mitte stringi konkatenatsiooniga |
| **XSS (Cross-Site Scripting)** | Ründaja sisestab JavaScript koodi, mis käivitub teiste kasutajate brauseris | `htmlspecialchars()` kõigis vaadetes väljundi kuvamisel; JavaScript'is `escapeHtml()` funktsioon |
| **CSRF (Cross-Site Request Forgery)** | Ründaja meelitab kasutaja tegema soovimatut päringut | CSRF token igas POST-vormis, valideeritakse serveripoolselt enne andmete töötlemist |
| **Session fixation** | Ründaja kaaperdab sessiooni ID | `session_regenerate_id(true)` sisselogimisel |
| **Brute force login** | Ründaja proovib paroole läbi | `password_hash()/password_verify()` bcrypt algoritmiga (cost=12) |
| **Volitamata ligipääs admin-vaatele** | Keegi pääseb admin lehele ilma sisselogimiseta | `requireAuth()` kontroll igas admin-kontrolleris, suunab /admin/login lehele |
| **Race condition (topeltbroneering)** | Kaks samaaegset päringut broneerivad sama aja | PostgreSQL `pg_advisory_xact_lock()` lukustab juuksur+kuupäev kombinatsiooni transaktsioonisiseselt |

### Sisendite valideerimine
Kõik kasutaja sisendid valideeritakse Validator klassiga (src/Core/Validator.php) enne andmebaasi salvestamist. Kontrollitakse: kohustuslikud väljad, e-posti formaat, kuupäeva ja kellaaja formaat, stringi pikkused.

---

## 4. Koodistandard

Projekt järgib **PSR-12** koodistandardit (PHP-FIG):

- **Nimetamine:** CamelCase klassinimed (BookingController), camelCase meetodid (getAvailableSlots), snake_case andmebaasi veerud (barber_id)
- **Failide struktuur:** Üks klass faili kohta, PSR-4 autoloading
- **Treppimine:** 4 tühikut (spaces), mitte tabulaatorid
- **Sulud:** Avav sulg klassi ja meetodi deklareerimisel uuel real; if/for avav sulg samal real
- **Tüübid:** PHP 8.4 tüübideklaratsioonid (string, int, array, ?array nullable tüübid)
- **SQL:** Suurtähed SQL märksõnadele (SELECT, WHERE, JOIN), snake_case tabelite ja veergude nimedele
- **JavaScript:** camelCase muutujad ja funktsioonid, const/let (mitte var)
- **HTML/CSS:** Tailwind CSS utility klassid, semantiline HTML5 struktuur
