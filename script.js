const igrejaSelect = document.getElementById('igreja');
const celulaWrapper = document.getElementById('celulaWrapper');
const form = document.getElementById('inscricaoForm');
const successArea = document.getElementById('successArea');
const container = document.querySelector('.container');
const API_URL = window.location.protocol === 'file:'
    ? 'http://localhost/Icr-Evento-de-Casais-18-4-26/api.php'
    : 'api.php';

igrejaSelect.addEventListener('change', (e) => {
    if (e.target.value === "Baixada Fluminense - (Vila Rosali)") {
        celulaWrapper.classList.remove('hidden');
    } else {
        celulaWrapper.classList.add('hidden');
    }
});

form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.innerHTML = "Processando...";

    const payload = {
        nome: document.getElementById('nome').value,
        igreja: igrejaSelect.value,
        celula: document.getElementById('celula') ? document.getElementById('celula').value : "",
        camisa: document.getElementById('camisa').value
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