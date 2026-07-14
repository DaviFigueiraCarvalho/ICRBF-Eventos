// Elementos do DOM
const igrejaSelect = document.getElementById('igreja');
const outraIgrejaWrapper = document.getElementById('outraIgrejaWrapper');
const outraIgrejaInput = document.getElementById('outraIgreja');
const dataNascimentoInput = document.getElementById('dataNascimento');
const idadeInput = document.getElementById('idade');
const telefoneInput = document.getElementById('telefone');
const restricaoRadios = document.getElementsByName('restricao');
const restricoesWrapper = document.getElementById('restricoesWrapper');
const necessidadesRadios = document.getElementsByName('necessidades');
const necessidadesWrapper = document.getElementById('necessidadesWrapper');
const autorizacaoImagem = document.getElementById('autorizacaoImagem');
const form = document.getElementById('inscricaoForm');
const successArea = document.getElementById('successArea');
const container = document.querySelector('.container');
const periodoIndisponivel = document.getElementById('periodo-indisponivel');
const mensagemPeriodo = document.getElementById('mensagem-periodo');

const API_URL = window.location.protocol === 'file:'
    ? 'https://www.icravivalista.com.br/api.php'
    : 'api.php';

// Datas do período de inscrições
const INICIO_INSCRICOES = new Date('2026-07-13T00:00:00');
const FIM_INSCRICOES = new Date('2026-07-19T23:59:59');

// Função auxiliar para obter elementos por name
function getElementsByName(name) {
    return document.getElementsByName(name);
}

// Função para verificar período de inscrições
function verificarPeriodoInscricoes() {
    const agora = new Date();
    
    if (agora < INICIO_INSCRICOES) {
        // Antes do início
        periodoIndisponivel.classList.remove('hidden');
        mensagemPeriodo.textContent = 'As inscrições ainda não começaram.';
        form.classList.add('hidden');
        return false;
    } else if (agora > FIM_INSCRICOES) {
        // Após o fim
        periodoIndisponivel.classList.remove('hidden');
        mensagemPeriodo.textContent = 'As inscrições para a EBF 2026 foram encerradas.';
        form.classList.add('hidden');
        return false;
    }
    
    // Período válido
    return true;
}

// Calcular idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
    if (!dataNascimento) return '';
    
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    // Ajusta se ainda não fez aniversário este ano
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade >= 0 ? idade : '';
}

// Máscara de telefone brasileiro
function aplicarMascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    if (valor.length > 7) {
        const parte1 = valor.substring(0, 2);
        const parte2 = valor.substring(2, 7);
        const parte3 = valor.substring(7, 11);
        return `(${parte1}) ${parte2}-${parte3}`;
    } else if (valor.length > 2) {
        const parte1 = valor.substring(0, 2);
        const parte2 = valor.substring(2);
        return `(${parte1}) ${parte2}`;
    } else if (valor.length > 0) {
        return `(${valor}`;
    }
    
    return valor;
}

// Event Listeners

// Cálculo automático da idade
dataNascimentoInput.addEventListener('change', function() {
    const idade = calcularIdade(this.value);
    idadeInput.value = idade > 0 ? `${idade} anos` : '';
});

// Máscara de telefone
telefoneInput.addEventListener('input', function() {
    const valorOriginal = this.value;
    const valorComMascara = aplicarMascaraTelefone(valorOriginal);
    this.value = valorComMascara;
});

// Controle do campo "Outra igreja"
igrejaSelect.addEventListener('change', function() {
    if (this.value === 'Outra') {
        outraIgrejaWrapper.classList.remove('hidden');
        outraIgrejaInput.required = true;
    } else {
        outraIgrejaWrapper.classList.add('hidden');
        outraIgrejaInput.required = false;
        outraIgrejaInput.value = '';
    }
});

// Controle de restrições alimentares
restricaoRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'sim' && this.checked) {
            restricoesWrapper.classList.remove('hidden');
            document.getElementById('restricoes').required = true;
        } else {
            restricoesWrapper.classList.add('hidden');
            document.getElementById('restricoes').required = false;
            document.getElementById('restricoes').value = '';
        }
    });
});

// Controle de necessidades especiais
necessidadesRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'sim' && this.checked) {
            necessidadesWrapper.classList.remove('hidden');
            document.getElementById('necessidades').required = true;
        } else {
            necessidadesWrapper.classList.add('hidden');
            document.getElementById('necessidades').required = false;
            document.getElementById('necessidades').value = '';
        }
    });
});

// Submit do formulário
form.onsubmit = async (e) => {
    e.preventDefault();
    
    // Validar autorização de imagem
    if (!autorizacaoImagem.checked) {
        alert('Você deve autorizar o uso de imagem da criança para continuar.');
        return;
    }
    
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons">hourglass_empty</span> Processando...';
    
    // Montar payload
    const payload = {
        nome: document.getElementById('nome').value.trim(),
        data_nascimento: dataNascimentoInput.value,
        idade: parseInt(idadeInput.value) || 0,
        responsaveis: document.getElementById('responsaveis').value.trim(),
        telefone: telefoneInput.value.trim(),
        possui_restricao: getElementsByName('restricao')[0].checked ? 'nao' : 'sim',
        restricoes: getElementsByName('restricao')[1].checked ? document.getElementById('restricoes').value.trim() : '',
        possui_necessidades: getElementsByName('necessidades')[0].checked ? 'nao' : 'sim',
        necessidades: getElementsByName('necessidades')[1].checked ? document.getElementById('necessidades').value.trim() : '',
        igreja: igrejaSelect.value,
        outra_igreja: igrejaSelect.value === 'Outra' ? outraIgrejaInput.value.trim() : '',
        autorizacao_imagem: autorizacaoImagem.checked ? 'sim' : 'nao'
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
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
            btn.innerHTML = '<span class="material-icons">confirmation_number</span> Emitir Passaporte';
        }
    } catch (error) {
        console.error(error);
        if (error.message === 'Failed to fetch') {
            alert('Falha de conexão com o servidor. Abra pelo localhost (http://localhost/...) ou inicie o Apache no XAMPP.');
        } else {
            alert(error.message);
        }
        btn.disabled = false;
        btn.innerHTML = '<span class="material-icons">confirmation_number</span> Emitir Passaporte';
    }
};

// Verificar período de inscrições ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    verificarPeriodoInscricoes();
});