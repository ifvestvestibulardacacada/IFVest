
// class QuillEditor {
//     constructor(elementId, placeholder) {
//         this.elementId = elementId;  // Armazena o ID do editor
//         this.placeholder = placeholder;

//         this.editor = new Quill(`${this.elementId}`, {
//             theme: 'snow',
//             placeholder: "Digite o texto aqui",
//             imageResize: {
//                 displaySize: true,
//             },
//             modules: {
//                 toolbar: [
//                     ['bold', 'italic', 'underline', 'strike'],
//                     ['link', 'image'],
//                     ['blockquote'],
//                     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                     [{ 'script': 'sub' }, { 'script': 'super' }],
//                     ['align', { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
//                 ]
//             },
//             formats: {
//                 mathjax: false
//             }
//         });
//         this.editor.setContents(placeholder);
//         this.addImageUploadHandler();
//     }

//     getInstance() {
//         return this.editor;
//     }

//     getContent() {
//         return this.editor.getContents();
//     }

//     getId() {
//         return this.elementId;
//     }

//     setContents(delta) {
//         if (delta instanceof Delta) {
//             this.editor.setContents(delta);
//         } else {
//             console.error('O parâmetro deve ser uma instância de Delta.');
//         }
//     }

//     addImageUploadHandler() {
//         const toolbar = this.editor.getModule('toolbar');
//         toolbar.addHandler('image', () => {
//             const imageInput = document.createElement('input');
//             imageInput.type = 'file';
//             imageInput.accept = 'image/*';

//             imageInput.onchange = (event) => {
//                 const file = event.target.files[0];
//                 this.uploadImage(file);
//             };

//             imageInput.click();
//         });
//     }

//     uploadImage(file) {
//         if (file) {
//             const formData = new FormData();
//             formData.append('image', file);

//             fetch('/uploads/editor/', {
//                 method: 'POST',
//                 body: formData
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     const imageUrl = data; // Supondo que a resposta fornece uma URL da imagem
//                     const range = this.editor.getSelection();
//                     if (range) {
//                         this.editor.insertEmbed(range.index, 'image', imageUrl);
//                         this.editor.formatText(range.index, range.index + 1, { height: '200px', width: '100px' });
//                     } else {
//                         this.editor.insertEmbed(this.editor.getLength(), 'image', imageUrl);
//                     }
//                 })
//                 .catch(error => {
//                     alert('Erro no upload:', error.message);
//                     console.error('Erro no upload:', error);
//                 });
//         }
//     }
// }




// const Parchment = Quill.imports.parchment;
// const Delta = Quill.imports.delta;

// // Extend the embed
// class Mathjax extends Parchment.Embed {
  
// 	// Create node
//   	static create(value) 
//   	{
//     	const node = super.create(value);    
// 		if (typeof value === 'string') {
//       		node.innerHTML = "&#65279;" + this.tex2svg(value) + "&#65279;";
// 	  		node.contentEditable = 'false';
//       		node.setAttribute('data-value', value);			
//     	}
//     	return node;
//   	}
	
// 	// Return the attribute value (probably for Delta)
//   	static value(domNode) 
// 	{
//     	return domNode.getAttribute('data-value');
//   	}
	
	
// 	// Manually render a MathJax equation until version 3.0.2 is not released
// 	static tex2svg(latex)
// 	{
// 		// Create a hidden node and render the formula inside
// 		let MathJaxNode = document.createElement("DIV");
// 		MathJaxNode.style.visibility = "hidden";
// 		MathJaxNode.innerHTML = '\\(' + latex + '\\)';
// 		document.body.appendChild(MathJaxNode);
// 		MathJax.typeset();
// 		let svg = MathJaxNode.innerHTML;
// 		document.body.removeChild(MathJaxNode);
// 		return svg;
// 	}
// 	/*
// 	//	Never called ? See : https://stackoverflow.com/questions/60935100/html-method-in-quill-formula-js
// 	html() {
// 		const { mathjax } = this.value();
// 		return `<span>${mathjax}</span>`;
// 	  }
// 	 */
// }

// // Set module properties
// Mathjax.blotName = 'mathjax';
// Mathjax.className = 'ql-mathjax';
// Mathjax.tagName = 'SPAN';

// // Register the module
// Quill.register(Mathjax);
const quill = new Quill('#editor-container', {
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

        fetch('/uploads/editor/', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Handle successful image upload
                const imageUrl = data.url; // Assuming response provides an image URL
                const range = quill2.getSelection();

                if (range) {
                    quill2.insertEmbed(range.index, 'image', imageUrl, quill.getSelection());
                    quill2.formatText(range.index, range.index + 1, 'height', '200px'); // Define altura fixa em 200px
                    quill2.formatText(range.index, range.index + 1, 'width', '100px');
                } else {
                    // Insert image at the end if no selection exists
                    quill2.insertEmbed(quill2.getLength(), 'image', imageUrl);

                }
            })
            .catch(error => {
                alert('Erro no upload:', error.message)
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

const quill2 = new Quill('#opcaoA', {
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


quill2.on('text-change', function (delta, source) {
    if (source === 'user') { // Update hidden input only on user changes
        const editorContent = quill2.root.innerHTML;
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

        fetch('/uploads/editor/', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Handle successful image upload
                const imageUrl = data.url; // Assuming response provides an image URL
                const range = quill2.getSelection();

                if (range) {
                    quill2.insertEmbed(range.index, 'image', imageUrl, quill.getSelection());
                    quill2.formatText(range.index, range.index + 1, 'height', '200px'); // Define altura fixa em 200px
                    quill2.formatText(range.index, range.index + 1, 'width', '100px');
                } else {
                    // Insert image at the end if no selection exists
                    quill2.insertEmbed(quill2.getLength(), 'image', imageUrl);

                }
            })
            .catch(error => {
                alert('Erro no upload:', error.message)
                console.error('Erro no upload:', error);
            });
    }
}

quill2.getModule('toolbar').addHandler('image', function () {
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
  	static create(value) 
  	{
    	const node = super.create(value);    
		if (typeof value === 'string') {
      		node.innerHTML = "&#65279;" + this.tex2svg(value) + "&#65279;";
	  		node.contentEditable = 'false';
      		node.setAttribute('data-value', value);			
    	}
    	return node;
  	}
	
	// Return the attribute value (probably for Delta)
  	static value(domNode) 
	{
    	return domNode.getAttribute('data-value');
  	}
	
	
	// Manually render a MathJax equation until version 3.0.2 is not released
	static tex2svg(latex)
	{
		let MathJaxNode = document.createElement("DIV");
		MathJaxNode.style.visibility = "hidden";
		MathJaxNode.innerHTML = latex;
		document.body.appendChild(MathJaxNode);
		MathJax.hub.typeset();
		let svg = MathJaxNode.innerHTML;
		document.body.removeChild(MathJaxNode);
		return svg;
	}

	
}

// Set module properties
Mathjax.blotName = 'mathjax';
Mathjax.className = 'ql-mathjax';
Mathjax.tagName = 'SPAN';

// Register the module
Quill.register(Mathjax);



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

