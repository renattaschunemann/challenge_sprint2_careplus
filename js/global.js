document.addEventListener('DOMContentLoaded', () => {
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