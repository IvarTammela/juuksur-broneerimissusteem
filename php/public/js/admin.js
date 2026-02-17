/**
 * Admin lehtede interaktsioonid
 */
document.addEventListener('DOMContentLoaded', () => {
    // Staatuse muutmise kinnitamine
    const statusForms = document.querySelectorAll('form[action*="/staatus"]');
    statusForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const button = e.submitter;
            if (button && button.value === 'CANCELLED') {
                if (!confirm('Kas olete kindel, et soovite broneeringu tühistada?')) {
                    e.preventDefault();
                }
            }
        });
    });
});
