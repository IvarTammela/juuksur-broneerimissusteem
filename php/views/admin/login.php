<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div class="text-center mb-6">
            <h1 class="text-2xl font-bold">&#9986; Admin</h1>
            <p class="text-gray-500 text-sm">Logige sisse halduspaneeli</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="/admin/login" class="space-y-4">
            <input type="hidden" name="_csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                <input type="email" name="email" required autofocus
                       class="border rounded-lg px-4 py-2 w-full" placeholder="admin@juuksur.ee">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parool</label>
                <input type="password" name="password" required
                       class="border rounded-lg px-4 py-2 w-full" placeholder="Parool">
            </div>
            <button type="submit" class="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
                Logi sisse
            </button>
        </form>

        <p class="text-center text-sm text-gray-400 mt-4">
            <a href="/" class="hover:text-gray-600">&larr; Tagasi avalehele</a>
        </p>
    </div>
</div>
