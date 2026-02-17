<?php $isEdit = $service !== null; ?>

<div class="mb-4">
    <a href="/admin/teenused" class="text-sm text-gray-500 hover:text-gray-700">&larr; Tagasi teenuste juurde</a>
</div>

<h2 class="text-2xl font-bold mb-6"><?= $isEdit ? 'Muuda teenust' : 'Lisa teenus' ?></h2>

<form method="POST" action="<?= $isEdit ? '/admin/teenused/' . $service['id'] . '/uuenda' : '/admin/teenused/salvesta' ?>" class="max-w-xl">
    <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

    <div class="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nimi (eesti keeles) *</label>
            <input type="text" name="name_et" required
                   value="<?= htmlspecialchars($service['name_et'] ?? '') ?>"
                   class="border rounded-lg px-4 py-2 w-full">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nimi (inglise keeles)</label>
            <input type="text" name="name"
                   value="<?= htmlspecialchars($service['name'] ?? '') ?>"
                   class="border rounded-lg px-4 py-2 w-full">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kirjeldus</label>
            <textarea name="description_et" rows="3" class="border rounded-lg px-4 py-2 w-full"><?= htmlspecialchars($service['description_et'] ?? '') ?></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategooria</label>
                <input type="text" name="category_et"
                       value="<?= htmlspecialchars($service['category_et'] ?? '') ?>"
                       class="border rounded-lg px-4 py-2 w-full" placeholder="nt Lõikus, Värvimine">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Järjekord</label>
                <input type="number" name="sort_order"
                       value="<?= (int) ($service['sort_order'] ?? 0) ?>"
                       class="border rounded-lg px-4 py-2 w-full">
            </div>
        </div>
        <div>
            <label class="flex items-center gap-2">
                <input type="checkbox" name="is_active" value="1"
                       <?= ($service['is_active'] ?? true) ? 'checked' : '' ?>>
                <span class="text-sm">Aktiivne</span>
            </label>
        </div>
    </div>

    <div class="flex gap-4 mt-6">
        <a href="/admin/teenused" class="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Tühista</a>
        <button type="submit" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            <?= $isEdit ? 'Salvesta muudatused' : 'Lisa teenus' ?>
        </button>
    </div>
</form>
