function resgatarBrinde(nomeBrinde, custo) {
    const STORAGE_KEY_SCORE = 'careplus_score';
    let score = parseInt(localStorage.getItem(STORAGE_KEY_SCORE) || "1250");
    
    if (score >= custo) {
        score -= custo;
        localStorage.setItem(STORAGE_KEY_SCORE, score.toString());
        window.updateScoreDisplays();
        
        document.getElementById('nomeBrindeResgatado').textContent = nomeBrinde;
        const modal = new bootstrap.Modal(document.getElementById('modalResgate'));
        modal.show();
    } else {
        document.getElementById('nomeBrindeErro').textContent = nomeBrinde;
        const modal = new bootstrap.Modal(document.getElementById('modalErro'));
        modal.show();
    }
}
