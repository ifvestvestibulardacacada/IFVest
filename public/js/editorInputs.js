// Adicionar evento de escuta para o botão de envio do formulário
document.querySelector('.botao-registro').addEventListener('click', sendEditorContent);


document.getElementById('areaId').addEventListener('change', function () {
    var searchContainer = document.getElementById('topicosSearchContainer');
    if (this.value === '') {
        // Oculta a barra de pesquisa se nenhuma área for selecionada
        searchContainer.style.display = 'none';
    } else {
        // Exibe a barra de pesquisa se uma área for selecionada
        searchContainer.style.display = 'block';
    }
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search').addEventListener('input', function (e) {
        console.log('Pesquisa:', e.target.value);
        var searchValue = e.target.value.toLowerCase();
        var listItems = document.querySelectorAll('#dropdown-list li');

        listItems.forEach(function (item) {
            var label = item.querySelector('label').textContent.toLowerCase();
            if (label.indexOf(searchValue) > -1) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('vestibularId').addEventListener('change', function () {
        var input = document.getElementById('meuInput');
        if (this.value === 'outro') {
            // Mostra o campo de entrada se o usuário selecionar "Outro"
            input.style.display = 'block';
        } else {
            // Esconde o campo de entrada para outras opções
            input.style.display = 'none';
            input.value = ''; // Limpa o valor do campo de entrada
        }
    });

    // Função para enviar o formulário
    document.querySelector('form').addEventListener('submit', function (event) {
        // Impede o envio do formulário para poder testar

        // Aqui você pode adicionar qualquer lógica adicional antes de enviar o formulário

        // Permita que o formulário seja enviado normalmente
        this.submit(); // Descomente esta linha para enviar o formulário após o teste
    });
});
