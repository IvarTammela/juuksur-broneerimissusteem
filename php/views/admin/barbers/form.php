<?php
$isEdit = $barber !== null;
$isBarberRole = !empty($isBarber);
$backUrl = $isBarberRole ? '/admin' : '/admin/juuksurid';
?>

<div class="mb-4">
    <a href="<?= $backUrl ?>" class="text-sm text-gray-500 hover:text-gray-700">&larr; <?= $isBarberRole ? 'Tagasi dashboardile' : 'Tagasi juuksurite juurde' ?></a>
</div>

<h2 class="text-2xl font-bold mb-6"><?= $isBarberRole ? 'Minu profiil' : ($isEdit ? 'Muuda juuksurit' : 'Lisa juuksur') ?></h2>

<form method="POST" action="<?= $isEdit ? '/admin/juuksurid/' . $barber['id'] . '/uuenda' : '/admin/juuksurid/salvesta' ?>" class="space-y-6">
    <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

    <?php if (!$isBarberRole): ?>
    <div class="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h3 class="font-semibold border-b pb-2">Põhiandmed</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nimi *</label>
                <input type="text" name="name" required
                       value="<?= htmlspecialchars($barber['name'] ?? '') ?>"
                       class="border rounded-lg px-4 py-2 w-full">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                <input type="email" name="email"
                       value="<?= htmlspecialchars($barber['email'] ?? '') ?>"
                       class="border rounded-lg px-4 py-2 w-full">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input type="text" name="phone"
                       value="<?= htmlspecialchars($barber['phone'] ?? '') ?>"
                       class="border rounded-lg px-4 py-2 w-full">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Järjekord</label>
                <input type="number" name="sort_order"
                       value="<?= (int) ($barber['sort_order'] ?? 0) ?>"
                       class="border rounded-lg px-4 py-2 w-full">
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kirjeldus</label>
            <textarea name="bio_et" rows="3" class="border rounded-lg px-4 py-2 w-full"><?= htmlspecialchars($barber['bio_et'] ?? '') ?></textarea>
        </div>
        <div>
            <label class="flex items-center gap-2">
                <input type="checkbox" name="is_active" value="1"
                       <?= ($barber['is_active'] ?? true) ? 'checked' : '' ?>>
                <span class="text-sm">Aktiivne</span>
            </label>
        </div>
    </div>

    <!-- Parool -->
    <div class="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h3 class="font-semibold border-b pb-2">Sisselogimine</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parool <?= $isEdit ? '(jäta tühjaks, kui ei muuda)' : '' ?></label>
                <input type="password" name="password"
                       class="border rounded-lg px-4 py-2 w-full"
                       autocomplete="new-password">
            </div>
        </div>
        <?php if ($isEdit && !empty($barber['password_hash'])): ?>
            <p class="text-sm text-green-600">Parool on seatud — juuksur saab sisse logida.</p>
        <?php elseif ($isEdit): ?>
            <p class="text-sm text-gray-500">Parool pole seatud — juuksur ei saa sisse logida.</p>
        <?php endif; ?>
    </div>
    <?php endif; ?>

    <!-- Teenused ja hinnad -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="font-semibold border-b pb-2 mb-4">Teenused ja hinnad</h3>
        <div class="space-y-3">
            <?php foreach ($services as $service): ?>
                <?php
                $bs = $barberServices[$service['id']] ?? null;
                $checked = $bs !== null;
                ?>
                <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <label class="flex items-center gap-2 min-w-[200px]">
                        <input type="checkbox" name="services[<?= $service['id'] ?>][enabled]" value="1"
                               <?= $checked ? 'checked' : '' ?>>
                        <span class="text-sm font-medium"><?= htmlspecialchars($service['name_et']) ?></span>
                    </label>
                    <div class="flex items-center gap-2">
                        <label class="text-xs text-gray-500">Hind &euro;</label>
                        <input type="number" step="0.01" name="services[<?= $service['id'] ?>][price]"
                               value="<?= $bs ? number_format((float)$bs['price'], 2, '.', '') : '' ?>"
                               class="border rounded px-2 py-1 w-24 text-sm" placeholder="0.00">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs text-gray-500">Kestus min</label>
                        <input type="number" name="services[<?= $service['id'] ?>][duration]"
                               value="<?= $bs ? (int)$bs['duration'] : '' ?>"
                               class="border rounded px-2 py-1 w-20 text-sm" placeholder="30">
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Pausid -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between border-b pb-2 mb-4">
            <h3 class="font-semibold">Pausid</h3>
            <button type="button" id="add-break-btn" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">+ Lisa paus</button>
        </div>
        <div id="breaks-container" class="space-y-3">
            <?php
            $dayNames = [1 => 'E', 2 => 'T', 3 => 'K', 4 => 'N', 5 => 'R', 6 => 'L', 0 => 'P'];
            $existingBreaks = $breaks ?? [];
            foreach ($existingBreaks as $i => $brk): ?>
                <div class="break-row flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <select name="breaks[<?= $i ?>][day_of_week]" class="border rounded px-2 py-1 text-sm">
                        <?php foreach ($dayNames as $dv => $dl): ?>
                            <option value="<?= $dv ?>" <?= (int)$brk['day_of_week'] === $dv ? 'selected' : '' ?>><?= $dl ?></option>
                        <?php endforeach; ?>
                    </select>
                    <input type="time" name="breaks[<?= $i ?>][start_time]" value="<?= htmlspecialchars($brk['start_time']) ?>" class="border rounded px-2 py-1 text-sm" required>
                    <span class="text-gray-400">–</span>
                    <input type="time" name="breaks[<?= $i ?>][end_time]" value="<?= htmlspecialchars($brk['end_time']) ?>" class="border rounded px-2 py-1 text-sm" required>
                    <input type="text" name="breaks[<?= $i ?>][label]" value="<?= htmlspecialchars($brk['label'] ?? '') ?>" placeholder="Nimetus (nt Lõuna)" class="border rounded px-2 py-1 text-sm flex-1">
                    <button type="button" class="remove-break-btn text-red-500 hover:text-red-700 text-lg px-2">&times;</button>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="flex gap-4">
        <a href="<?= $backUrl ?>" class="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Tühista</a>
        <button type="submit" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            <?= $isBarberRole ? 'Salvesta' : ($isEdit ? 'Salvesta muudatused' : 'Lisa juuksur') ?>
        </button>
    </div>
