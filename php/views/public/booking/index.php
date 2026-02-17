<section class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-2">Broneeri aeg</h1>
    <p class="text-gray-600 mb-8">Valige juuksur, teenus ja sobiv aeg.</p>

    <!-- Sammude indikaator -->
    <div class="flex items-center justify-between mb-8" id="steps-indicator">
        <div class="step-dot active" data-step="1">
            <div class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">1</div>
            <span class="text-xs mt-1 block">Juuksur</span>
        </div>
        <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div class="step-dot" data-step="2">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">2</div>
            <span class="text-xs mt-1 block">Teenus</span>
        </div>
        <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div class="step-dot" data-step="3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
            <span class="text-xs mt-1 block">Aeg</span>
        </div>
        <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div class="step-dot" data-step="4">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">4</div>
            <span class="text-xs mt-1 block">Andmed</span>
        </div>
    </div>

    <!-- Samm 1: Juuksuri valik -->
    <div id="step-1" class="step-content">
        <h2 class="text-xl font-semibold mb-4">Valige juuksur</h2>
        <div id="barbers-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p class="text-gray-500">Laen juuksureid...</p>
        </div>
    </div>

    <!-- Samm 2: Teenuse valik -->
    <div id="step-2" class="step-content hidden">
        <h2 class="text-xl font-semibold mb-4">Valige teenus</h2>
        <div id="services-list" class="space-y-3"></div>
        <button onclick="BookingWizard.goToStep(1)" class="mt-4 text-gray-500 hover:text-gray-700 text-sm">&larr; Tagasi</button>
    </div>

    <!-- Samm 3: Kuupäev ja aeg -->
    <div id="step-3" class="step-content hidden">
        <h2 class="text-xl font-semibold mb-4">Valige kuupäev ja kellaaeg</h2>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Kuupäev</label>
            <input type="date" id="booking-date" class="border rounded-lg px-4 py-2 w-full max-w-xs"
                   min="<?= date('Y-m-d') ?>"
                   max="<?= date('Y-m-d', strtotime('+' . ($settings['max_advance_days'] ?? 30) . ' days')) ?>">
        </div>
        <div id="time-slots" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4"></div>
        <div id="no-slots-message" class="hidden text-gray-500 text-center py-8">
            Sellel kuupäeval pole vabu aegu.
        </div>
        <button onclick="BookingWizard.goToStep(2)" class="mt-4 text-gray-500 hover:text-gray-700 text-sm">&larr; Tagasi</button>
    </div>

    <!-- Samm 4: Kontaktandmed ja kokkuvõte -->
    <div id="step-4" class="step-content hidden">
        <h2 class="text-xl font-semibold mb-4">Teie andmed</h2>

        <!-- Kokkuvõte -->
        <div id="booking-summary" class="bg-gray-50 rounded-lg p-4 mb-6 border">
            <h3 class="font-semibold mb-2">Broneeringu kokkuvõte</h3>
            <div class="text-sm space-y-1 text-gray-700">
                <p>Juuksur: <span id="summary-barber" class="font-medium"></span></p>
                <p>Teenus: <span id="summary-service" class="font-medium"></span></p>
                <p>Kuupäev: <span id="summary-date" class="font-medium"></span></p>
                <p>Kellaaeg: <span id="summary-time" class="font-medium"></span></p>
                <p>Hind: <span id="summary-price" class="font-medium"></span></p>
            </div>
        </div>

        <form id="booking-form" class="space-y-4">
            <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nimi *</label>
                <input type="text" name="client_name" required
                       class="border rounded-lg px-4 py-2 w-full" placeholder="Teie nimi">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input type="tel" name="client_phone" required
                       class="border rounded-lg px-4 py-2 w-full" placeholder="+372 5xxx xxxx">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                <input type="email" name="client_email"
                       class="border rounded-lg px-4 py-2 w-full" placeholder="teie@email.ee">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Märkmed</label>
                <textarea name="notes" rows="2"
                          class="border rounded-lg px-4 py-2 w-full" placeholder="Lisasoovid (valikuline)"></textarea>
            </div>

            <div class="flex gap-4">
                <button type="button" onclick="BookingWizard.goToStep(3)"
                        class="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">&larr; Tagasi</button>
                <button type="submit" id="submit-btn"
                        class="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                    Kinnita broneering
                </button>
            </div>
        </form>
    </div>

    <!-- Kinnituse leht -->
    <div id="step-confirmed" class="step-content hidden text-center py-12">
        <div class="text-5xl mb-4">&#9989;</div>
        <h2 class="text-2xl font-bold mb-2">Broneering kinnitatud!</h2>
        <p class="text-gray-600 mb-6">Teie broneering on edukalt registreeritud.</p>
        <div id="confirmed-details" class="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto text-left text-sm space-y-1 mb-6"></div>
        <a href="/" class="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">Tagasi avalehele</a>
    </div>

    <!-- Veateade -->
    <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-4"></div>
</section>

<script src="/public/js/booking.js"></script>
