document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica da página agenda.html ---
    const btnTipoPresencial = document.getElementById('btn-tipo-presencial');
    const btnTipoTeleconsulta = document.getElementById('btn-tipo-teleconsulta');
    
    if (btnTipoPresencial && btnTipoTeleconsulta) {
        btnTipoPresencial.addEventListener('click', function() {
            btnTipoPresencial.classList.replace('btn-outline-secondary', 'btn-primary');
            btnTipoPresencial.classList.replace('bg-white', 'bg-primary');
            btnTipoPresencial.style.color = '#fff';
            
            btnTipoTeleconsulta.classList.replace('btn-primary', 'btn-outline-secondary');
            btnTipoTeleconsulta.classList.add('bg-white');
            btnTipoTeleconsulta.style.color = '#6c757d';
        });

        btnTipoTeleconsulta.addEventListener('click', function() {
            btnTipoTeleconsulta.classList.replace('btn-outline-secondary', 'btn-primary');
            btnTipoTeleconsulta.classList.remove('bg-white');
            btnTipoTeleconsulta.style.color = '#fff';
            
            btnTipoPresencial.classList.replace('btn-primary', 'btn-outline-secondary');
            btnTipoPresencial.classList.add('bg-white');
            btnTipoPresencial.style.color = '#6c757d';
        });
    }

    // Seleção de Horários (agenda.html)
    const timeButtons = document.querySelectorAll('.time-slot-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove a seleção de todos
            timeButtons.forEach(b => {
                b.style.backgroundColor = '#eef2ff';
                b.style.color = '#0d6efd';
                b.classList.remove('selected-time');
            });
            // Adiciona ao clicado
            this.style.backgroundColor = '#0d6efd';
            this.style.color = '#fff';
            this.classList.add('selected-time');
        });
    });

    // Lógica para o Modal de Confirmação (agenda.html)
    const btnAgendar = document.getElementById('btn-agendar');
    if (btnAgendar) {
        btnAgendar.addEventListener('click', function() {
            const especialidadeInput = document.getElementById('input-especialidade');
            const clinicaInput = document.getElementById('input-clinica');
            
            const especialidade = especialidadeInput && especialidadeInput.value ? especialidadeInput.value : 'Clínica Geral';
            const clinica = clinicaInput && clinicaInput.value ? clinicaInput.value : 'sua clínica';
            
            let horarioSelecionado = "um horário";
            const btnHorarioAtivo = document.querySelector('.time-slot-btn.selected-time');
            if (btnHorarioAtivo) {
                horarioSelecionado = btnHorarioAtivo.innerText;
            }

            document.getElementById('modal-especialidade').innerText = especialidade;
            document.getElementById('modal-horario').innerText = horarioSelecionado;
            document.getElementById('modal-clinica').innerText = clinica;
        });
    }

});