</form>

<script>
(function() {
    const container = document.getElementById('breaks-container');
    const addBtn = document.getElementById('add-break-btn');
    const dayOptions = <?= json_encode(array_map(fn($dv, $dl) => ['value' => $dv, 'label' => $dl], array_keys($dayNames), array_values($dayNames))) ?>;

    function getNextIndex() {
        const rows = container.querySelectorAll('.break-row');
        let max = -1;
        rows.forEach(function(row) {
            const sel = row.querySelector('select');
            if (sel) {
                const m = sel.name.match(/breaks\[(\d+)\]/);
                if (m) max = Math.max(max, parseInt(m[1]));
            }
        });
        return max + 1;
    }

    addBtn.addEventListener('click', function() {
        const idx = getNextIndex();
        const row = document.createElement('div');
        row.className = 'break-row flex items-center gap-3 p-3 bg-gray-50 rounded-lg';

        let opts = '';
        dayOptions.forEach(function(d) {
            opts += '<option value="' + d.value + '">' + d.label + '</option>';
        });

        row.innerHTML =
            '<select name="breaks[' + idx + '][day_of_week]" class="border rounded px-2 py-1 text-sm">' + opts + '</select>' +
            '<input type="time" name="breaks[' + idx + '][start_time]" class="border rounded px-2 py-1 text-sm" required>' +
            '<span class="text-gray-400">–</span>' +
            '<input type="time" name="breaks[' + idx + '][end_time]" class="border rounded px-2 py-1 text-sm" required>' +
            '<input type="text" name="breaks[' + idx + '][label]" placeholder="Nimetus (nt Lõuna)" class="border rounded px-2 py-1 text-sm flex-1">' +
            '<button type="button" class="remove-break-btn text-red-500 hover:text-red-700 text-lg px-2">&times;</button>';

        container.appendChild(row);
    });

    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-break-btn')) {
            e.target.closest('.break-row').remove();
        }
    });
})();
</script>
