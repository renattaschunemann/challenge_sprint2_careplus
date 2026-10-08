document.addEventListener("DOMContentLoaded", function () {
  // Navigation tabs switching
  const tabProcedimentos = document.getElementById("tab-procedimentos");
  const tabAgendar = document.getElementById("tab-agendar");
  const tabConsultas = document.getElementById("tab-consultas");

  const contentProcedimentos = document.getElementById("content-procedimentos");
  const contentAgendar = document.getElementById("content-agendar");
  const contentConsultas = document.getElementById("content-consultas");

  function hideAllTabs() {
    [tabProcedimentos, tabAgendar, tabConsultas].forEach((tab) => {
      if (tab) tab.classList.remove("active");
    });
    [contentProcedimentos, contentAgendar, contentConsultas].forEach((content) => {
      if (content) content.classList.add("d-none");
    });
  }

  if (tabProcedimentos && tabAgendar && tabConsultas) {
    tabProcedimentos.addEventListener("click", () => {
      hideAllTabs();
      tabProcedimentos.classList.add("active");
      contentProcedimentos.classList.remove("d-none");
    });

    tabAgendar.addEventListener("click", () => {
      hideAllTabs();
      tabAgendar.classList.add("active");
      contentAgendar.classList.remove("d-none");
    });

    tabConsultas.addEventListener("click", () => {
      hideAllTabs();
      tabConsultas.classList.add("active");
      contentConsultas.classList.remove("d-none");
    });
  }

  // Handle URL query parameters (e.g. ?tab=agendar&especialidade=Ortodontia)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab");
  if (initialTab === "agendar" && tabAgendar) {
    tabAgendar.click();
  } else if (initialTab === "consultas" && tabConsultas) {
    tabConsultas.click();
  }

  // Presencial vs Teleconsulta toggle
  const btnTipoPresencial = document.getElementById("btn-tipo-presencial-odonto");
  const btnTipoTeleconsulta = document.getElementById("btn-tipo-teleconsulta-odonto");
  let tipoConsultaAtual = "Presencial";

  if (btnTipoPresencial && btnTipoTeleconsulta) {
    btnTipoPresencial.addEventListener("click", function () {
      tipoConsultaAtual = "Presencial";
      btnTipoPresencial.classList.add("btn-presencial-active");
      btnTipoPresencial.classList.remove("btn-teleconsulta-inactive");
      btnTipoTeleconsulta.classList.add("btn-teleconsulta-inactive");
      btnTipoTeleconsulta.classList.remove("btn-presencial-active");
    });

    btnTipoTeleconsulta.addEventListener("click", function () {
      tipoConsultaAtual = "Teleconsulta Odontológica";
      btnTipoTeleconsulta.classList.add("btn-presencial-active");
      btnTipoTeleconsulta.classList.remove("btn-teleconsulta-inactive");
      btnTipoPresencial.classList.add("btn-teleconsulta-inactive");
      btnTipoPresencial.classList.remove("btn-presencial-active");
    });
  }

  // Dynamic specialties & procedures logic
  const dentistasPorEspecialidade = {
    "Ortodontia": ["Dra. Patricia Lima - Ortodontista", "Dr. Fernando Costa - Ortodontista"],
    "Periodontia": ["Dra. Camila Ribeiro - Periodontista", "Dr. Bruno Alves - Periodontista"],
    "Endodontia": ["Dra. Juliana Mendes - Endodontista", "Dr. Ricardo Prado - Endodontista"],
    "Implantodontia": ["Dr. Carlos Eduardo - Implantodontista", "Dra. Vanessa Santos - Implantodontista"],
    "Odontopediatria": ["Dra. Sofia Martins - Odontopediatra", "Dra. Beatriz Rocha - Odontopediatra"],
    "Prótese": ["Dr. Gustavo Neves - Prótese / Reabilitação", "Dra. Renata Silveira - Prótese"],
    "Estética": ["Dra. Mariana Fonseca - Odontologia Estética", "Dr. Lucas Martins - Odontologia Estética"]
  };

  const selectEspecialidadeForm = document.getElementById("select-especialidade-odonto");
  const selectDentistaForm = document.getElementById("select-dentista-odonto");

  if (selectEspecialidadeForm && selectDentistaForm) {
    selectEspecialidadeForm.addEventListener("change", function () {
      const esp = this.value;
      const dentistas = dentistasPorEspecialidade[esp] || [
        "Dr. Roberto Silva - Clínico Geral Odontológico",
        "Dra. Camila Rocha - Cirurgiã Dentista"
      ];

      selectDentistaForm.innerHTML = '<option selected disabled>Selecione um profissional credenciado</option>';
      dentistas.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        selectDentistaForm.appendChild(opt);
      });
      selectDentistaForm.disabled = false;
    });
  }

  // Time slots per period
  const selectPeriodo = document.getElementById("select-periodo-odonto");
  const selectHorario = document.getElementById("select-horario-odonto");
  const horariosPorPeriodo = {
    "Manhã": ["08:00", "09:00", "10:00", "11:00", "11:30"],
    "Tarde": ["13:30", "14:30", "15:30", "16:30", "17:30"]
  };

  if (selectPeriodo && selectHorario) {
    selectPeriodo.addEventListener("change", function () {
      const p = this.value;
      const hrs = horariosPorPeriodo[p] || [];
      selectHorario.innerHTML = '<option selected disabled>Selecione um horário</option>';
      hrs.forEach((h) => {
        const opt = document.createElement("option");
        opt.value = h;
        opt.textContent = h;
        selectHorario.appendChild(opt);
      });
      selectHorario.disabled = false;
    });
  }

  // Trigger Modal pre-fill when Agendar is clicked
  const btnAgendarModal = document.getElementById("btn-agendar-odonto");
  if (btnAgendarModal) {
    btnAgendarModal.addEventListener("click", function () {
      const esp = selectEspecialidadeForm ? selectEspecialidadeForm.value : "Odontologia Geral";
      const dentista = selectDentistaForm && selectDentistaForm.value !== "Selecione um profissional credenciado" ? selectDentistaForm.value : "Profissional Credenciado Care Plus";
      const procInput = document.getElementById("input-procedimento-odonto");
      const procedimento = procInput && procInput.value ? procInput.value : "Consulta Inicial Odontológica";

      let horario = "Horário a selecionar";
      if (selectHorario && selectHorario.selectedIndex > 0) {
        horario = selectHorario.options[selectHorario.selectedIndex].text;
      }

      document.getElementById("modal-especialidade-odonto").innerText = `${especialidadeOuProc(esp, procedimento)}`;
      document.getElementById("modal-horario-odonto").innerText = horario;
      document.getElementById("modal-dentista-odonto").innerText = dentista;
    });
  }

  renderizarConsultasOdonto();
  renderizarHistoricoOdonto();
});

