<div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">Teenused</h2>
    <a href="/admin/teenused/lisa" class="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">+ Lisa teenus</a>
</div>

<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    <?php if (empty($services)): ?>
        <div class="p-8 text-center text-gray-500">Teenuseid pole lisatud.</div>
    <?php else: ?>
        <table class="w-full">
            <thead class="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                    <th class="px-5 py-3">Nimi</th>
                    <th class="px-5 py-3">Kategooria</th>
                    <th class="px-5 py-3">Staatus</th>
                    <th class="px-5 py-3">Tegevused</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                <?php foreach ($services as $service): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-5 py-3">
                            <div class="font-medium"><?= htmlspecialchars($service['name_et']) ?></div>
                            <?php if (!empty($service['description_et'])): ?>
                                <div class="text-xs text-gray-500"><?= htmlspecialchars($service['description_et']) ?></div>
                            <?php endif; ?>
                        </td>
                        <td class="px-5 py-3 text-sm text-gray-600"><?= htmlspecialchars($service['category_et'] ?? '-') ?></td>
                        <td class="px-5 py-3">
                            <?php if ($service['is_active']): ?>
                                <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Aktiivne</span>
                            <?php else: ?>
                                <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Mitteaktiivne</span>
                            <?php endif; ?>
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex gap-2">
                                <a href="/admin/teenused/<?= $service['id'] ?>" class="text-sm text-blue-600 hover:underline">Muuda</a>
                                <form method="POST" action="/admin/teenused/<?= $service['id'] ?>/kustuta"
                                      onsubmit="return confirm('Kas olete kindel?')">
                                    <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                                    <button type="submit" class="text-sm text-red-600 hover:underline">Kustuta</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>
