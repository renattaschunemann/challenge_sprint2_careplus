/**
 * Care Plus - Serviço de Integração com Google Maps, Trânsito e Previsão Multimodal
 * Implementação acadêmica com dados simulados/mockados:
 * - Google Maps interativo com alfinete da clínica e feedback de demonstração (sem links externos)
 * - Simulação de trânsito em tempo real
 * - Alternativas de meios de transporte quando o trânsito está ruim para carro (Metrô, Ônibus, Bike)
 * - Integração simulada com o Climatempo e sugestão de Telemedicina
 * - Cálculo dinâmico do melhor horário de saída
 */

(function () {
  'use strict';

  // Configurações padrão da clínica e paciente
  const CLINICA_DESTINO = {
    nome: "Care Plus - Unidade Itaim Bibi",
    endereco: "Av. Brigadeiro Faria Lima, 3064 - Itaim Bibi, São Paulo - SP",
    cep: "01451-000",
    telefone: "(11) 3003-2433",
    especialidade: "Cardiologia - Dr. Roberto",
    horarioConsulta: "15:30",
    lat: -23.5855,
    lng: -46.6828
  };

  const ORIGEM_PACIENTE = {
    nome: "Minha Localização (Av. Paulista)",
    endereco: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
    lat: -23.5614,
    lng: -46.6559
  };

  // Simulação de Dados Climatempo
  const DADOS_CLIMATEMPO = {
    cidade: "São Paulo - SP",
    temperatura: "21°C",
    sensacao: "20°C",
    condicao: "Pancadas de Chuva / Temporal às 15h",
    probabilidadeChuva: "85%",
    impactoTransito: "Chuva forte no horário previsto da consulta aumenta o trânsito de carros em até 40% com risco de alagamentos na Av. Faria Lima.",
    recomendacao: "Recomendação Care Plus: Alterne para Telemedicina ou utilize o Metrô (Linha 4-Amarela) para evitar atrasos."
  };

  // Modais de Transporte com simulação de alternativas ao trânsito de carro
  const MODAIS_TRANSPORTE = [
    {
      id: "carro",
      nome: "Carro / App",
      icone: "bi-car-front-fill",
      duracao: 48,
      distancia: "7,8 km",
      destaque: "Trânsito Intenso",
      status: "intenso",
      statusTexto: "Trânsito Pesado (+18 min lentidão)",
      corStatus: "#ef4444",
      badgeClass: "traffic-badge-intense",
      detalhe: "Fluxo muito lento na Av. Rebouças e Faria Lima devido à chuva.",
      recomendado: false,
      corPath: "#ef4444",
      pathSvg: "M 120 70 Q 260 80 320 150 T 390 240 T 430 310"
    },
    {
      id: "metro",
      nome: "Metrô (Linha 4)",
      icone: "bi-train-front-fill",
      duracao: 26,
      distancia: "6,2 km",
      destaque: "⭐ Mais Rápido no Pico",
      status: "fluido",
      statusTexto: "Imune ao Trânsito (Economiza 22 min)",
      corStatus: "#10b981",
      badgeClass: "traffic-badge-fluid",
      detalhe: "Estação Paulista (Linha 4-Amarela) até Estação Faria Lima + 4 min a pé. Seguro e protegido da chuva!",
      recomendado: true,
      corPath: "#facc15", // Amarelo da Linha 4
      pathSvg: "M 120 70 L 170 150 L 280 230 L 430 310"
    },
    {
      id: "onibus",
      nome: "Ônibus (Corredor)",
      icone: "bi-bus-front-fill",
      duracao: 38,
      distancia: "7,5 km",
      destaque: "Faixa Exclusiva",
      status: "moderado",
      statusTexto: "Trânsito Moderado (Faixa Ativa)",
      corStatus: "#f59e0b",
      badgeClass: "traffic-badge-moderate",
      detalhe: "Corredor Rebouças-Faria Lima opera com velocidade média estável.",
      recomendado: false,
      corPath: "#0ea5e9",
      pathSvg: "M 120 70 Q 140 180 200 240 T 340 290 T 430 310"
    },
    {
      id: "bike",
      nome: "Bicicleta",
      icone: "bi-bicycle",
      duracao: 28,
      distancia: "6,8 km",
      destaque: "Ciclovia Faria Lima",
      status: "alerta",
      statusTexto: "Desaconselhado (Chuva Prevista)",
      corStatus: "#dc2626",
      badgeClass: "traffic-badge-intense",
      detalhe: "Trajeto plano pela ciclovia, porém com risco de piso escorregadio pela chuva.",
      recomendado: false,
      corPath: "#10b981",
      pathSvg: "M 120 70 Q 200 120 280 200 T 430 310"
    }
  ];

  let modalAtivoId = "carro"; // Inicia mostrando a situação do carro para que a sugestão de metrô se destaque
  let camadaTransitoAtiva = true;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let margemSegurancaMinutos = 15; // Chegar 15 minutos antes da consulta

  /**
   * Exibe feedback visual acadêmico na tela sem abrir links externos
   */
  function showDemoToast(mensagem) {
    let existing = document.getElementById('demo-toast-popup');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'demo-toast-popup';
    toast.className = 'demo-toast-popup';
    toast.innerHTML = `
      <i class="bi bi-info-circle-fill text-warning fs-5"></i>
      <div>
        <strong>Simulação Acadêmica (Google Maps)</strong>
        <div class="font-xs opacity-75">${mensagem || 'Destino fixado: Clínica Care Plus Itaim Bibi (Av. Brig. Faria Lima, 3064).'}</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /**
   * Ativa a Telemedicina diretamente a partir da recomendação climática
   */
  window.ativarTelemedicinaPeloClima = function () {
    const toggleTelemedicina = document.getElementById('toggleTelemedicina');
    const togglePresencial = document.getElementById('togglePresencial');
    if (toggleTelemedicina) {
      toggleTelemedicina.checked = true;
      if (togglePresencial) togglePresencial.checked = false;
      toggleTelemedicina.dispatchEvent(new Event('change'));
      showDemoToast("Consulta alterada para Telemedicina! Você receberá o link por e-mail e não precisará sair na chuva.");
    } else {
      showDemoToast("Modo Telemedicina ativado com sucesso para esta consulta!");
    }
  };

  /**
   * Calcula o melhor horário de saída dinamicamente
   */
  function calcularMelhorHorarioSaida(horarioConsultaStr, duracaoViagemMin, margemMin) {
    const [hora, min] = horarioConsultaStr.split(':').map(Number);
    const dataConsulta = new Date();
    dataConsulta.setHours(hora, min, 0, 0);

    const minutosTotaisAntes = duracaoViagemMin + margemMin;
    const dataSaidaRecomendada = new Date(dataConsulta.getTime() - minutosTotaisAntes * 60000);

    const horaSaida = String(dataSaidaRecomendada.getHours()).padStart(2, '0');
    const minSaida = String(dataSaidaRecomendada.getMinutes()).padStart(2, '0');
    const horarioSaidaFormatado = `${horaSaida}:${minSaida}`;

    const dataChegada = new Date(dataSaidaRecomendada.getTime() + duracaoViagemMin * 60000);
    const horaChegada = String(dataChegada.getHours()).padStart(2, '0');
    const minChegada = String(dataChegada.getMinutes()).padStart(2, '0');
    const horarioChegadaFormatado = `${horaChegada}:${minChegada}`;

    return {
      horarioSaida: horarioSaidaFormatado,
      horarioChegada: horarioChegadaFormatado,
      minutosTotaisAntes: minutosTotaisAntes
    };
  }

  /**
   * Inicializa o componente do mapa e seus controles
   */
  window.initCarePlusMaps = function () {
    const mapContainer = document.getElementById('careplus-maps-root');
    if (!mapContainer) return;

    renderMapInterface(mapContainer);
    setupEventListeners();
    atualizarPrevisaoDinâmica();

    // Sincronizar com mudanças de tema
    window.addEventListener('careplus-theme-changed', () => {
      atualizarCoresTemaMapa();
    });
  };

  /**
   * Renderiza a interface completa do mapa, modais e previsão do Climatempo
   */
  function renderMapInterface(container) {
    const modalAtivo = MODAIS_TRANSPORTE.find(m => m.id === modalAtivoId) || MODAIS_TRANSPORTE[0];

    container.innerHTML = `
      <div class="maps-card-wrapper p-3 p-md-4 mb-4">
        
        <!-- Cabeçalho do Trajeto com Status de Trânsito -->
        <div class="d-flex justify-content-between align-items-start align-items-md-center flex-wrap gap-2 mb-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <h5 class="fw-bold mb-0 text-navy">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i> Trajeto Inteligente & Trânsito
              </h5>
              <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill font-xs">
                Google Maps (Simulado)
              </span>
            </div>
            <p class="text-secondary font-sm mb-0">
              Previsão de deslocamento, melhores horários de saída e alternativas de transporte
            </p>
          </div>
          
          <div class="d-flex align-items-center gap-2">
            <div class="traffic-badge ${modalAtivo.badgeClass}" id="traffic-status-badge">
              <span class="traffic-pulse-dot"></span>
              <span id="traffic-status-text">${modalAtivo.statusTexto}</span>
            </div>
          </div>
        </div>

        <!-- WIDGET CLIMATEMPO (Previsão do Tempo & Impacto no Deslocamento) -->
        <div class="climatempo-widget-card mb-3">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="climatempo-brand-badge">
                <i class="bi bi-cloud-sun me-1"></i> Climatempo
              </span>
              <span class="fw-bold font-sm text-navy">${DADOS_CLIMATEMPO.cidade}</span>
            </div>
            <div class="d-flex align-items-center gap-3 font-xs text-secondary">
              <span><i class="bi bi-umbrella me-1 text-primary"></i> Chuva: <strong>${DADOS_CLIMATEMPO.probabilidadeChuva}</strong></span>
              <span><i class="bi bi-thermometer-half me-1 text-danger"></i> Sensação: <strong>${DADOS_CLIMATEMPO.sensacao}</strong></span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="display-6 text-primary">
                <i class="bi bi-cloud-lightning-rain-fill"></i>
              </div>
              <div>
                <div class="weather-temp-display">${DADOS_CLIMATEMPO.temperatura}</div>
                <div class="font-xs fw-semibold text-secondary">${DADOS_CLIMATEMPO.condicao}</div>
              </div>
            </div>

            <!-- Alerta Climático & Ação Rápida de Telemedicina -->
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <div class="weather-warning-pill font-xs">
                <i class="bi bi-exclamation-octagon-fill me-1"></i>
                Chuva intensa às 15h: trânsito para carro 40% mais lento.
              </div>
              <button class="btn-smart-telemedicina font-xs" onclick="window.ativarTelemedicinaPeloClima()" title="Evite a chuva e o trânsito">
                <i class="bi bi-camera-video-fill"></i> Mudar para Telemedicina
              </button>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <!-- Coluna 1: Mapa Interativo & Modais de Transporte Alternativos -->
          <div class="col-lg-7">
            <div class="interactive-map-viewport shadow-sm" id="interactive-map-viewport">
              
              <!-- Controles Flutuantes do Mapa -->
              <div class="map-floating-controls">
                <button class="map-control-btn" id="btn-zoom-in" title="Aumentar zoom">
                  <i class="bi bi-plus-lg"></i>
                </button>
                <button class="map-control-btn" id="btn-zoom-out" title="Diminuir zoom">
                  <i class="bi bi-dash-lg"></i>
                </button>
                <button class="map-control-btn ${camadaTransitoAtiva ? 'active' : ''}" id="btn-toggle-traffic" title="Alternar camada de trânsito em tempo real">
                  <i class="bi bi-stoplights"></i>
                </button>
                <button class="map-control-btn" id="btn-recenter" title="Centralizar na clínica">
                  <i class="bi bi-crosshair"></i>
                </button>
                <button class="map-control-btn text-primary" id="btn-demo-map-icon" title="Navegação Google Maps (Simulação)">
                  <i class="bi bi-google"></i>
                </button>
              </div>

              <!-- Legenda de Trânsito no Mapa -->
              <div class="map-traffic-legend" id="map-traffic-legend" style="${camadaTransitoAtiva ? '' : 'display: none;'}">
                <span class="fw-bold">Trânsito:</span>
                <span><span class="traffic-line-sample traffic-green"></span>Livre</span>
                <span><span class="traffic-line-sample traffic-yellow"></span>Moderado</span>
                <span><span class="traffic-line-sample traffic-red"></span>Lento</span>
              </div>

              <!-- SVG Canvas de Renderização das Ruas e Rotas (Cartografia Realista Estilo Google Maps) -->
              <div id="map-transform-layer" style="position: absolute; width: 100%; height: 100%; transform-origin: center center;">
                <svg class="svg-map-canvas" viewBox="0 0 540 380" preserveAspectRatio="xMidYMid meet" id="svg-map">
                  <defs>
                    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#b6dfee" />
                      <stop offset="100%" stop-color="#8bc3d6" />
                    </linearGradient>
                  </defs>

                  <!-- Fundo de Terreno Urbano -->
                  <rect width="540" height="380" class="map-bg-land" />

                  <!-- Parques e Áreas Verdes de São Paulo -->
                  <!-- Parque Ibirapuera -->
                  <polygon points="360,40 480,30 530,105 440,125" class="map-park" />
                  <text x="420" y="80" class="map-street-label" fill="#2d6a4f" font-size="7.5" font-weight="700">Parque Ibirapuera</text>

                  <!-- Parque do Povo -->
                  <polygon points="360,250 415,225 435,265 380,290" class="map-park" />
                  <text x="375" y="270" class="map-street-label" fill="#2d6a4f" font-size="7">Pq. do Povo</text>

                  <!-- Mancha verde dos Jardins (Jardim Europa / América) -->
                  <rect x="160" y="160" width="120" height="70" rx="14" class="map-park" opacity="0.65" />

                  <!-- Rio Pinheiros (Corpo D'Água com Margens Realistas) -->
                  <path d="M 400,380 Q 440,290 480,200 T 540,40" stroke="url(#waterGrad)" stroke-width="26" fill="none" class="map-water" />
                  <path d="M 400,380 Q 440,290 480,200 T 540,40" stroke="#7bb7cc" stroke-width="18" fill="none" />
                  <text x="445" y="240" transform="rotate(-66 445 240)" class="map-street-label" fill="#1b4965" font-size="7.5" font-style="italic">Rio Pinheiros</text>

                  <!-- Malha de Ruas Secundárias e Residenciais (Quarteirões de São Paulo) -->
                  <g class="map-local-streets" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.95">
                    <!-- Ruas da Bela Vista / Cerqueira César -->
                    <line x1="30" y1="80" x2="140" y2="105" />
                    <line x1="40" y1="110" x2="150" y2="135" />
                    <line x1="70" y1="40" x2="90" y2="130" />
                    <line x1="110" y1="45" x2="130" y2="135" />

                    <!-- Ruas do Jardim América / Jardins -->
                    <line x1="150" y1="180" x2="270" y2="150" />
                    <line x1="160" y1="210" x2="280" y2="180" />
                    <line x1="190" y1="140" x2="210" y2="230" />
                    <line x1="230" y1="150" x2="250" y2="240" />

                    <!-- Ruas do Itaim Bibi / Faria Lima -->
                    <line x1="280" y1="310" x2="380" y2="270" />
                    <line x1="300" y1="340" x2="400" y2="300" />
                    <line x1="330" y1="360" x2="430" y2="320" />
                    <line x1="330" y1="280" x2="360" y2="360" />
                    <line x1="370" y1="260" x2="400" y2="350" />
                    <line x1="410" y1="240" x2="440" y2="330" />

                    <!-- Ruas de Pinheiros -->
                    <line x1="90" y1="240" x2="160" y2="270" />
                    <line x1="100" y1="280" x2="170" y2="310" />
                    <line x1="110" y1="220" x2="130" y2="300" />
                  </g>

                  <!-- Nomes dos Bairros (Distritos) -->
                  <text x="65" y="125" class="map-district-label">Bela Vista</text>
                  <text x="200" y="195" class="map-district-label">Jardins</text>
                  <text x="340" y="340" class="map-district-label">Itaim Bibi</text>
                  <text x="85" y="260" class="map-district-label">Pinheiros</text>

                  <!-- Principais Avenidas de São Paulo (Estilo Google Maps Amarelo/Branco) -->
                  <g class="map-avenues">
                    <!-- Av. Paulista -->
                    <line x1="20" y1="50" x2="250" y2="80" stroke="#e0ded9" stroke-width="12" stroke-linecap="round" />
                    <line x1="20" y1="50" x2="250" y2="80" stroke="#ffebb3" stroke-width="8" stroke-linecap="round" />
                    <text x="55" y="44" class="map-street-label">Av. Paulista</text>

                    <!-- Av. Rebouças -->
                    <line x1="120" y1="65" x2="160" y2="310" stroke="#e0ded9" stroke-width="10" stroke-linecap="round" />
                    <line x1="120" y1="65" x2="160" y2="310" stroke="#ffebb3" stroke-width="7" stroke-linecap="round" />
                    <text x="145" y="150" transform="rotate(80 145 150)" class="map-street-label">Av. Rebouças</text>

                    <!-- Av. Brasil -->
                    <line x1="150" y1="130" x2="380" y2="230" stroke="#e0ded9" stroke-width="10" stroke-linecap="round" />
                    <line x1="150" y1="130" x2="380" y2="230" stroke="#ffebb3" stroke-width="7" stroke-linecap="round" />
                    <text x="225" y="165" transform="rotate(23 225 165)" class="map-street-label">Av. Brasil</text>

                    <!-- Av. 23 de Maio -->
                    <line x1="210" y1="75" x2="350" y2="160" stroke="#e0ded9" stroke-width="9" stroke-linecap="round" />
                    <line x1="210" y1="75" x2="350" y2="160" stroke="#ffebb3" stroke-width="6" stroke-linecap="round" />
                    <text x="240" y="110" transform="rotate(31 240 110)" class="map-street-label">Av. 23 de Maio</text>

                    <!-- Av. Pres. Juscelino Kubitschek (Av. JK) -->
                    <line x1="320" y1="270" x2="450" y2="290" stroke="#e0ded9" stroke-width="9" stroke-linecap="round" />
                    <line x1="320" y1="270" x2="450" y2="290" stroke="#ffebb3" stroke-width="6" stroke-linecap="round" />
                    <text x="350" y="265" transform="rotate(8 350 265)" class="map-street-label">Av. JK</text>

                    <!-- Marginal Pinheiros (Av. das Nações Unidas) -->
                    <path d="M 385,380 Q 425,290 465,200 T 525,40" stroke="#e0ded9" stroke-width="12" fill="none" />
                    <path d="M 385,380 Q 425,290 465,200 T 525,40" stroke="#ffebb3" stroke-width="8" fill="none" />
                    <text x="410" y="325" transform="rotate(-65 410 325)" class="map-street-label" font-size="7">Marginal Pinheiros</text>

                    <!-- Av. Brigadeiro Faria Lima (Canteiro e Faixa Principal) -->
                    <line x1="260" y1="365" x2="480" y2="210" stroke="#e0ded9" stroke-width="14" stroke-linecap="round" />
                    <line x1="260" y1="365" x2="480" y2="210" stroke="#ffe082" stroke-width="10" stroke-linecap="round" />
                    <text x="315" y="310" transform="rotate(-35 315 310)" class="map-street-label" font-weight="700">Av. Brig. Faria Lima</text>
                  </g>

                  <!-- Camada de Trânsito Dinâmica em Tempo Real -->
                  <g id="traffic-layer-group" style="${camadaTransitoAtiva ? '' : 'display: none;'}">
                    <!-- Trechos verdes (livres) -->
                    <line x1="20" y1="50" x2="120" y2="65" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="135" x2="280" y2="185" stroke="#22c55e" stroke-width="4" stroke-linecap="round" />
                    <!-- Trechos amarelos (moderados) -->
                    <line x1="280" y1="185" x2="380" y2="230" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
                    <line x1="260" y1="365" x2="340" y2="310" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" />
                    <!-- Trechos vermelhos (lentos/congestionados por chuva) -->
                    <line x1="120" y1="65" x2="155" y2="220" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
                    <line x1="340" y1="310" x2="480" y2="210" stroke="#ef4444" stroke-width="5" stroke-linecap="round" />
                    <path d="M 385,380 Q 425,290 465,200" stroke="#ef4444" stroke-width="5" fill="none" />
                  </g>

                  <!-- Traçado da Rota Selecionada (Carro, Metrô, Ônibus ou Bike) -->
                  <path id="active-route-path" class="route-polyline" d="${modalAtivo.pathSvg}" fill="none" stroke="${modalAtivo.corPath}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <!-- Marcador de Origem (Paciente) -->
                <div class="pin-origin" style="left: 120px; top: 65px;" title="Sua Origem: ${ORIGEM_PACIENTE.nome}">
                  <div class="origin-marker-circle"></div>
                </div>

                <!-- ALFINETE DA CLÍNICA (Clicável com Card Interno) -->
                <div class="map-pin" id="clinic-map-pin" style="left: 430px; top: 310px;" title="Clique para ver detalhes do destino">
                  <div class="pin-pulse"></div>
                  <div class="pin-icon-wrap">
                    <i class="bi bi-hospital pin-icon-inner"></i>
                  </div>
                </div>


                <!-- Card Flutuante ao Clicar no Alfinete (Sem Redirecionar Externamente) -->
                <div class="pin-tooltip-card d-none" id="pin-tooltip-card">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-primary text-white font-xs">Destino</span>
                    <button type="button" class="btn-close font-xs" id="btn-close-tooltip" aria-label="Fechar"></button>
                  </div>
                  <h6 class="fw-bold mb-1 font-sm">${CLINICA_DESTINO.nome}</h6>
                  <p class="text-secondary font-xs mb-2">${CLINICA_DESTINO.endereco}</p>
                  <div class="d-flex align-items-center font-xs text-muted mb-2">
                    <i class="bi bi-clock me-1 text-primary"></i> Consulta às ${CLINICA_DESTINO.horarioConsulta}
                  </div>
                  <button type="button" class="btn btn-sm btn-google-maps w-100 font-xs" id="btn-tooltip-simular-navegacao">
                    <i class="bi bi-geo-alt-fill"></i> Fixar Destino (Simulado)
                  </button>
                </div>
              </div>
            </div>

            <!-- SELETOR MULTIMODAL DE MEIOS DE TRANSPORTE (Alternativas ao Trânsito de Carro) -->
            <div class="mt-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold font-sm text-navy">
                  <i class="bi bi-shuffle me-1 text-primary"></i> Alternativas de Meio de Transporte:
                </span>
                <span class="font-xs text-secondary">Compare tempos com trânsito</span>
              </div>

              <div class="transport-modal-selector">
                ${MODAIS_TRANSPORTE.map(modal => `
                  <button type="button" class="transport-modal-btn ${modal.id === modalAtivoId ? 'active' : ''} ${modal.recomendado ? 'recommended' : ''}" data-modal-id="${modal.id}">
                    <i class="bi ${modal.icone} fs-5"></i>
                    <span class="fw-bold font-xs">${modal.nome}</span>
                    <span class="badge ${modal.recomendado ? 'bg-success' : 'bg-light text-dark'} font-xs">${modal.duracao} min</span>
                  </button>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Coluna 2: Previsão de Horário de Saída e Detalhes da Opção Selecionada -->
          <div class="col-lg-5 d-flex flex-column gap-3">
            
            <!-- Painel do Melhor Horário de Saída -->
            <div class="departure-forecast-box">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-navy font-sm">
                  <i class="bi bi-alarm-fill text-warning me-1"></i> Melhor Horário para Sair
                </span>
                <span class="badge bg-success font-xs px-2 py-1" id="departure-badge">No Horário</span>
              </div>

              <div class="d-flex align-items-baseline gap-2 mb-2">
                <span class="departure-time-highlight" id="best-departure-time">--:--</span>
                <span class="text-secondary font-sm">daqui a <strong id="departure-countdown">-- min</strong></span>
              </div>

              <p class="font-xs text-secondary mb-3">
                Calculado para você chegar às <strong id="estimated-arrival-time">--:--</strong> com <strong>15 min de antecedência</strong> para o check-in na recepção.
              </p>

              <!-- Seletor do Horário da Consulta para Simulação Dinâmica -->
              <div class="d-flex align-items-center justify-content-between bg-white bg-opacity-75 p-2 rounded-3 border font-xs">
                <span class="text-secondary">Horário da consulta:</span>
                <div class="d-flex align-items-center gap-1">
                  <input type="time" class="form-control form-control-sm border-0 py-0 px-1 fw-bold text-navy" id="input-horario-consulta" value="${CLINICA_DESTINO.horarioConsulta}" style="width: 80px;">
                </div>
              </div>
            </div>

            <!-- Detalhes do Meio de Transporte Escolhido -->
            <div class="card border p-3 rounded-4 bg-light shadow-sm">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                    <i class="bi ${modalAtivo.icone}"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0 text-navy" id="modal-chosen-name">${modalAtivo.nome}</h6>
                    <span class="font-xs text-secondary" id="modal-chosen-distance">${modalAtivo.distancia} • ${modalAtivo.destaque}</span>
                  </div>
                </div>
                <div class="text-end">
                  <span class="fw-bold fs-5 text-primary" id="modal-chosen-time">${modalAtivo.duracao} min</span>
                </div>
              </div>

              <p class="font-xs text-secondary mb-3" id="modal-chosen-detail">
                ${modalAtivo.detalhe}
              </p>

              <!-- Botão Visual do Google Maps (Sem links externos, feedback mockado) -->
              <button type="button" class="btn btn-google-maps w-100 font-sm" id="btn-open-google-maps-mobile">
                <i class="bi bi-geo-alt-fill"></i> Fixar Rota no Google Maps
              </button>
            </div>

            <!-- Recomendação Inteligente de Metrô no Pico -->
            <div class="alert alert-success border-success-subtle p-3 rounded-3 font-xs mb-0" id="smart-recommendation-box">
              <div class="d-flex align-items-center mb-1">
                <i class="bi bi-lightning-charge-fill text-success fs-6 me-2"></i>
                <strong class="text-success">Dica Inteligente Care Plus</strong>
              </div>
              <p class="mb-0 text-secondary">
                O trânsito de carro está intenso pela chuva. O <strong>Metrô Linha 4-Amarela</strong> é a opção mais veloz, garantindo chegada com tranquilidade e sem pegar chuva na rua!
              </p>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  /**
   * Configura os eventos de clique, seleção e zoom
   */
  function setupEventListeners() {
    // Alfinete clicável da clínica
    const clinicPin = document.getElementById('clinic-map-pin');
    const tooltipCard = document.getElementById('pin-tooltip-card');
    const btnCloseTooltip = document.getElementById('btn-close-tooltip');
    const btnTooltipSimular = document.getElementById('btn-tooltip-simular-navegacao');

    if (clinicPin && tooltipCard) {
      clinicPin.addEventListener('click', (e) => {
        e.stopPropagation();
        tooltipCard.classList.toggle('d-none');
      });
    }

    if (btnCloseTooltip && tooltipCard) {
      btnCloseTooltip.addEventListener('click', (e) => {
        e.stopPropagation();
        tooltipCard.classList.add('d-none');
      });
    }

    if (btnTooltipSimular) {
      btnTooltipSimular.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tooltipCard) tooltipCard.classList.add('d-none');
        showDemoToast("Destino confirmado: Care Plus Itaim Bibi (Av. Faria Lima, 3064).");
      });
    }

    // Fechar tooltip ao clicar fora no viewport
    const viewport = document.getElementById('interactive-map-viewport');
    if (viewport && tooltipCard) {
      viewport.addEventListener('click', () => {
        tooltipCard.classList.add('d-none');
      });
    }

    // Botões de navegação do Google Maps (comportamento simulado sem redirecionar)
    const btnGoogleMapsMobile = document.getElementById('btn-open-google-maps-mobile');
    const btnDemoMapIcon = document.getElementById('btn-demo-map-icon');

    if (btnGoogleMapsMobile) {
      btnGoogleMapsMobile.addEventListener('click', (e) => {
        e.preventDefault();
        showDemoToast("Rota acadêmica simulada com sucesso! Destino: Unidade Care Plus Itaim Bibi.");
      });
    }

    if (btnDemoMapIcon) {
      btnDemoMapIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showDemoToast("Integração visual com o Google Maps em modo demonstração.");
      });
    }

    // Controles de Zoom
    const transformLayer = document.getElementById('map-transform-layer');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnRecenter = document.getElementById('btn-recenter');

    if (btnZoomIn && transformLayer) {
      btnZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (zoomLevel < 1.8) {
          zoomLevel += 0.2;
          aplicarTransformMapa(transformLayer);
        }
      });
    }

    if (btnZoomOut && transformLayer) {
      btnZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        if (zoomLevel > 0.8) {
          zoomLevel -= 0.2;
          aplicarTransformMapa(transformLayer);
        }
      });
    }

    if (btnRecenter && transformLayer) {
      btnRecenter.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        aplicarTransformMapa(transformLayer);
      });
    }

    // Alternar Camada de Trânsito
    const btnToggleTraffic = document.getElementById('btn-toggle-traffic');
    const trafficLayerGroup = document.getElementById('traffic-layer-group');
    const mapTrafficLegend = document.getElementById('map-traffic-legend');

    if (btnToggleTraffic) {
      btnToggleTraffic.addEventListener('click', (e) => {
        e.stopPropagation();
        camadaTransitoAtiva = !camadaTransitoAtiva;
        btnToggleTraffic.classList.toggle('active', camadaTransitoAtiva);
        if (trafficLayerGroup) trafficLayerGroup.style.display = camadaTransitoAtiva ? '' : 'none';
        if (mapTrafficLegend) mapTrafficLegend.style.display = camadaTransitoAtiva ? '' : 'none';
      });
    }

    // Seleção de Modais de Transporte Alternativos (Metrô, Ônibus, Carro, Bike)
    const modalButtons = document.querySelectorAll('.transport-modal-btn');
    modalButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.transport-modal-btn') || btn;
        const modalId = targetBtn.getAttribute('data-modal-id');
        if (modalId) {
          selecionarModalTransporte(modalId);
        }
      });
    });

    // Alteração de Horário de Consulta
    const inputHorario = document.getElementById('input-horario-consulta');
    if (inputHorario) {
      inputHorario.addEventListener('change', () => {
        CLINICA_DESTINO.horarioConsulta = inputHorario.value;
        atualizarPrevisaoDinâmica();
      });
    }
  }

  function aplicarTransformMapa(layer) {
    if (layer) {
      layer.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
    }
  }

  /**
   * Altera o meio de transporte selecionado e atualiza a rota no mapa
   */
  function selecionarModalTransporte(modalId) {
    modalAtivoId = modalId;
    const modalAtivo = MODAIS_TRANSPORTE.find(m => m.id === modalId);
    if (!modalAtivo) return;

    // Atualiza botões do seletor
    document.querySelectorAll('.transport-modal-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-modal-id') === modalId);
    });

    // Atualiza o traçado do caminho no mapa SVG
    const activeRoutePath = document.getElementById('active-route-path');
    if (activeRoutePath) {
      activeRoutePath.setAttribute('d', modalAtivo.pathSvg);
      activeRoutePath.setAttribute('stroke', modalAtivo.corPath);
    }

    // Atualiza status e alertas
    const badge = document.getElementById('traffic-status-badge');
    const badgeText = document.getElementById('traffic-status-text');
    if (badge && badgeText) {
      badge.className = `traffic-badge ${modalAtivo.badgeClass}`;
      badgeText.textContent = modalAtivo.statusTexto;
    }

    // Atualiza card de detalhes do modal
    const elName = document.getElementById('modal-chosen-name');
    const elDist = document.getElementById('modal-chosen-distance');
    const elTime = document.getElementById('modal-chosen-time');
    const elDetail = document.getElementById('modal-chosen-detail');

    if (elName) elName.textContent = modalAtivo.nome;
    if (elDist) elDist.textContent = `${modalAtivo.distancia} • ${modalAtivo.destaque}`;
    if (elTime) elTime.textContent = `${modalAtivo.duracao} min`;
    if (elDetail) elDetail.textContent = modalAtivo.detalhe;

    // Atualiza o melhor horário de saída
    atualizarPrevisaoDinâmica();
  }

  /**
   * Recalcula horários e atualiza elementos visuais da tela
   */
  function atualizarPrevisaoDinâmica() {
    const modalAtivo = MODAIS_TRANSPORTE.find(m => m.id === modalAtivoId) || MODAIS_TRANSPORTE[0];
    const horarioConsulta = CLINICA_DESTINO.horarioConsulta || "15:30";

    const resultado = calcularMelhorHorarioSaida(horarioConsulta, modalAtivo.duracao, margemSegurancaMinutos);

    const elBestDeparture = document.getElementById('best-departure-time');
    const elEstimatedArrival = document.getElementById('estimated-arrival-time');
    const elCountdown = document.getElementById('departure-countdown');
    const elBadge = document.getElementById('departure-badge');

    if (elBestDeparture) elBestDeparture.textContent = resultado.horarioSaida;
    if (elEstimatedArrival) elEstimatedArrival.textContent = resultado.horarioChegada;

    // Calcular contagem regressiva em relação ao horário atual
    const agora = new Date();
    const [hSaida, mSaida] = resultado.horarioSaida.split(':').map(Number);
    const dataSaidaHoje = new Date();
    dataSaidaHoje.setHours(hSaida, mSaida, 0, 0);

    const diferencaMinutos = Math.round((dataSaidaHoje.getTime() - agora.getTime()) / 60000);

    if (elCountdown) {
      if (diferencaMinutos > 0) {
        elCountdown.textContent = `${diferencaMinutos} min`;
        if (elBadge) {
          elBadge.className = "badge bg-success font-xs px-2 py-1";
          elBadge.textContent = "No Horário";
        }
      } else if (diferencaMinutos >= -15) {
        elCountdown.textContent = "SAIA AGORA!";
        if (elBadge) {
          elBadge.className = "badge bg-warning text-dark font-xs px-2 py-1";
          elBadge.textContent = "Momento Crítico";
        }
      } else {
        elCountdown.textContent = "Atrasado";
        if (elBadge) {
          elBadge.className = "badge bg-danger font-xs px-2 py-1";
          elBadge.textContent = "Atraso Provável";
        }
      }
    }
  }

  function atualizarCoresTemaMapa() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const localStreets = document.querySelectorAll('.map-local-streets line');
    localStreets.forEach(line => {
      line.setAttribute('stroke', isDark ? '#1d2a3f' : '#ffffff');
    });
    const avenueBorders = document.querySelectorAll('.map-avenues line[stroke="#e0ded9"], .map-avenues path[stroke="#e0ded9"]');
    avenueBorders.forEach(el => {
      el.setAttribute('stroke', isDark ? '#1e2e45' : '#e0ded9');
    });
    const avenueFills = document.querySelectorAll('.map-avenues line[stroke="#ffebb3"], .map-avenues path[stroke="#ffebb3"], .map-avenues line[stroke="#ffe082"]');
    avenueFills.forEach(el => {
      el.setAttribute('stroke', isDark ? '#2e3e5c' : '#ffebb3');
    });
  }

  // Auto-inicializar no carregamento se o elemento existir
  document.addEventListener('DOMContentLoaded', () => {
    window.initCarePlusMaps();
  });

})();