let idConsultaOdontoEmFoco = null;

function especialidadeOuProc(esp, proc) {
  if (proc && proc !== "Consulta Inicial Odontológica") {
    return `${proc} (${esp})`;
  }
  return esp;
}

// Function to filter procedures by Specialty Pill
function filtrarEspecialidadeOdonto(categoria, btnElement) {
  const pills = document.querySelectorAll(".specialty-pill-btn");
  pills.forEach((p) => p.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");

  const cards = document.querySelectorAll(".procedure-card-col");
  cards.forEach((card) => {
    const cat = card.getAttribute("data-specialty");
    if (categoria === "Todas" || cat === categoria) {
      card.classList.remove("d-none");
    } else {
      card.classList.add("d-none");
    }
  });
}

// Quick search in procedures
function buscarProcedimentosOdonto() {
  const query = document.getElementById("buscaOdonto").value.toLowerCase();
  const cards = document.querySelectorAll(".procedure-card-col");
  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.classList.remove("d-none");
    } else {
      card.classList.add("d-none");
    }
  });
}

// Open booking form directly for a specific procedure & specialty
function abrirAgendamentoOdonto(nomeProcedimento, especialidade) {
  const tabAgendar = document.getElementById("tab-agendar");
  if (tabAgendar) tabAgendar.click();

  const selectEsp = document.getElementById("select-especialidade-odonto");
  const inputProc = document.getElementById("input-procedimento-odonto");

  if (selectEsp) {
    selectEsp.value = especialidade;
    const event = new Event("change");
    selectEsp.dispatchEvent(event);
  }

  if (inputProc) {
    inputProc.value = nomeProcedimento;
  }

  window.scrollTo({ top: 180, behavior: "smooth" });
}

