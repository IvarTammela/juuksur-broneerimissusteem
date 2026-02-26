<?php $isBarberRole = \App\Core\Session::get('user_role') === 'BARBER'; ?>
<aside class="w-60 bg-gray-900 text-white min-h-screen p-4">
    <div class="mb-8">
        <a href="/admin" class="text-lg font-bold">&#9986; <?= $isBarberRole ? 'Minu paneel' : 'Admin' ?></a>
    </div>
    <nav class="space-y-1">
        <a href="/admin"
           class="block px-3 py-2 rounded-lg text-sm <?= $_SERVER['REQUEST_URI'] === '/admin' ? 'bg-gray-700 font-semibold' : 'text-gray-300 hover:bg-gray-800' ?>">
            Dashboard
        </a>
        <a href="/admin/broneeringud"
           class="block px-3 py-2 rounded-lg text-sm <?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/broneeringud') ? 'bg-gray-700 font-semibold' : 'text-gray-300 hover:bg-gray-800' ?>">
            Broneeringud
        </a>
        <?php if ($isBarberRole): ?>
            <a href="/admin/juuksurid/<?= htmlspecialchars(\App\Core\Session::get('barber_id')) ?>"
               class="block px-3 py-2 rounded-lg text-sm <?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/juuksurid') ? 'bg-gray-700 font-semibold' : 'text-gray-300 hover:bg-gray-800' ?>">
                Minu profiil
            </a>
        <?php else: ?>
            <a href="/admin/juuksurid"
               class="block px-3 py-2 rounded-lg text-sm <?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/juuksurid') ? 'bg-gray-700 font-semibold' : 'text-gray-300 hover:bg-gray-800' ?>">
                Juuksurid
            </a>
            <a href="/admin/teenused"
               class="block px-3 py-2 rounded-lg text-sm <?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/teenused') ? 'bg-gray-700 font-semibold' : 'text-gray-300 hover:bg-gray-800' ?>">
                Teenused
            </a>
        <?php endif; ?>
    </nav>
    <div class="mt-auto pt-8 border-t border-gray-700 mt-8">
        <a href="/" class="block px-3 py-2 text-sm text-gray-400 hover:text-white">
            &larr; Tagasi saidile
        </a>
    </div>
</aside>
