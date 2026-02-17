<h2 class="text-2xl font-bold mb-6">Broneeringud</h2>

<!-- Filtrid -->
<form method="GET" action="/admin/broneeringud" class="bg-white rounded-lg shadow-sm border p-4 mb-6 flex flex-wrap gap-4 items-end">
    <div>
        <label class="block text-sm text-gray-600 mb-1">Staatus</label>
        <select name="status" class="border rounded-lg px-3 py-2 text-sm">
            <option value="">Kõik</option>
            <option value="CONFIRMED" <?= ($filters['status'] ?? '') === 'CONFIRMED' ? 'selected' : '' ?>>Kinnitatud</option>
            <option value="COMPLETED" <?= ($filters['status'] ?? '') === 'COMPLETED' ? 'selected' : '' ?>>Tehtud</option>
            <option value="CANCELLED" <?= ($filters['status'] ?? '') === 'CANCELLED' ? 'selected' : '' ?>>Tühistatud</option>
            <option value="NO_SHOW" <?= ($filters['status'] ?? '') === 'NO_SHOW' ? 'selected' : '' ?>>Ei tulnud</option>
        </select>
    </div>
    <div>
        <label class="block text-sm text-gray-600 mb-1">Alates</label>
        <input type="date" name="from" value="<?= htmlspecialchars($filters['from'] ?? '') ?>"
               class="border rounded-lg px-3 py-2 text-sm">
    </div>
    <div>
        <label class="block text-sm text-gray-600 mb-1">Kuni</label>
        <input type="date" name="to" value="<?= htmlspecialchars($filters['to'] ?? '') ?>"
               class="border rounded-lg px-3 py-2 text-sm">
    </div>
    <button type="submit" class="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">Filtreeri</button>
    <a href="/admin/broneeringud" class="text-sm text-gray-500 hover:text-gray-700 py-2">Tühista</a>
</form>

<!-- Broneeringute tabel -->
<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    <?php if (empty($appointments)): ?>
        <div class="p-8 text-center text-gray-500">Broneeringuid ei leitud.</div>
    <?php else: ?>
        <table class="w-full">
            <thead class="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                    <th class="px-5 py-3">Kuupäev</th>
                    <th class="px-5 py-3">Aeg</th>
                    <th class="px-5 py-3">Klient</th>
                    <th class="px-5 py-3">Telefon</th>
                    <th class="px-5 py-3">Juuksur</th>
                    <th class="px-5 py-3">Teenus</th>
                    <th class="px-5 py-3">Hind</th>
                    <th class="px-5 py-3">Staatus</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                <?php foreach ($appointments as $apt): ?>
                    <?php
                    $statusColors = [
                        'CONFIRMED' => 'bg-blue-100 text-blue-700',
                        'COMPLETED' => 'bg-green-100 text-green-700',
                        'CANCELLED' => 'bg-red-100 text-red-700',
                        'NO_SHOW'   => 'bg-yellow-100 text-yellow-700',
                    ];
                    $statusLabels = [
                        'CONFIRMED' => 'Kinnitatud',
                        'COMPLETED' => 'Tehtud',
                        'CANCELLED' => 'Tühistatud',
                        'NO_SHOW'   => 'Ei tulnud',
                    ];
                    $statusClass = $statusColors[$apt['status']] ?? 'bg-gray-100 text-gray-700';
                    $statusLabel = $statusLabels[$apt['status']] ?? $apt['status'];
                    ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-5 py-3 text-sm"><?= date('d.m.Y', strtotime($apt['date'])) ?></td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['start_time']) ?> - <?= htmlspecialchars($apt['end_time']) ?></td>
                        <td class="px-5 py-3 text-sm font-medium">
                            <a href="/admin/broneeringud/<?= $apt['id'] ?>" class="text-blue-600 hover:underline">
                                <?= htmlspecialchars($apt['client_name']) ?>
                            </a>
                        </td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['client_phone']) ?></td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['barber_name']) ?></td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['service_name']) ?></td>
                        <td class="px-5 py-3 text-sm"><?= number_format((float)$apt['total_price'], 0) ?>&euro;</td>
                        <td class="px-5 py-3">
                            <span class="text-xs px-2 py-1 rounded-full font-medium <?= $statusClass ?>">
                                <?= $statusLabel ?>
                            </span>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<p class="text-sm text-gray-500 mt-4">Kokku: <?= count($appointments) ?> broneeringut</p>