// Confirm booking action
function confirmarAgendamentoOdonto() {
  const selectEsp = document.getElementById("select-especialidade-odonto");
  const selectDentista = document.getElementById("select-dentista-odonto");
  const selectHorario = document.getElementById("select-horario-odonto");
  const inputData = document.getElementById("input-data-odonto");
  const inputProc = document.getElementById("input-procedimento-odonto");

  const especialidade = selectEsp && selectEsp.value !== "Selecione uma especialidade" ? selectEsp.value : "Odontologia";
  const procedimento = inputProc && inputProc.value ? inputProc.value : "Consulta Odontológica";
  const dentista = selectDentista && selectDentista.selectedIndex > 0 ? selectDentista.value : "Dra. Patricia Lima - Ortodontista";
  const horario = selectHorario && selectHorario.selectedIndex > 0 ? selectHorario.options[selectHorario.selectedIndex].text : "09:00";

  let dataFormatada = "Data a definir";
  if (inputData && inputData.value) {
    const d = new Date(inputData.value + "T12:00:00");
    dataFormatada = d.toLocaleDateString("pt-BR");
  } else {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 3);
    dataFormatada = hoje.toLocaleDateString("pt-BR");
  }

  let consultas = JSON.parse(localStorage.getItem("careplus_consultas_dentarias") || "[]");

  if (idConsultaOdontoEmFoco !== null && idConsultaOdontoEmFoco !== "default") {
    consultas[idConsultaOdontoEmFoco] = {
      especialidade: especialidade,
      procedimento: procedimento,
      dentista: dentista,
      data: dataFormatada,
      horario: horario
    };
  } else {
    consultas.push({
      especialidade: especialidade,
      procedimento: procedimento,
      dentista: dentista,
      data: dataFormatada,
      horario: horario
    });
  }

  localStorage.setItem("careplus_consultas_dentarias", JSON.stringify(consultas));
  idConsultaOdontoEmFoco = null;

  // Reward 50 XP
  if (window.addScore) {
    window.addScore(50);
  }

  renderizarConsultasOdonto();
  document.getElementById("tab-consultas").click();
}

