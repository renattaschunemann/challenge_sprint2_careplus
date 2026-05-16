function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content-section');
    contents.forEach(content => {
        content.classList.add('d-none');
    });
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('tab-btn-outline');
    });
    document.getElementById(`content-${tabId}`).classList.remove('d-none');
    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('tab-btn-outline');
    }
}
function remarcarExame() {
    alert("Iniciando processo de remarcação. Você será redirecionado para a agenda.");
    window.location.href = "agenda.html";
}
function agendarExame() {
    window.location.href = "agenda.html";
}
let exameEmFoco = "";
let idEmFoco = null; 
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        switchTab(tabParam);
    }
    renderizarAgendados();
});
function renderizarAgendados() {
    const lista = document.getElementById('listaAgendados');
    if (!lista) return;
    let agendamentos = JSON.parse(localStorage.getItem('agendamentosExames') || '[]');
    const dynamicItems = document.querySelectorAll('.dynamic-agendado');
    dynamicItems.forEach(item => item.remove());
    agendamentos.forEach((agendamento, index) => {
        const div = document.createElement('div');
        div.className = 'border rounded-4 p-4 mb-3 item-agendado dynamic-agendado';
        div.innerHTML = `
            <h5 class="fw-bold mb-3 text-navy">${agendamento.nome}</h5>
            <div class="d-flex flex-wrap gap-4 text-secondary mb-4">
                <span class="d-flex align-items-center font-md">
                    <i class="bi bi-calendar3 me-2"></i> ${agendamento.data}
                </span>
                <span class="d-flex align-items-center font-md">
                    <i class="bi bi-clock me-2"></i> às ${agendamento.hora}
                </span>
            </div>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <span class="d-flex align-items-center text-secondary font-md">
                    <i class="bi bi-geo-alt me-2"></i> Care Plus Clinic
                </span>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary px-4 rounded-3 fw-medium bg-secondary-brand border-secondary-brand" onclick="solicitarRemarcacaoFuturoID(${index}, '${agendamento.nome}')">Remarcar</button>
                    <button class="btn btn-outline-danger px-4 rounded-3 fw-medium text-brand-danger border-brand-danger" onclick="cancelarAgendamentoFuturoID('${index}')">Desmarcar</button>
                </div>
            </div>
        `;
        lista.appendChild(div);
    });
}
function filtrarExames() {
    const input = document.getElementById('buscaExames');
    const filter = input.value.toLowerCase();
    const exames = document.querySelectorAll('.item-exame');
    exames.forEach(exame => {
        const texto = exame.innerText.toLowerCase();
        if (texto.includes(filter)) {
            exame.classList.remove('d-none');
        } else {
            exame.classList.add('d-none');
        }
    });
}
function filtrarCategoria(categoria) {
    const exames = document.querySelectorAll('.item-exame');
    exames.forEach(exame => {
        if (categoria === 'Todos') {
            exame.classList.remove('d-none');
        } else {
            const cats = exame.getAttribute('data-cat') || '';
            if (cats.includes(categoria)) {
                exame.classList.remove('d-none');
            } else {
                exame.classList.add('d-none');
            }
        }
    });
}
function abrirModalHorario(nomeExame) {
    exameEmFoco = nomeExame;
    idEmFoco = null; 
    document.getElementById('spanNomeExameHorario').innerText = nomeExame;
    document.getElementById('inputDataExame').value = "";
    document.getElementById('selectHoraExame').value = "";
    var modal = new bootstrap.Modal(document.getElementById('modalEscolherHorario'));
    modal.show();
}
function confirmarAgendamentoComHorario() {
    const data = document.getElementById('inputDataExame').value;
    const hora = document.getElementById('selectHoraExame').value;
    if (!data || !hora) {
        alert("Por favor, selecione uma data e um horário.");
        return;
    }
    var modalHorarioEl = document.getElementById('modalEscolherHorario');
    var modalHorario = bootstrap.Modal.getInstance(modalHorarioEl);
    if (modalHorario) {
        modalHorario.hide();
    }
    const partesData = data.split('-');
    const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : data;
    let agendamentos = JSON.parse(localStorage.getItem('agendamentosExames') || '[]');
    if (idEmFoco !== null) {
        agendamentos[idEmFoco].data = dataFormatada;
        agendamentos[idEmFoco].hora = hora;
    } else {
        agendamentos.push({
            nome: exameEmFoco,
            data: dataFormatada,
            hora: hora
        });
    }
    localStorage.setItem('agendamentosExames', JSON.stringify(agendamentos));
    renderizarAgendados();
    document.getElementById('modalNomeExameAgendado').innerText = exameEmFoco;
    var modalSucesso = new bootstrap.Modal(document.getElementById('modalAgendamento'));
    modalSucesso.show();
}
function solicitarRemarcacaoFuturoID(id, nomeExame) {
    idEmFoco = id;
    exameEmFoco = nomeExame;
    document.getElementById('nomeExameRemarcacao').innerText = exameEmFoco;
    var modal = new bootstrap.Modal(document.getElementById('modalConfirmarRemarcacao'));
    modal.show();
}
function confirmarRemarcacao() {
    var modalConf = bootstrap.Modal.getInstance(document.getElementById('modalConfirmarRemarcacao'));
    if (modalConf) modalConf.hide();
    document.getElementById('spanNomeExameHorario').innerText = exameEmFoco;
    document.getElementById('inputDataExame').value = "";
    document.getElementById('selectHoraExame').value = "";
    var modal = new bootstrap.Modal(document.getElementById('modalEscolherHorario'));
    modal.show();
}
function cancelarAgendamentoFuturoID(id) {
    if (confirm("Tem certeza que deseja desmarcar este exame?")) {
        if (id === 'default') {
            document.getElementById('exame-default').remove();
        } else {
            let agendamentos = JSON.parse(localStorage.getItem('agendamentosExames') || '[]');
            agendamentos.splice(id, 1);
            localStorage.setItem('agendamentosExames', JSON.stringify(agendamentos));
            renderizarAgendados();
        }
    }
}