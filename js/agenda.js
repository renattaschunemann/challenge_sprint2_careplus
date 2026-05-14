document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica das Abas ---
    const tabAgendar = document.getElementById('tab-agendar');
    const tabConsultas = document.getElementById('tab-consultas');
    const contentAgendar = document.getElementById('content-agendar');
    const contentConsultas = document.getElementById('content-consultas');

    if (tabAgendar && tabConsultas) {
        tabAgendar.addEventListener('click', () => {
            // Ativa tab Agendar
            tabAgendar.classList.add('active');
            tabConsultas.classList.remove('active');
            // Mostra conteudo Agendar
            contentAgendar.classList.remove('d-none');
            contentConsultas.classList.add('d-none');
        });

        tabConsultas.addEventListener('click', () => {
            // Ativa tab Consultas
            tabConsultas.classList.add('active');
            tabAgendar.classList.remove('active');
            // Mostra conteudo Consultas
            contentConsultas.classList.remove('d-none');
            contentAgendar.classList.add('d-none');
        });
    }

    // --- Lógica Tipo de Consulta (Presencial / Teleconsulta) ---
    const btnTipoPresencial = document.getElementById('btn-tipo-presencial');
    const btnTipoTeleconsulta = document.getElementById('btn-tipo-teleconsulta');
    
    if (btnTipoPresencial && btnTipoTeleconsulta) {
        btnTipoPresencial.addEventListener('click', function() {
            btnTipoPresencial.classList.replace('btn-outline-secondary', 'btn-primary');
            btnTipoPresencial.classList.replace('bg-white', 'bg-primary');
            btnTipoPresencial.style.backgroundColor = '#003366';
            btnTipoPresencial.style.borderColor = '#003366';
            btnTipoPresencial.style.color = '#fff';
            
            btnTipoTeleconsulta.classList.replace('btn-primary', 'btn-outline-secondary');
            btnTipoTeleconsulta.classList.add('bg-white');
            btnTipoTeleconsulta.style.backgroundColor = 'transparent';
            btnTipoTeleconsulta.style.color = '#6c757d';
        });

        btnTipoTeleconsulta.addEventListener('click', function() {
            btnTipoTeleconsulta.classList.replace('btn-outline-secondary', 'btn-primary');
            btnTipoTeleconsulta.classList.remove('bg-white');
            btnTipoTeleconsulta.style.backgroundColor = '#003366';
            btnTipoTeleconsulta.style.borderColor = '#003366';
            btnTipoTeleconsulta.style.color = '#fff';
            
            btnTipoPresencial.classList.replace('btn-primary', 'btn-outline-secondary');
            btnTipoPresencial.classList.add('bg-white');
            btnTipoPresencial.style.backgroundColor = 'transparent';
            btnTipoPresencial.style.color = '#6c757d';
        });
    }

    // Lógica do botão Agendar para preencher o Modal
    const btnAgendar = document.getElementById('btn-agendar');
    if (btnAgendar) {
        btnAgendar.addEventListener('click', function() {
            // Pegando os inputs atuais da nova estrutura
            const inputs = contentAgendar.querySelectorAll('input.form-control, select.form-select');
            
            const clinica = inputs[0] && inputs[0].value ? inputs[0].value : 'sua clínica';
            const especialidade = inputs[1] && inputs[1].value ? inputs[1].value : 'Clínica Geral';
            
            // O select de horário é o segundo select ou terceiro input
            const selects = contentAgendar.querySelectorAll('select.form-select');
            let horario = "um horário";
            if (selects[0] && selects[0].options[selects[0].selectedIndex].text !== "Selecione um horário") {
                horario = selects[0].options[selects[0].selectedIndex].text;
            }

            const modalEspec = document.getElementById('modal-especialidade');
            const modalHora = document.getElementById('modal-horario');
            const modalClinica = document.getElementById('modal-clinica');

            if (modalEspec) modalEspec.innerText = especialidade;
            if (modalHora) modalHora.innerText = horario;
            if (modalClinica) modalClinica.innerText = clinica;
        });
    }

});
