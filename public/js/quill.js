
document.getElementById('delta').onclick = () => {
    console.log(quill.getContents());
};
var quill = new Quill('#editor-container', {
    placeholder: 'Adicione aqui o Enunciado da questão',
    theme: 'snow',
    imageResize: {
        displaySize: true
    },
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            ['blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['align', { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }]
        ]
    },
});


quill.on('text-change', function (delta, source) {
    if (source === 'user') { // Update hidden input only on user changes
        const editorContent = quill.root.innerHTML;
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'content'; // Adjust name if needed
        hiddenInput.value = editorContent;
        document.getElementById('myForm').appendChild(hiddenInput);
    }
});

function uploadImage(file) {
    if (file) {
        let formData = new FormData();
        formData.append('image', file);

        fetch('/uploads/editor', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Handle successful image upload
                const imageUrl = data.url; // Assuming response provides an image URL
                const range = quill.getSelection();

                if (range) {
                    quill.insertEmbed(range.index, 'image', imageUrl, quill.getSelection());
                    quill.formatText(range.index, range.index + 1, 'height', '200px'); // Define altura fixa em 200px
                    quill.formatText(range.index, range.index + 1, 'width', '100px');
                } else {
                    // Insert image at the end if no selection exists
                    quill.insertEmbed(quill.getLength(), 'image', imageUrl);

                }
            })
            .catch(error => {
                console.error('Erro no upload:', error);
            });
    }
}

quill.getModule('toolbar').addHandler('image', function () {
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';

    imageInput.onchange = function (event) {
        const file = event.target.files[0];
        uploadImage(file);
    };

    imageInput.click();
});
// Display the current delta content of the editor in the console


// Import parchment and delta for creating custom module
const Parchment = Quill.imports.parchment;
const Delta = Quill.imports.delta;

// Extend the embed
class Mathjax extends Parchment.Embed {

    // Create node
    static create(value) {
        const node = super.create(value);
        if (typeof value === 'string') {
            node.innerHTML = "&#65279;" + this.tex2svg(value) + "&#65279;";
            node.contentEditable = 'false';
            node.setAttribute('data-value', value);
        }
        return node;
    }


    static value(domNode) {
        return domNode.getAttribute('data-value');
    }


    static tex2svg(latex) {
        let MathJaxNode = document.createElement("DIV");
        MathJaxNode.style.visibility = "hidden";
        MathJaxNode.innerHTML = latex;
        document.body.appendChild(MathJaxNode);
        MathJax.typeset();
        let svg = MathJaxNode.innerHTML;
        document.body.removeChild(MathJaxNode);
        return svg;
    }

}

Mathjax.blotName = 'mathjax';
Mathjax.className = 'ql-mathjax';
Mathjax.tagName = 'SPAN';


Quill.register(Mathjax);



function sendEditorContent() {
    const editorContent = quill.getContents()
    document.getElementById('pergunta').value = JSON.stringify(editorContent);
}

document.querySelector('.botao-registro').addEventListener('click', sendEditorContent);

// Adicionar evento de escuta para o botão de envio do formulário


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
