const fs = require('fs');
const path = require('path'); // Importa o módulo path para manipulação de caminhos

function removeFileFromUploads(uploadPath) {
    // Extrai o nome do arquivo da string fornecida
    const fileName = path.basename(uploadPath);

    // Constrói o caminho completo para o arquivo dentro da pasta 'uploads'
    const filePath = path.join(__dirname, '../uploads', fileName);

    try {
        fs.unlinkSync(filePath); // Usa unlinkSync para remover o arquivo
        console.log(`Arquivo ${filePath} removido com sucesso.`);
    } catch (error) {
        console.error(`Erro ao remover o arquivo ${filePath}:`, error);
    }
}

module.exports = { removeFileFromUploads };
