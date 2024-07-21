function formatDoc(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd);
    }
}

function addLink() {
    const url = prompt('Insert url');
    formatDoc('createLink', url);
}




const content = document.getElementById('content');

content.addEventListener('mouseenter', function () {
    const a = content.querySelectorAll('a');
    a.forEach(item => {
        item.addEventListener('mouseenter', function () {
            content.setAttribute('contenteditable', false);
            item.target = '_blank';
        })
        item.addEventListener('mouseleave', function () {
            content.setAttribute('contenteditable', true);
        })
    })
})


const showCode = document.getElementById('show-code');
let active = false;

showCode.addEventListener('click', function () {
    showCode.dataset.active = !active;
    active = !active
    if (active) {
        content.textContent = content.innerHTML;
        content.setAttribute('contenteditable', false);
    } else {
        content.innerHTML = content.textContent;
        content.setAttribute('contenteditable', true);
    }
})



const filename = document.getElementById('filename');

function fileHandle(value) {
    if (value === 'new') {
        content.innerHTML = '';
        filename.value = 'untitled';
    } else if (value === 'txt') {
        const blob = new Blob([content.innerText])
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename.value}.txt`;
        link.click();
    } else if (value === 'pdf') {
        html2pdf(content).save(filename.value);
    }
}

function addResposta() {

    const container = document.getElementById("respostas-container");
    const div = document.createElement("div");
    div.className = "resposta-item";
    div.id = "resposta-item-" + new Date().getTime(); // Adiciona um ID único para cada item de resposta


    const input = document.createElement("input");
    input.type = "text" // Define o tipo de input como radio
    input.name = "respostas[]"; // Todos os botões de opção compartilham o mesmo nome
    input.id = "inputTexto"
    input.classList.add('input-resposta')
    input.placeholder = "Sua resposta"

    const inputFile = document.createElement("input");
    inputFile.type = "file"; // Define o tipo de input como radio
    inputFile.name = "files[]"; // Todos os botões de opção compartilham o mesmo nome
    inputFile.id = "inputFile"
    inputFile.classList.add('input-resposta')
    inputFile.placeholder = "Sua resposta"
    inputFile.onchange = function() {
        // Aqui você pode chamar a função uploadImage com o primeiro arquivo selecionado
        previewImage(this);
        // uploadImageRespostas(this.files[0]);
    };

    const imagePreview = document.createElement("img");
    imagePreview.id = "imagePreview";
    imagePreview.style.width = "150px";
    imagePreview.style.height = "75px";
    // Conta o número total de itens de resposta para definir o valor do botão de opção
    const totalRespostas = container.querySelectorAll('.resposta-item').length + 1;

    const checkbox = document.createElement("input");
    checkbox.type = "radio"; // Define o tipo de input como radio
    checkbox.name = "correta"; // Todos os botões de opção compartilham o mesmo nome
    checkbox.value = totalRespostas; // Define o valor do botão de opção como o índice da resposta

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Remover resposta";
    button.onclick = function () {
        div.remove();
        // Atualiza os valores dos botões de opção após remover uma resposta
        const respostas = container.querySelectorAll('.resposta-item');
        respostas.forEach((resposta, index) => {
            const checkbox = resposta.querySelector('input[type="radio"]');
            checkbox.value = index + 1; // Ajusta o valor do botão de opção
        });
    };

    div.appendChild(checkbox);
    div.appendChild(input);
    div.appendChild(inputFile);
    div.appendChild(imagePreview);
    div.appendChild(button);
    container.appendChild(div);
}
// Função para manipular os checkboxes e inputs de texto


// Chame a função no evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {


    // Função para enviar o formulário
    document.querySelector('form').addEventListener('submit', function (event) {
        // Impede o envio do formulário para poder testar

        // Aqui você pode adicionar qualquer lógica adicional antes de enviar o formulário

        // Permita que o formulário seja enviado normalmente
        this.submit(); // Descomente esta linha para enviar o formulário após o teste
    });
});


function updateTopicos(Areas) {
    // Obter o elemento select da área
    const areaSelect = document.getElementById('areaId');
    const searchInput = document.getElementById('search');

    // Obter o valor selecionado da área
    const selectedAreaId = areaSelect.value;

    // Obter os tópicos correspondentes à área selecionada
    const selectedArea = Areas.find(area => area.id === parseInt(selectedAreaId));
    const topicos = selectedArea ? selectedArea.Topico : [];

    // Obter o elemento container de tópicos
    const topicosContainer = document.getElementById('topicosLista');

    // Limpar as opções de tópicos
    topicosContainer.innerHTML = '';

    // Adicionar as opções de tópicos ao container
    topicos.forEach(topico => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Ajuste o atributo name para enviar os valores como um array
        checkbox.name = 'topicosSelecionados[]';
        checkbox.value = topico.id; // Certifique-se de que o valor é o ID do tópico


        const label = document.createElement('label');
        label.htmlFor = 'topico-' + topico.id;
        label.textContent = topico.materia;

        topicosContainer.appendChild(checkbox);
        topicosContainer.appendChild(label);
        topicosContainer.appendChild(document.createElement('br')); // Add a line break for better readability
    });
}
// Chame a função após adicionar um novo elemento

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
                let img = document.createElement('img');

                img.src = data;
                img.style.width = "200px";
                img.style.height = "150px";

                imgurl = img.outerHTML;
                console.log(imgurl);
                let content = document.getElementById('content');
                let input = document.getElementById('inputTexto')
                input.value = imgurl
                content.innerHTML += imgurl;

                localStorage.setItem('editorContent', content.innerHTML);


            })
            .catch(error => {
                console.error('Erro no upload:', error);
            });
    }
}

function previewImage(inputElement) {
    const reader = new FileReader();
    const file = inputElement.files[0];
    reader.onload = function (e) {
        // Encontra o elemento img dentro do mesmo div que o inputElement
        const imagePreview = inputElement.parentElement.querySelector('img');
        if (imagePreview) {
            // Primeiro, atualiza o src com o preview local
            imagePreview.src = e.target.result;

            // Em seguida, envia a imagem para o servidor
            let formData = new FormData();
            formData.append('image', file);

            fetch('/uploads/editor', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    let img = document.createElement('img');

                    img.src = data;
                    img.style.width = "200px";
                    img.style.height = "150px";

                    imgurl = img.outerHTML;
                    const textInput = inputElement.parentElement.querySelector('input[type="text"]');
                    textInput.value = data;
                    textInput.readOnly = true;
                   
                    // Se necessário, atualiza outros elementos ou lógica com a resposta do servidor
                    console.log('Imagem enviada para o servidor:', data);
                })
                .catch(error => {
                    console.error('Erro no upload:', error);
                });
        }
    }
    reader.readAsDataURL(file);
}

//Modal Topicos - Array de tópicos
function addTopico() {
    const container = document.getElementById("topico-container");
    const div = document.createElement("div");
    div.className = "topico-item";
    div.id = "topico-item-" + new Date().getTime(); // Add a class for styling if needed

    const input = document.createElement("input");
    input.type = "text"; // This should be "text" for the input field
    input.name = "topicos[]";
    input.placeholder = "Digite o tópico";



    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Remover topico";
    button.onclick = function () {
        div.remove();
    };

    div.appendChild(input);
    div.appendChild(button);
    container.appendChild(div);

}

