function initializeQuill(editorId) {
    const quill = new Quill(editorId, {
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
                ['align', { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
                ['formula'],
                
            ]
        }
    });

    quill.on('text-change', function (delta, source) {
        if (source === 'user') {
            const editorContent = quill.root.innerHTML;
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `content[]`; // Usando array para múltiplos editores
            hiddenInput.value = editorContent;
            document.getElementById('myForm').appendChild(hiddenInput);
        }
    });

    quill.getModule('toolbar').addHandler('image', function () {
        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';

        imageInput.onchange = function (event) {
            const file = event.target.files[0];
            uploadImage(file, quill);
        };

        imageInput.click();
    });
  
    return quill;
}

// Função para fazer o upload da imagem
function uploadImage(file, quillInstance) {
    if (file) {
        let formData = new FormData();
        formData.append('image', file);

        fetch('/uploads/editor/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const imageUrl = data; // Supondo que a resposta fornece uma URL da imagem
            const range = quillInstance.getSelection();

            if (range) {
                quillInstance.insertEmbed(range.index, 'image', imageUrl);
                quillInstance.formatText(range.index, range.index + 1, { height: '200px', width: '100px' });
            } else {
                quillInstance.insertEmbed(quillInstance.getLength(), 'image', imageUrl);
            }
        })
        .catch(error => {
            alert('Erro no upload:', error.message);
            console.error('Erro no upload:', error);
        });
    }
}

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



