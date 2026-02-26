<h2 class="text-2xl font-bold mb-6">Dashboard</h2>

<!-- Statistika kaardid -->
<div class="grid grid-cols-1 md:grid-cols-<?= !empty($isBarber) ? '2' : '3' ?> gap-4 mb-8">
    <div class="bg-white rounded-lg shadow-sm border p-5">
        <p class="text-gray-500 text-sm"><?= !empty($isBarber) ? 'Minu tänased broneeringud' : 'Tänased broneeringud' ?></p>
        <p class="text-3xl font-bold mt-1"><?= $todayCount ?></p>
    </div>
    <div class="bg-white rounded-lg shadow-sm border p-5">
        <p class="text-gray-500 text-sm"><?= !empty($isBarber) ? 'Minu nädala broneeringud' : 'Selle nädala broneeringud' ?></p>
        <p class="text-3xl font-bold mt-1"><?= $weekCount ?></p>
    </div>
    <?php if (empty($isBarber)): ?>
    <div class="bg-white rounded-lg shadow-sm border p-5">
        <p class="text-gray-500 text-sm">Aktiivsed juuksurid</p>
        <p class="text-3xl font-bold mt-1"><?= $barbersCount ?></p>
    </div>
    <?php endif; ?>
</div>

<!-- Tulevased broneeringud -->
<div class="bg-white rounded-lg shadow-sm border">
    <div class="p-5 border-b flex justify-between items-center">
        <h3 class="font-semibold">Tulevased broneeringud</h3>
        <a href="/admin/broneeringud" class="text-sm text-blue-600 hover:text-blue-800">Vaata kõiki &rarr;</a>
    </div>

    <?php if (empty($upcoming)): ?>
        <div class="p-8 text-center text-gray-500">
            Tulevasi broneeringuid pole.
        </div>
    <?php else: ?>
        <table class="w-full">
            <thead class="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                    <th class="px-5 py-3">Kuupäev</th>
                    <th class="px-5 py-3">Aeg</th>
                    <th class="px-5 py-3">Klient</th>
                    <th class="px-5 py-3">Juuksur</th>
                    <th class="px-5 py-3">Teenus</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                <?php foreach ($upcoming as $apt): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-5 py-3 text-sm"><?= date('d.m.Y', strtotime($apt['date'])) ?></td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['start_time']) ?></td>
                        <td class="px-5 py-3 text-sm font-medium">
                            <a href="/admin/broneeringud/<?= $apt['id'] ?>" class="text-blue-600 hover:underline">
                                <?= htmlspecialchars($apt['client_name']) ?>
                            </a>
                        </td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['barber_name']) ?></td>
                        <td class="px-5 py-3 text-sm"><?= htmlspecialchars($apt['service_name']) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>
