<header class="bg-white border-b px-6 py-3 flex justify-between items-center">
    <h1 class="font-semibold text-gray-800"><?= htmlspecialchars($title ?? 'Admin') ?></h1>
    <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500"><?= htmlspecialchars($userName ?? 'Admin') ?></span>
        <form method="POST" action="/admin/logout" class="inline">
            <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken ?? '') ?>">
            <button type="submit" class="text-sm text-red-600 hover:text-red-800">Logi välja</button>
        </form>
    </div>
</header>
