const igrejaSelect = document.getElementById('igreja');
const celulaWrapper = document.getElementById('celulaWrapper');
const form = document.getElementById('inscricaoForm');
const successArea = document.getElementById('successArea');

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
        const response = await fetch('api.php', {
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
            form.classList.add('hidden');
            document.querySelector('.header').classList.add('hidden');
            successArea.classList.remove('hidden');
        } else {
            alert("Erro: " + result.message);
            btn.disabled = false;
            btn.innerHTML = "Tentar Novamente";
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
        btn.disabled = false;
        btn.innerHTML = "Confirmar Inscrição";
    }
};