<section class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Meie juuksurid</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($barbers as $barber): ?>
            <div class="bg-white rounded-xl shadow-sm border p-6">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl text-gray-500 font-bold">
                        <?= mb_substr($barber['name'], 0, 1) ?>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold"><?= htmlspecialchars($barber['name']) ?></h2>
                        <?php if (!empty($barber['phone'])): ?>
                            <p class="text-gray-500 text-sm"><?= htmlspecialchars($barber['phone']) ?></p>
                        <?php endif; ?>
                    </div>
                </div>

                <?php if (!empty($barber['bio_et'])): ?>
                    <p class="text-gray-600 mb-4"><?= htmlspecialchars($barber['bio_et']) ?></p>
                <?php endif; ?>

                <?php if (!empty($barber['services'])): ?>
                    <h3 class="font-semibold text-sm text-gray-700 mb-2">Teenused:</h3>
                    <div class="space-y-1">
                        <?php foreach ($barber['services'] as $service): ?>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600"><?= htmlspecialchars($service['name_et']) ?></span>
                                <span class="font-medium"><?= number_format((float)$service['price'], 0) ?>&euro; (<?= $service['duration'] ?> min)</span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <div class="mt-4">
                    <a href="/broneeri" class="block text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm">
                        Broneeri aeg
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>
