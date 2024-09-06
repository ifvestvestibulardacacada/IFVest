// const { model } = require("./config");
// const { cacheManager } = require("./config");
// const { generationConfig, safetySettings } = require("./geminiIAutils");
// const { Questões } = require('../models');

// async function comparaPerguntasIAGemini() {
//     // Recupera todas as perguntas do banco de dados
//     const todasPerguntas = await Questões.findAll();

//     // Chat é iniciado com o modelo importado, passando as configurações de geração e segurança. 
//     // O histórico de conversa é inicializado como um array vazio.
//     const chat = model.startChat({
//         generationConfig,
//         safetySettings,
//         history: [],
//     });

//     // Inicializa um array para armazenar os resultados
//     const resultados = [];

//     // Loop através de todas as perguntas do banco de dados em grupos de 5
//     for (let i = 0; i < todasPerguntas.length; i += 5) {
//         // Cria um grupo de 5 perguntas (ou menos, se não houver 5 restantes)
//         const grupoPerguntas = todasPerguntas.slice(i, i + 5);
        
//         // Constrói um prompt concatenando as 5 perguntas
//         const prompt = `Seja curto e objetivo, compare as questões e responda para cada uma com apenas "A questão é semelhante a uma pergunta já existente" caso haja uma pergunta semelhante, mas perguntada de outra forma. Responda com apenas "Não há questão semelhante" caso não haja nenhuma questão semelhante, nem perguntada de outra forma. Aqui estão as perguntas:\n\n` +
//             grupoPerguntas.map((pergunta, index) => `${index + 1}. "${pergunta.pergunta}"`).join('\n');

//         // Envia o prompt para a IA e obtém a resposta
//         const result = await chat.sendMessage(prompt);
//         const response = result.response.text();
//         console.log(`Grupo de Perguntas ${i / 5 + 1}:`, response);

//         // Divide a resposta em partes, uma para cada pergunta no grupo
//         const respostas = response.split('\n').filter(r => r.trim() !== '');

//         // Armazena o resultado da comparação
//         grupoPerguntas.forEach((pergunta, index) => {
//             resultados.push({
//                 pergunta: pergunta.pergunta,
//                 resposta: respostas[index] || "Resposta não encontrada",
//             });
//         });
//     }

//     // Retorna os resultados coletados
//     return { resultados };
// }

// module.exports.comparaPerguntasIAGemini = comparaPerguntasIAGemini;
