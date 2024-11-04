function enviarFormulario() {
    // Coletar os valores dos inputs
    var titulo = document.getElementById('tituloEdicao').value;
    var descricao = document.getElementById('descricaoEdicao').value;
    var id = document.getElementById('botaoSalvar').getAttribute('data-id'); // Coletar o ID do Simulado

    // Criar um objeto com os dados a serem enviados
    var data = {
     // Incluir o ID do Simulado nos dados enviados
        titulo: titulo,
        descricao: descricao
    };
    console.log(data)
    // Enviar os dados para a URL especificada
    fetch(`http://localhost:3000/simulados/${id}/editar`, { // Use o ID do Simulado na URL
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
    .then(response => response.json()) // Converte a resposta em JSON
    .then(data => {
        console.log(data); // Aqui você pode manipular os dados recebidos do servidor

        document.getElementById('tituloVisualizacao').textContent = data.titulo;
        document.getElementById('descricaoVisualizacao').textContent = data.descricao;
    })
    .catch(error => {
        console.error('Erro ao enviar o formulário:', error);
    });
}