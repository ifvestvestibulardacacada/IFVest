// Função para adicionar itens ao dropdown
function addItemsToDropdown(Areas) {
    const areaSelect = document.getElementById('areaId');

    // Obter o valor selecionado da área
    const selectedAreaId = areaSelect.value;

    // Obter os tópicos correspondentes à área selecionada
    const selectedArea = Areas.find(area => area.id === parseInt(selectedAreaId));
    const topicos = selectedArea ? selectedArea.Topico : [];


    var dropdownList = document.getElementById('dropdown-list');
    dropdownList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

    topicos.forEach(function (topico) {
        var listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Ajuste o atributo name para enviar os valores como um array
        checkbox.name = 'topicosSelecionados[]';
        checkbox.value = topico.id; // Certifique-se de que o valor é o ID do tópico


        const label = document.createElement('label');
        label.htmlFor = 'topico-' + topico.id;
        label.textContent = topico.materia;

        checkbox.addEventListener('click', function () {
            updateSelectedTopics();
        });


        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        dropdownList.appendChild(listItem);
    });
}

function updateSelectedTopics() {
    var selectedTopics = document.querySelectorAll('#dropdown-list input[type="checkbox"]:checked');
    var selectedTopicIds = Array.from(selectedTopics).map(function (checkbox) {
        return checkbox.id.replace('item', '');
    });

    document.getElementById('topicosSelecionados').value = JSON.stringify(selectedTopicIds);
}
// Adiciona os itens ao dropdown
addItemsToDropdown(items);



