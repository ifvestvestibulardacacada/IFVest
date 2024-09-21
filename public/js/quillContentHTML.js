document.addEventListener('DOMContentLoaded', function () {
    // Selecione todos os elementos que possuem o atributo data-delta
    const deltaElements = document.querySelectorAll('[data-delta]');

    deltaElements.forEach(function (element) {
        const delta = JSON.parse(element.getAttribute('data-delta'));

        // Crie uma instância temporária do Quill para renderizar o delta
        const tempDiv = document.createElement('div');
        const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
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
        tempQuill.setContents(delta);

        // Insira o HTML gerado no elemento atual
        element.innerHTML = tempDiv.innerHTML;
    });
});