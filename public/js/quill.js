document.addEventListener('DOMContentLoaded', function () {
const loadingContainer = document.getElementById('loading-container');
const tipo = <%- JSON.stringify(tipo) %>;

const editors = [];

const quill = initializeQuill('#editor-container', 'editor-open-btn', 'Digite aqui o Enunciado da questão');
editors.push({ ['#editor-container']: quill });


// Lista de IDs dos containers dos editores (sem a vírgula inicial)
// Definindo constantes para os IDs dos editores
const EDITOR_IDS_OBJETIVA = ['A', 'B', 'C', 'D', 'E'];
const EDITOR_ID_RESPOSTA = 'A';

// Função para criar editores
function criarEditores(ids, placeholder) {
    ids.forEach(id => {
        const editorInstance = initializeQuill(`#opcao${id}`,`editor-open-btn${id}`,  'Digite aqui a alternativa'); // Adicionando o placeholder se necessário
        editors.push({ [`#opcao${id}`]: editorInstance }); // Corrigido para usar a sintaxe correta
    });
}

// Verificando o tipo de questão e criando os editores apropriados
if (tipo === 'objetiva') {
    criarEditores(EDITOR_IDS_OBJETIVA);
} else {
    const respostaEditor = initializeQuill(`#opcao${id}`, 'Digite aqui a resposta',`editor-open-btn${id}`);
    editors.push({ [EDITOR_ID_RESPOSTA]: respostaEditor });
}
loadingContainer.style.display = 'none';

// Função para recuperar a instância de um editor pelo ID
function acessarEditorPorId(editorId) {
    const editor = editors.find(editor => editor[editorId]);
    return editor ? editor[editorId] : null; // Retorna a instância do editor ou null se não encontrado
}

// Função para recuperar o conteúdo de todos os editores
function getAllContent() {
    const contents = {};
    EDITOR_IDS_OBJETIVA.forEach(id => {
        const editorInstance = acessarEditorPorId(id); // Acessa o editor pelo ID
        if (editorInstance) {
            const tamanho = editorInstance.getLength();

            if (tamanho > 1) {
                contents[id] = editorInstance.getContents(); // Armazena o conteúdo no objeto com o ID como chave
            }
        }
    });

    // Verifica se o objeto contents está vazio e lança um erro se estiver
    if (Object.keys(contents).length === 0) {
        alert("Erro: Nenhum conteúdo encontrado.");
    }

    return contents;
}
// Testar a função de mostrar o conteúdo
 
function sendEditorContent() {
    const data = getAllContent()
    console.log(data)
    const length = quill.getLength();
    const pergunta = length > 1 ? quill.getContents() : alert("A pergunta não pode estar vazia.");
    document.getElementById('respostasSelecionadas').value = JSON.stringify(data);
    document.getElementById('pergunta').value = JSON.stringify(pergunta);
}

document.querySelector('.botao-registro').addEventListener('click', sendEditorContent);
})