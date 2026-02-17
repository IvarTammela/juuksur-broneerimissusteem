<header class="bg-white shadow-sm border-b">
    <nav class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-900">
            &#9986; <?= htmlspecialchars($settings['salon_name_et'] ?? 'Juuksurisalong') ?>
        </a>
        <div class="flex items-center gap-6">
            <a href="/" class="text-gray-600 hover:text-gray-900 <?= ($_SERVER['REQUEST_URI'] === '/') ? 'font-semibold text-gray-900' : '' ?>">Avaleht</a>
            <a href="/teenused" class="text-gray-600 hover:text-gray-900 <?= str_starts_with($_SERVER['REQUEST_URI'], '/teenused') ? 'font-semibold text-gray-900' : '' ?>">Teenused</a>
            <a href="/juuksurid" class="text-gray-600 hover:text-gray-900 <?= str_starts_with($_SERVER['REQUEST_URI'], '/juuksurid') ? 'font-semibold text-gray-900' : '' ?>">Juuksurid</a>
            <a href="/broneeri" class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Broneeri aeg</a>
        </div>
    </nav>
</header>
