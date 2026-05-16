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
});