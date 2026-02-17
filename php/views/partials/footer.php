<footer class="bg-white border-t mt-auto">
    <div class="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        <p>&copy; <?= date('Y') ?> <?= htmlspecialchars($settings['salon_name_et'] ?? 'Juuksurisalong') ?>. Kõik õigused kaitstud.</p>
        <?php if (!empty($settings['address'])): ?>
            <p class="mt-1"><?= htmlspecialchars($settings['address']) ?> | <?= htmlspecialchars($settings['phone'] ?? '') ?></p>
        <?php endif; ?>
    </div>
</footer>
