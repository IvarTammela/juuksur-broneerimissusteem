<!-- Hero sektsioon -->
<section class="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-20">
    <div class="max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4"><?= htmlspecialchars($settings['salon_name_et'] ?? 'Juuksurisalong') ?></h1>
        <p class="text-xl text-gray-300 mb-8">Professionaalne juuksuriteenus Tallinnas</p>
        <a href="/broneeri" class="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition">
            Broneeri aeg
        </a>
    </div>
</section>

<!-- Meie juuksurid -->
<section class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-center mb-10">Meie juuksurid</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <?php foreach ($barbers as $barber): ?>
            <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
                <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-gray-500">
                    <?= mb_substr($barber['name'], 0, 1) ?>
                </div>
                <h3 class="text-xl font-semibold mb-2"><?= htmlspecialchars($barber['name']) ?></h3>
                <p class="text-gray-600 text-sm"><?= htmlspecialchars($barber['bio_et'] ?? '') ?></p>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Info sektsioon -->
<section class="bg-white py-16">
    <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
                <div class="text-3xl mb-3">&#128197;</div>
                <h3 class="font-semibold text-lg mb-2">Lihtne broneerimine</h3>
                <p class="text-gray-600">Vali juuksur, teenus ja sobiv aeg - kõik online.</p>
            </div>
            <div>
                <div class="text-3xl mb-3">&#9201;</div>
                <h3 class="font-semibold text-lg mb-2">Paindlik ajakava</h3>
                <p class="text-gray-600">Avatud E-R 9-18, L 10-16. Lõunapaus 12-13.</p>
            </div>
            <div>
                <div class="text-3xl mb-3">&#11088;</div>
                <h3 class="font-semibold text-lg mb-2">Kogenud meeskond</h3>
                <p class="text-gray-600">Professionaalsed juuksurid aastatepikkuse kogemusega.</p>
            </div>
        </div>
    </div>
</section>
