document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica da página index.html ---
    const toggleTelemedicina = document.getElementById('toggleTelemedicina');
    const togglePresencial = document.getElementById('togglePresencial');
    const btnTelemedicina = document.getElementById('btn-telemedicina');
    const btnPresencial = document.getElementById('btn-presencial');

    function updateStyles() {
        if (!toggleTelemedicina || !togglePresencial) return; // Só executa se os elementos existirem

        if (toggleTelemedicina.checked) {
            btnTelemedicina.classList.remove('bg-light', 'text-secondary', 'border');
            btnTelemedicina.classList.add('bg-primary', 'text-white');
            togglePresencial.checked = false;
        } else {
            btnTelemedicina.classList.remove('bg-primary', 'text-white');
            btnTelemedicina.classList.add('bg-light', 'text-secondary', 'border');
        }

        if (togglePresencial.checked) {
            btnPresencial.classList.remove('bg-light', 'text-secondary', 'border');
            btnPresencial.classList.add('bg-primary', 'text-white');
            toggleTelemedicina.checked = false;
            btnTelemedicina.classList.remove('bg-primary', 'text-white');
            btnTelemedicina.classList.add('bg-light', 'text-secondary', 'border');
        } else {
            btnPresencial.classList.remove('bg-primary', 'text-white');
            btnPresencial.classList.add('bg-light', 'text-secondary', 'border');
        }
    }

    if (toggleTelemedicina && togglePresencial) {
        toggleTelemedicina.addEventListener('change', updateStyles);
        togglePresencial.addEventListener('change', updateStyles);
        updateStyles();
    }
});
