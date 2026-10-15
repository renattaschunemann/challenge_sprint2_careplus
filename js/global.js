/**
 * Care Plus - Global Scripts
 * Gerenciamento de tema (Claro / Escuro), Perfil do usuário e Gamificação (XP)
 */

(function initThemeEarly() {
    const THEME_KEY = 'careplus_theme';
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.setAttribute('data-bs-theme', initialTheme);
    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SISTEMA DE TEMA ESCURO / CLARO
    // ==========================================
    const THEME_KEY = 'careplus_theme';

    window.applyCarePlusTheme = function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (document.body) {
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
        localStorage.setItem(THEME_KEY, theme);

        // Atualizar ícones em todos os botões de toggle de tema
        const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #btnThemeToggle');
        toggleButtons.forEach(btn => {
            if (theme === 'dark') {
                btn.innerHTML = '<i class="bi bi-sun-fill text-warning"></i>';
                btn.setAttribute('title', 'Mudar para tema claro');
            } else {
                btn.innerHTML = '<i class="bi bi-moon-stars-fill text-primary"></i>';
                btn.setAttribute('title', 'Mudar para tema escuro');
            }
        });

        // Disparar evento personalizado para componentes como o mapa se ajustarem
        window.dispatchEvent(new CustomEvent('careplus-theme-changed', { detail: { theme } }));
    };

    window.toggleCarePlusTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        window.applyCarePlusTheme(newTheme);
    };

    // Vincular botões de tema existentes
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #btnThemeToggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleCarePlusTheme();
        });
    });

    // Aplicar estado inicial nos ícones
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    window.applyCarePlusTheme(currentTheme);

    // ==========================================
    // 2. SINCRONIZAÇÃO DE DADOS DO USUÁRIO
    // ==========================================
    const STORAGE_KEY_DADOS = 'careplus_user_dados';
    const savedDados = JSON.parse(localStorage.getItem(STORAGE_KEY_DADOS));
    if (savedDados && savedDados.nome) {
        const headerNames = document.querySelectorAll('.user-header-name');
        headerNames.forEach(el => {
            el.textContent = savedDados.nome;
        });
        const avatars = document.querySelectorAll('.avatar-md, .avatar');
        if (avatars.length > 0) {
            const names = savedDados.nome.trim().split(' ');
            let initials = names[0].charAt(0);
            if (names.length > 1) {
                initials += names[names.length - 1].charAt(0);
            }
            avatars.forEach(avatar => {
                avatar.textContent = initials.toUpperCase();
            });
        }
    }

    // ==========================================
    // 3. GAMIFICAÇÃO & CARE COINS (XP)
    // ==========================================
    const STORAGE_KEY_SCORE = 'careplus_score';
    let currentScore = localStorage.getItem(STORAGE_KEY_SCORE);
    if (!currentScore) {
        currentScore = "1250";
        localStorage.setItem(STORAGE_KEY_SCORE, currentScore);
    }
    
    window.updateScoreDisplays = function() {
        const score = localStorage.getItem(STORAGE_KEY_SCORE) || "1250";
        const formattedScore = parseInt(score).toLocaleString('pt-BR');
        const displays = document.querySelectorAll('.score-display-large, .score-display, .score-value, .balance-value');
        displays.forEach(el => {
            el.textContent = formattedScore;
        });
    };
    
    window.addScore = function(points) {
        let score = parseInt(localStorage.getItem(STORAGE_KEY_SCORE) || "1250");
        score += points;
        localStorage.setItem(STORAGE_KEY_SCORE, score.toString());
        window.updateScoreDisplays();
        alert(`Parabéns! Você ganhou +${points} pontos de Care Coins XP!`);
    };

    window.updateScoreDisplays();
});