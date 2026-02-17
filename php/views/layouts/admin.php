<!DOCTYPE html>
<html lang="et">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title ?? 'Admin') ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/public/css/style.css">
</head>
<body class="min-h-screen bg-gray-100">
    <div class="flex min-h-screen">
        <?php require __DIR__ . '/../partials/admin-sidebar.php'; ?>

        <div class="flex-1">
            <?php require __DIR__ . '/../partials/admin-header.php'; ?>

            <main class="p-6">
                <?php $flashSuccess = \App\Core\Session::getFlash('success'); ?>
                <?php $flashError = \App\Core\Session::getFlash('error'); ?>

                <?php if ($flashSuccess): ?>
                    <div class="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4">
                        <?= htmlspecialchars($flashSuccess) ?>
                    </div>
                <?php endif; ?>

                <?php if ($flashError): ?>
                    <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
                        <?= htmlspecialchars($flashError) ?>
                    </div>
                <?php endif; ?>

                <?= $content ?>
            </main>
        </div>
    </div>

    <script src="/public/js/admin.js"></script>
</body>
</html>
