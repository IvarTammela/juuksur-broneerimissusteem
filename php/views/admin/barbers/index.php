<div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">Juuksurid</h2>
    <a href="/admin/juuksurid/lisa" class="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">+ Lisa juuksur</a>
</div>

<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    <?php if (empty($barbers)): ?>
        <div class="p-8 text-center text-gray-500">Juuksureid pole lisatud.</div>
    <?php else: ?>
        <table class="w-full">
            <thead class="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                    <th class="px-5 py-3">Nimi</th>
                    <th class="px-5 py-3">E-post</th>
                    <th class="px-5 py-3">Telefon</th>
                    <th class="px-5 py-3">Staatus</th>
                    <th class="px-5 py-3">Tegevused</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                <?php foreach ($barbers as $barber): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-5 py-3 font-medium"><?= htmlspecialchars($barber['name']) ?></td>
                        <td class="px-5 py-3 text-sm text-gray-600"><?= htmlspecialchars($barber['email'] ?? '-') ?></td>
                        <td class="px-5 py-3 text-sm text-gray-600"><?= htmlspecialchars($barber['phone'] ?? '-') ?></td>
                        <td class="px-5 py-3">
                            <?php if ($barber['is_active']): ?>
                                <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Aktiivne</span>
                            <?php else: ?>
                                <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Mitteaktiivne</span>
                            <?php endif; ?>
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex gap-2">
                                <a href="/admin/juuksurid/<?= $barber['id'] ?>" class="text-sm text-blue-600 hover:underline">Muuda</a>
                                <form method="POST" action="/admin/juuksurid/<?= $barber['id'] ?>/kustuta"
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
