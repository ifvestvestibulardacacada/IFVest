
function atualizarContadorQuestoesSelecionadas() {
    const idsSelecionados = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || []);
    const numeroQuestoesSelecionadas = idsSelecionados.length;

    // Atualiza o elemento HTML com o número de questões selecionadas
    document.getElementById('numero-questoes-selecionadas').textContent = numeroQuestoesSelecionadas.toString();
}
function manipularCheckbox(checkbox) {
    const id = checkbox.value;
    const chave = 'idsSelecionados<%= simulado.id %>'; // Chave fixa para o sessionStorage

    if (checkbox.checked) {
        // Checkbox marcado, adicionar ID
        adicionarId(id, chave, checkbox);
    } else {
        // Checkbox desmarcado, remover ID
        removerId(id, chave);
    }
    atualizarContadorQuestoesSelecionadas();
}

function adicionarId(id, chave, checkbox) {
    let arrayAtual = JSON.parse(sessionStorage.getItem(chave) || "[]");
    if (!arrayAtual.includes(id)) {
        arrayAtual.push(id);
        sessionStorage.setItem(chave, JSON.stringify(arrayAtual));
    }
}

function removerId(id, chave) {
    let arrayAtual = JSON.parse(sessionStorage.getItem(chave) || "[]");
    let arrayFiltrado = arrayAtual.filter(elemento => elemento !== id);
    sessionStorage.setItem(chave, JSON.stringify(arrayFiltrado));
}

function verificarEAtualizarCheckboxes() {
    const idsSelecionados = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || []);
    document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
        const id = checkbox.value;
        if (idsSelecionados.includes(id)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

// Certifique-se de chamar essa função após o carregamento completo da página
window.addEventListener('load', function () {
    verificarEAtualizarCheckboxes(); // Para garantir que os checkboxes estejam corretamente marcados/desmarcados
    atualizarContadorQuestoesSelecionadas(); // Para atualizar o contador no carregamento da página
});



document.addEventListener('DOMContentLoaded', function () {
    // Adiciona um event listener ao botão "Associar Questões"
    document.querySelector('.botao-associar').addEventListener('click', function (event) {
        // Preenche o campo oculto com os IDs selecionados
        const selectedQuestionIds = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>'));
        const idsAsString = selectedQuestionIds.join(',');
        document.getElementById('selectedQuestionIds').value = idsAsString;

        // Limpa o item 'idsSelecionados' do sessionStorage
        sessionStorage.removeItem('idsSelecionados<%= simulado.id %>');

        // Redireciona para a página de sucesso ou realiza outra ação conforme necessário
        // Por exemplo, redirecionar para a mesma página para limpar os checkboxes
        this.submit();
    });
});


