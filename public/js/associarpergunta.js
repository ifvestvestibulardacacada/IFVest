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