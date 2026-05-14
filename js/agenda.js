document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica das Abas ---
    const tabAgendar = document.getElementById('tab-agendar');
    const tabConsultas = document.getElementById('tab-consultas');
    const contentAgendar = document.getElementById('content-agendar');
    const contentConsultas = document.getElementById('content-consultas');

    if (tabAgendar && tabConsultas) {
        tabAgendar.addEventListener('click', () => {
            tabAgendar.classList.add('active');
            tabConsultas.classList.remove('active');
            contentAgendar.classList.remove('d-none');
            contentConsultas.classList.add('d-none');
        });

        tabConsultas.addEventListener('click', () => {
            tabConsultas.classList.add('active');
            tabAgendar.classList.remove('active');
            contentConsultas.classList.remove('d-none');
            contentAgendar.classList.add('d-none');
        });
    }

    // --- Lógica Tipo de Consulta (Presencial / Teleconsulta) ---
    const btnTipoPresencial = document.getElementById('btn-tipo-presencial');
    const btnTipoTeleconsulta = document.getElementById('btn-tipo-teleconsulta');
    let tipoConsultaAtual = 'Presencial';
    
    if (btnTipoPresencial && btnTipoTeleconsulta) {
        btnTipoPresencial.addEventListener('click', function() {
            tipoConsultaAtual = 'Presencial';
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
            tipoConsultaAtual = 'Teleconsulta';
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

    // --- Lógica Clínicas e Especialidades ---
    const selectClinica = document.getElementById('select-clinica');
    const selectEspecialidade = document.getElementById('select-especialidade');

    const especialidadesPorClinica = {
        "Saúde da Mulher": ["Ginecologia", "Obstetrícia", "Mastologista"],
        "Vida Plus": ["Clínico geral", "Cardiologia", "Geriatria", "Pediatria", "Pneumologia", "Endocrinologia", "Psiquiatria"],
        "Clínica Rios": ["Nefrologia", "Hematologia", "Gastroenterologia", "Urologia"]
    };

    if (selectClinica && selectEspecialidade) {
        selectClinica.addEventListener('change', function() {
            const clinicaSelecionada = this.value;
            const especialidades = especialidadesPorClinica[clinicaSelecionada] || [];

            selectEspecialidade.innerHTML = '<option selected disabled>Selecione uma especialidade</option>';
            
            if (especialidades.length > 0) {
                selectEspecialidade.disabled = false;
                especialidades.forEach(function(espec) {
                    const option = document.createElement('option');
                    option.value = espec;
                    option.textContent = espec;
                    selectEspecialidade.appendChild(option);
                });
            } else {
                selectEspecialidade.disabled = true;
                selectEspecialidade.innerHTML = '<option selected disabled>Nenhuma especialidade disponível</option>';
            }
        });
    }

    // --- Lógica do botão Agendar para preencher o Modal ---
    const btnAgendar = document.getElementById('btn-agendar');
    if (btnAgendar) {
        btnAgendar.addEventListener('click', function() {
            const clinica = selectClinica && selectClinica.value !== 'Selecione uma clínica' ? selectClinica.value : 'sua clínica';
            const especialidade = selectEspecialidade && selectEspecialidade.value !== 'Selecione uma especialidade' ? selectEspecialidade.value : 'Clínica Geral';
            
            const selectHorario = document.getElementById('select-horario');
            let horario = "um horário";
            if (selectHorario && selectHorario.selectedIndex > 0) {
                horario = selectHorario.options[selectHorario.selectedIndex].text;
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

// --- Função Global para Confirmar o Agendamento ---
function confirmarAgendamento() {
    const selectClinica = document.getElementById('select-clinica');
    const selectEspecialidade = document.getElementById('select-especialidade');
    const selectHorario = document.getElementById('select-horario');
    const inputData = document.getElementById('input-data');

    const clinica = selectClinica && selectClinica.value !== 'Selecione uma clínica' ? selectClinica.value : 'Clínica Padrão';
    const especialidade = selectEspecialidade && selectEspecialidade.value !== 'Selecione uma especialidade' && selectEspecialidade.value !== 'Selecione a clínica primeiro' ? selectEspecialidade.value : 'Consulta';
    const horario = selectHorario && selectHorario.selectedIndex > 0 ? selectHorario.options[selectHorario.selectedIndex].text : 'Horário a definir';
    
    // Formatar data se houver
    let dataFormatada = "Data não informada";
    if (inputData && inputData.value) {
        const d = new Date(inputData.value + "T12:00:00"); // Add T12 to avoid timezone shift
        dataFormatada = d.toLocaleDateString('pt-BR');
    }

    // Criar o card e adicionar à aba de consultas
    const contentConsultas = document.getElementById('content-consultas');
    if (contentConsultas) {
        const novoCard = document.createElement('div');
        novoCard.className = "border rounded-4 p-4 d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3";
        novoCard.innerHTML = `
            <div>
                <h5 class="fw-bold mb-3" style="color: #002c5c;">Consulta: ${especialidade}</h5>
                <div class="d-flex gap-4 text-secondary">
                    <span class="d-flex align-items-center bg-light rounded-pill px-3 py-1" style="font-size: 0.9rem;">
                        <i class="bi bi-calendar-event me-2 text-primary"></i> ${dataFormatada}
                    </span>
                    <span class="d-flex align-items-center bg-light rounded-pill px-3 py-1" style="font-size: 0.9rem;">
                        <i class="bi bi-clock me-2 text-primary"></i> às ${horario}
                    </span>
                    <span class="d-flex align-items-center" style="font-size: 0.9rem;">
                        <i class="bi bi-geo-alt me-2"></i> ${clinica}
                    </span>
                </div>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-primary px-4 rounded-3" style="background-color: #0071bc; border-color: #0071bc;">Remarcar</button>
                <button class="btn btn-outline-danger px-4 rounded-3" style="color: #e56b46; border-color: #e56b46;">Cancelar</button>
            </div>
        `;
        
        // Inserir após o parágrafo "Próximas consultas"
        const pElement = contentConsultas.querySelector('p.text-secondary');
        if (pElement && pElement.nextSibling) {
            contentConsultas.insertBefore(novoCard, pElement.nextSibling);
        } else {
            contentConsultas.appendChild(novoCard);
        }

        // Alterar para a aba Consultas
        const tabAgendar = document.getElementById('tab-agendar');
        const tabConsultas = document.getElementById('tab-consultas');
        const contentAgendar = document.getElementById('content-agendar');

        if (tabConsultas) tabConsultas.classList.add('active');
        if (tabAgendar) tabAgendar.classList.remove('active');
        if (contentConsultas) contentConsultas.classList.remove('d-none');
        if (contentAgendar) contentAgendar.classList.add('d-none');

        // Mostrar o alerta de sucesso
        setTimeout(() => {
            alert('Consulta agendada com sucesso!');
        }, 100); // pequeno delay para garantir que o modal feche antes
    }
}
