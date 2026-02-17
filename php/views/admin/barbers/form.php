<?php $isEdit = $barber !== null; ?>

<div class="mb-4">
    <a href="/admin/juuksurid" class="text-sm text-gray-500 hover:text-gray-700">&larr; Tagasi juuksurite juurde</a>
</div>

<h2 class="text-2xl font-bold mb-6"><?= $isEdit ? 'Muuda juuksurit' : 'Lisa juuksur' ?></h2>

<form method="POST" action="<?= $isEdit ? '/admin/juuksurid/' . $barber['id'] . '/uuenda' : '/admin/juuksurid/salvesta' ?>" class="space-y-6">
    <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

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

    <div class="flex gap-4">
        <a href="/admin/juuksurid" class="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Tühista</a>
        <button type="submit" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            <?= $isEdit ? 'Salvesta muudatused' : 'Lisa juuksur' ?>
        </button>
    </div>
</form>
