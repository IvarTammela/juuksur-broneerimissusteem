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
$statusClass = $statusColors[$appointment['status']] ?? 'bg-gray-100 text-gray-700';
$statusLabel = $statusLabels[$appointment['status']] ?? $appointment['status'];
?>

<div class="mb-4">
    <a href="/admin/broneeringud" class="text-sm text-gray-500 hover:text-gray-700">&larr; Tagasi broneeringute juurde</a>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Broneeringu info -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">Broneeringu andmed</h2>
            <span class="text-sm px-3 py-1 rounded-full font-medium <?= $statusClass ?>">
                <?= $statusLabel ?>
            </span>
        </div>

        <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b pb-2">
                <span class="text-gray-500">Kuupäev</span>
                <span class="font-medium"><?= date('d.m.Y', strtotime($appointment['date'])) ?></span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="text-gray-500">Kellaaeg</span>
                <span class="font-medium"><?= htmlspecialchars($appointment['start_time']) ?> - <?= htmlspecialchars($appointment['end_time']) ?></span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="text-gray-500">Juuksur</span>
                <span class="font-medium"><?= htmlspecialchars($appointment['barber_name']) ?></span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="text-gray-500">Teenus</span>
                <span class="font-medium"><?= htmlspecialchars($appointment['service_name']) ?></span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="text-gray-500">Hind</span>
                <span class="font-medium"><?= number_format((float)$appointment['total_price'], 0) ?>&euro;</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Loodud</span>
                <span class="font-medium"><?= date('d.m.Y H:i', strtotime($appointment['created_at'])) ?></span>
            </div>
        </div>

        <?php if (!empty($appointment['notes'])): ?>
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Kliendi märkmed:</p>
                <p class="text-sm"><?= htmlspecialchars($appointment['notes']) ?></p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Kliendi info + staatuse muutmine -->
    <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="font-semibold mb-3">Kliendi andmed</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Nimi</span>
                    <span class="font-medium"><?= htmlspecialchars($appointment['client_name']) ?></span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Telefon</span>
                    <span class="font-medium"><?= htmlspecialchars($appointment['client_phone']) ?></span>
                </div>
                <?php if (!empty($appointment['client_email'])): ?>
                    <div class="flex justify-between">
                        <span class="text-gray-500">E-post</span>
                        <span class="font-medium"><?= htmlspecialchars($appointment['client_email']) ?></span>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="font-semibold mb-3">Muuda staatust</h3>
            <form method="POST" action="/admin/broneeringud/<?= htmlspecialchars($appointment['id']) ?>/staatus">
                <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                <div class="flex gap-2 flex-wrap">
                    <?php
                    $buttons = [
                        'CONFIRMED' => ['Kinnitatud', 'bg-blue-600 hover:bg-blue-700'],
                        'COMPLETED' => ['Tehtud', 'bg-green-600 hover:bg-green-700'],
                        'NO_SHOW'   => ['Ei tulnud', 'bg-yellow-600 hover:bg-yellow-700'],
                        'CANCELLED' => ['Tühista', 'bg-red-600 hover:bg-red-700'],
                    ];
                    foreach ($buttons as $status => [$label, $class]):
                        if ($status === $appointment['status']) continue;
                    ?>
                        <button type="submit" name="status" value="<?= $status ?>"
                                class="text-white text-sm px-4 py-2 rounded-lg <?= $class ?>">
                            <?= $label ?>
                        </button>
                    <?php endforeach; ?>
                </div>
            </form>
        </div>
    </div>
</div>