function renderizarConsultasOdonto() {
  const lista = document.getElementById("listaConsultasOdonto");
  if (!lista) return;

  let consultas = JSON.parse(localStorage.getItem("careplus_consultas_dentarias") || "[]");

  // Keep default container if empty or render list
  const dynamicItems = document.querySelectorAll(".dynamic-consulta-odonto");
  dynamicItems.forEach((item) => item.remove());

  if (consultas.length === 0) {
    const def = document.getElementById("consulta-odonto-default");
    if (def) def.classList.remove("d-none");
    return;
  }

  const def = document.getElementById("consulta-odonto-default");
  if (def) def.classList.add("d-none");

  consultas.forEach((c, index) => {
    const div = document.createElement("div");
    div.className =
      "border rounded-4 p-4 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-3 consulta-item dynamic-consulta-odonto bg-white shadow-sm";
    div.innerHTML = `
      <div>
        <span class="badge bg-primary text-white mb-2 font-xs">${c.especialidade}</span>
        <h5 class="fw-bold mb-2 text-navy">${c.procedimento || c.especialidade}</h5>
        <div class="d-flex gap-3 text-secondary flex-wrap font-md">
          <span class="d-flex align-items-center bg-light rounded-pill px-3 py-1 font-sm">
            <i class="bi bi-calendar-event me-2 text-primary"></i> ${c.data}
          </span>
          <span class="d-flex align-items-center bg-light rounded-pill px-3 py-1 font-sm">
            <i class="bi bi-clock me-2 text-primary"></i> às ${c.horario}
          </span>
          <span class="d-flex align-items-center font-sm">
            <i class="bi bi-person-badge me-2 text-primary"></i> ${c.dentista}
          </span>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row gap-2">
        <button class="btn btn-brand-primary px-4 rounded-3" onclick="solicitarRemarcacaoOdonto('${index}', '${c.procedimento || c.especialidade}', '${c.dentista}')">Remarcar</button>
        <button class="btn btn-outline-brand-danger px-4 rounded-3" onclick="cancelarConsultaOdonto('${index}')">Desmarcar</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function solicitarRemarcacaoOdonto(id, procedimento, dentista) {
  idConsultaOdontoEmFoco = id;
  const targetText = document.getElementById("nomeConsultaOdontoRemarcacao");
  if (targetText) {
    targetText.innerText = `${procedimento} com ${dentista}`;
  }
  const modal = new bootstrap.Modal(document.getElementById("modalConfirmarRemarcacaoOdonto"));
  modal.show();
}

function confirmarRemarcacaoOdonto() {
  const modalConf = bootstrap.Modal.getInstance(document.getElementById("modalConfirmarRemarcacaoOdonto"));
  if (modalConf) modalConf.hide();

  document.getElementById("tab-agendar").click();
  alert("Por favor, selecione a nova data e horário para remarcar a sua consulta odontológica.");
}

function cancelarConsultaOdonto(id) {
  if (confirm("Tem certeza que deseja desmarcar esta consulta odontológica?")) {
    if (id === "default") {
      const def = document.getElementById("consulta-odonto-default");
      if (def) def.classList.add("d-none");
    } else {
      let consultas = JSON.parse(localStorage.getItem("careplus_consultas_dentarias") || "[]");
      consultas.splice(id, 1);
      localStorage.setItem("careplus_consultas_dentarias", JSON.stringify(consultas));
      renderizarConsultasOdonto();
    }
  }
}

function renderizarHistoricoOdonto() {
  const container = document.getElementById("listaHistoricoOdonto");
  if (!container) return;

  const historicoSample = [
    {
      especialidade: "Estética",
      procedimento: "Limpeza Dental (Profilaxia)",
      dentista: "Dra. Mariana Fonseca",
      data: "10/01/2026",
      clinica: "Care Plus Odonto Central"
    },
    {
      especialidade: "Ortodontia",
      procedimento: "Manutenção de Aparelho Autoligado",
      dentista: "Dra. Patricia Lima",
      data: "14/11/2025",
      clinica: "Clínica Odontológica Paulista"
    },
    {
      especialidade: "Periodontia",
      procedimento: "Tratamento Periodontal Preventivo",
      dentista: "Dra. Camila Ribeiro",
      data: "05/08/2025",
      clinica: "Care Plus Odonto Central"
    }
  ];

  container.innerHTML = "";
  historicoSample.forEach((h) => {
    const div = document.createElement("div");
    div.className = "border rounded-4 p-3 mb-3 bg-white shadow-sm";
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h6 class="fw-bold text-navy mb-0">${h.procedimento}</h6>
        <span class="badge bg-success text-white rounded-pill px-3 py-1 font-xs">Concluída</span>
      </div>
      <div class="d-flex justify-content-between align-items-end flex-wrap gap-2 mt-2">
        <div class="d-flex gap-4 text-secondary font-xs">
          <span><i class="bi bi-calendar3 me-1"></i> ${h.data}</span>
          <span><i class="bi bi-person me-1"></i> ${h.dentista}</span>
          <span><i class="bi bi-geo-alt me-1"></i> ${h.clinica}</span>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}
