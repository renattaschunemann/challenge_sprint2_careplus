document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY_DADOS = 'careplus_user_dados';
    const STORAGE_KEY_HISTORICO = 'careplus_user_historico';
    const defaultDados = {
        nome: "Amanda L.",
        dtNasc: "01/01/1990",
        cpf: "123.456.789-00",
        endereco: "Rua Exemplo, 123",
        contato: "(11) 99999-9999"
    };
    const defaultHistorico = {
        alergias: "Nenhuma conhecida",
        contatoPref: "WhatsApp",
        doencas: "Asma leve"
    };
    function loadData() {
        const savedDados = JSON.parse(localStorage.getItem(STORAGE_KEY_DADOS)) || defaultDados;
        document.getElementById('input-nome').value = savedDados.nome;
        document.getElementById('input-dt-nasc').value = savedDados.dtNasc;
        document.getElementById('input-cpf').value = savedDados.cpf;
        document.getElementById('input-endereco').value = savedDados.endereco;
        document.getElementById('input-contato').value = savedDados.contato;
        const savedHistorico = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORICO)) || defaultHistorico;
        document.getElementById('input-alergias').value = savedHistorico.alergias;
        document.getElementById('input-contato-pref').value = savedHistorico.contatoPref;
        document.getElementById('input-doencas').value = savedHistorico.doencas;
    }
    function toggleEditMode(sectionId, isEditing) {
        const section = document.getElementById(sectionId);
        const inputs = section.querySelectorAll('input, select');
        const saveDiv = document.getElementById(sectionId === 'section-dados' ? 'div-save-dados' : 'div-save-historico');
        const editBtn = document.getElementById(sectionId === 'section-dados' ? 'btn-edit-dados' : 'btn-edit-historico');
        inputs.forEach(input => {
            if (isEditing) {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
                input.classList.remove('form-control-readonly');
            } else {
                if (input.tagName === 'SELECT') {
                    input.setAttribute('disabled', true);
                } else {
                    input.setAttribute('readonly', true);
                }
                input.classList.add('form-control-readonly');
            }
        });
        if (isEditing) {
            saveDiv.classList.remove('d-none');
            editBtn.classList.add('d-none');
        } else {
            saveDiv.classList.add('d-none');
            editBtn.classList.remove('d-none');
        }
    }
    document.getElementById('btn-edit-dados').addEventListener('click', () => {
        toggleEditMode('section-dados', true);
    });
    document.getElementById('btn-cancel-dados').addEventListener('click', () => {
        loadData(); 
        toggleEditMode('section-dados', false);
    });
    document.getElementById('btn-save-dados').addEventListener('click', () => {
        const dadosToSave = {
            nome: document.getElementById('input-nome').value,
            dtNasc: document.getElementById('input-dt-nasc').value,
            cpf: document.getElementById('input-cpf').value,
            endereco: document.getElementById('input-endereco').value,
            contato: document.getElementById('input-contato').value
        };
        localStorage.setItem(STORAGE_KEY_DADOS, JSON.stringify(dadosToSave));
        toggleEditMode('section-dados', false);
        alert('Dados pessoais atualizados com sucesso!');
    });
    document.getElementById('btn-edit-historico').addEventListener('click', () => {
        toggleEditMode('section-historico', true);
    });
    document.getElementById('btn-cancel-historico').addEventListener('click', () => {
        loadData(); 
        toggleEditMode('section-historico', false);
    });
    document.getElementById('btn-save-historico').addEventListener('click', () => {
        const historicoToSave = {
            alergias: document.getElementById('input-alergias').value,
            contatoPref: document.getElementById('input-contato-pref').value,
            doencas: document.getElementById('input-doencas').value
        };
        localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(historicoToSave));
        toggleEditMode('section-historico', false);
        alert('Histórico e preferências atualizados com sucesso!');
    });
    loadData();
});