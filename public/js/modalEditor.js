const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
 modal.classList.toggle("hide");
 fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
 el.addEventListener("click", () => toggleModal());
});

//Salvar os Dados do Modal
function saveModalData() {
 // Coletar todos os campos de entrada com o nome "topicos[]"
 const topicosInputs = document.querySelectorAll('#modal input[name="topicos[]"]');
 const topicos = [];

 // Iterar sobre cada campo de entrada e adicionar seu valor ao array topicos
 topicosInputs.forEach(input => {
     if (input.value.trim() !== '') { // Verifica se o campo não está vazio
       topicos.push(input.value);
     }
 });

 // Salvar o array topicos no localStorage
 localStorage.setItem('topicos', JSON.stringify(topicos));

 // Atualiza a página com os tópicos salvos
 updatePageWithTopicos();
}

//Restaurar os Dados do Modal
function restoreModalData() {
 // Verifica se há dados salvos para o campo "topicos"
 const savedTopicos = localStorage.getItem('topicos');
 if (savedTopicos) {
     // Converte a string JSON de volta para um array
     const topicos = JSON.parse(savedTopicos);

     // Coletar todos os campos de entrada com o nome "topicos[]"
     const topicosInputs = document.querySelectorAll('#modal input[name="topicos[]"]');

     // Iterar sobre cada campo de entrada e definir seu valor com base no array topicos
     topicosInputs.forEach((input, index) => {
       if (topicos[index]) {
         input.value = topicos[index];
       }
     });
 }
}

//Atualizar os topicos na tela sem ter que recarregar ela 
function updatePageWithTopicos() {
 const savedTopicos = localStorage.getItem('topicos');
 if (savedTopicos) {
     const topicos = JSON.parse(savedTopicos);
     const container = document.getElementById('topicos-container');

     // Limpa o container antes de adicionar os novos tópicos
     container.innerHTML = '';

     topicos.forEach(topico => {
       const p = document.createElement('p');
       p.textContent = topico;
       container.appendChild(p);
     });
 }
}

//Chamar as Funções
document.getElementById('close-modal').addEventListener('click', saveModalData);
document.getElementById('save-modal').addEventListener('click', saveModalData);
document.getElementById('open-modal').addEventListener('click', restoreModalData);

//Limpar os Dados do Modal
function clearModalData() {
 document.querySelectorAll('#modal input, #modal textarea').forEach(input => {
     // Limpa os dados salvos para o campo
     localStorage.removeItem(input.name);
 });
}

// Chama a função para limpar os dados quando o formulário é enviado com sucesso
// Substitua '#modal form' pelo seletor correto do seu formulário
document.querySelector('#modal form').addEventListener('submit', clearModalData);

document.querySelector('#modal form').addEventListener('submit', function(event) {
    // Prevenir o envio padrão do formulário
    event.preventDefault();

    // Aqui você pode adicionar qualquer lógica adicional antes de enviar o formulário
    // Por exemplo, salvar os dados do formulário usando AJAX

    // Enviar o formulário
    // Se você estiver usando AJAX para enviar os dados, você pode fazer isso aqui
    // Se não, você pode remover a linha abaixo
   
});