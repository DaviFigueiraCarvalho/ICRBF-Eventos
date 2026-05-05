const celulaSelect = document.getElementById('celula');
const filhosCheckbox = document.getElementById('filhos');
const qntsWrapper = document.getElementById('qntsWrapper');
const qntsInput = document.getElementById('qnts');
const form = document.getElementById('inscricaoForm');
const successArea = document.getElementById('successArea');
const container = document.querySelector('.container');
const API_URL = window.location.protocol === 'file:'
    ? 'https://www.icravivalista.com.br/api.php'
    : 'api.php';

filhosCheckbox.addEventListener('change', () => {
    if (filhosCheckbox.checked) {
        qntsWrapper.classList.remove('hidden');
        qntsInput.required = true;
        qntsInput.disabled = false;
        qntsInput.focus();
    } else {
        qntsWrapper.classList.add('hidden');
        qntsInput.required = false;
        qntsInput.disabled = true;
        qntsInput.value = '';
    }
});

form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.innerHTML = "Processando...";

    const payload = {
        nome: document.getElementById('nome').value,
        celula: celulaSelect.value,
        filhos: filhosCheckbox.checked,
        qnts: filhosCheckbox.checked ? Number(qntsInput.value || 0) : 0
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Debug para ver se o PHP respondeu algo que não é JSON
        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (err) {
            throw new Error("O servidor retornou uma resposta inválida: " + text);
        }

        if (result.status === "success") {
            document.body.classList.add('success-mode');
            container.classList.add('hidden');
            successArea.classList.remove('hidden');
        } else {
            alert("Erro: " + result.message);
            btn.disabled = false;
            btn.innerHTML = "Tentar Novamente";
        }
    } catch (error) {
        console.error(error);
        if (error.message === 'Failed to fetch') {
            alert('Falha de conexao com o servidor. Abra pelo localhost (http://localhost/...) ou inicie o Apache no XAMPP.');
        } else {
            alert(error.message);
        }
        btn.disabled = false;
        btn.innerHTML = "Confirmar Inscrição";
    }
};