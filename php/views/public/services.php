<section class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Teenused</h1>

    <?php
    $categories = [];
    foreach ($services as $service) {
        $cat = $service['category_et'] ?? 'Muu';
        $categories[$cat][] = $service;
    }
    ?>

    <?php foreach ($categories as $category => $catServices): ?>
        <div class="mb-10">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2"><?= htmlspecialchars($category) ?></h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <?php foreach ($catServices as $service): ?>
                    <div class="bg-white rounded-lg shadow-sm border p-5 flex justify-between items-center gap-4">
                        <div class="min-w-0">
                            <h3 class="font-semibold text-lg"><?= htmlspecialchars($service['name_et']) ?></h3>
                            <?php if (!empty($service['description_et'])): ?>
                                <p class="text-gray-600 text-sm mt-1"><?= htmlspecialchars($service['description_et']) ?></p>
                            <?php endif; ?>
                            <?php if ($service['min_duration']): ?>
                                <p class="text-gray-500 text-xs mt-2">Alates <?= $service['min_duration'] ?> min</p>
                            <?php endif; ?>
                        </div>
                        <div class="text-right shrink-0">
                            <?php if ($service['min_price']): ?>
                                <span class="text-lg font-bold whitespace-nowrap">
                                    <?php if ($service['min_price'] === $service['max_price']): ?>
                                        <?= number_format((float)$service['min_price'], 0) ?>&euro;
                                    <?php else: ?>
                                        <?= number_format((float)$service['min_price'], 0) ?>-<?= number_format((float)$service['max_price'], 0) ?>&euro;
                                    <?php endif; ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endforeach; ?>

    <div class="text-center mt-8">
        <a href="/broneeri" class="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition">
            Broneeri aeg
        </a>
    </div>
</section>
