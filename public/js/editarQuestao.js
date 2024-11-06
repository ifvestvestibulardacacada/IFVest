
document.addEventListener('DOMContentLoaded', function () {
    const loadingContainer = document.getElementById('loading-container');
    const editors = [];
    const opcoesIds = [];
    const tipo = <%- JSON.stringify(questao.tipo) %>;

    const parsedContent = <%- JSON.stringify(questao.pergunta) %>;
    const parsedOpcoes = <%- JSON.stringify(Opcoes) %>;
    const deltaContent = JSON.parse(parsedContent);

    const EDITOR_IDS_OBJETIVA = ['#opcaoA', '#opcaoB', '#opcaoC', '#opcaoD', '#opcaoE'];

    const quill = initializeQuill('#editor-container', 'editor-open-btn');
    quill.setContents(deltaContent)

    editors.push(quill);
    const editorIds = (tipo === 'OBJETIVA') ? ['A', 'B', 'C', 'D', 'E'] : ['A'];
    editorIds.forEach(id => {
        // Encontre a opção correspondente em parsedOpcoes
        const opcao = parsedOpcoes.find(op => op.alternativa === id);

        // Verifique se a opção foi encontrada
        const editorInstance = initializeQuill(`#opcao${id}`, `editor-open-btn${id}`);
        if (opcao) {

            editorInstance.setContents(JSON.parse(opcao.descricao))
            editors.push({ [`#opcao${id}`]: editorInstance });
            opcoesIds.push({ [`#opcao${id}`]: opcao.id });
            // Adicione tanto a instância quanto o ID
        } else {
            console.warn(`Opção não encontrada para o ID: ${id}`);
        }
    });
    loadingContainer.style.display = 'none';
    function acessarEditorPorId(editorId) {
        const editor = editors.find(editor => editor[editorId]);
        return editor ? editor[editorId] : null; // Retorna a instância do editor ou null se não encontrado
    }


    // Função para recuperar o conteúdo de todos os editores
    function getAllContent() {
        const contents = {};
        EDITOR_IDS_OBJETIVA.forEach(id => {
            const opcaoId = opcoesIds.find((opcao => opcao[id]))
            console.log(opcaoId[id])
            const editorInstance = acessarEditorPorId(id);
            // Acessa o editor pelo ID
            if (editorInstance) {
                const tamanho = editorInstance.getLength();

                if (tamanho > 1) {
                    contents[id] = { content: editorInstance.getContents(), id: opcaoId[id] } // Armazena o conteúdo no objeto com o ID como chave
                }
            }
        });

        // Verifica se o objeto contents está vazio e lança um erro se estiver

        return contents;
    }

    // Testar a função de mostrar o conteúdo
 

    function sendEditorContent() {
        const data = getAllContent()
        const length = quill.getLength();
        const pergunta = length > 1 ? quill.getContents() : alert("A pergunta não pode estar vazia.");

        document.getElementById('respostasSelecionadas').value = JSON.stringify(data);
        const respostas = document.getElementById('respostasSelecionadas')
        console.log(respostas)
        document.getElementById('pergunta').value = JSON.stringify(pergunta);
    }

    document.querySelector('.botao-registro').addEventListener('click', sendEditorContent);

})



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

    // Função para enviar o formulário
    document.querySelector('form').addEventListener('submit', function (event) {
        // Impede o envio do formulário para poder testar

        // Aqui você pode adicionar qualquer lógica adicional antes de enviar o formulário

        // Permita que o formulário seja enviado normalmente
        this.submit(); // Descomente esta linha para enviar o formulário após o teste
    });
});



// Exemplo de uso:


// Inserindo no Quill editor
// Wait for the DOM to load completely
