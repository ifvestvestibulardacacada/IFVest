// const { model } = require("./config");
// const { cacheManager } = require("./config");
// const { generationConfig, safetySettings } = require("./geminiIAutils");
// const { Questões } = require('../models');

// async function comparaPerguntasIAGemini() {
//     const todasPerguntas = await Questões.findAll(); // Recupera todas as perguntas do banco
//     const chat = inicializarChat();

// function inicializarChat(){
//     // Inicializando chat, passando as configurações de geração e segurança. 
//     try {
//         return model.startChat({
//             generationConfig,
//             safetySettings,
//             history: [],
//         });
//     } catch (error){
//         console.error("Erro ao inicializar o chat:", error.message || error);
//     }
// }

// function criarPrompt(grupoPerguntas){
//     // Criação do prompt concatenado
//     return `Seja curto e objetivo, compare as questões e responda para cada uma com apenas "A questão é semelhante a uma pergunta já existente" caso haja uma pergunta semelhante, mas perguntada de outra forma. Responda com apenas "Não há questão semelhante" caso não haja nenhuma questão semelhante. Por fim quero que você informe a numeração da questão que possua semelhança` +
//         grupoPerguntas.map((pergunta, index) => `${index + 1}. "${pergunta.pergunta}"`).join('\n'); // Cria uma string formatada para serem enviadas para IA.    método .map() é usado para iterar sobre cada pergunta no array e transformar cada elemento em um novo formato.     método .join('\n') pega o array resultante do .map() e o converte em uma única string
// }

//     // Armazenar os resultados
//     const resultados = [];

//     // Loop através de todas as perguntas do banco de dados em grupos de 5
//     for (let i = 0; i < todasPerguntas.length; i += 5) {
//         // try {
//             // Cria um grupo de 5 perguntas (ou menos, se não houver 5 restantes)
//             const grupoPerguntas = todasPerguntas.slice(i, i + 5);  // Formação de um subarray para armazenar no grupo de perguntas
//             const prompt = criarPrompt(grupoPerguntas); //Construção do prompt

//             const result = await chat.sendMessage(prompt); // Envia o prompt
//             const response = result.response.text(); // Obtém a resposta

        

//             // Exibe a resposta completa no console para debug
//             console.log(`Grupo de perguntas ${i / 5 + 1}:`, response);  // Formação da quantidade de grupos de perguntas

//             // Divide a resposta em partes, uma para cada pergunta no grupo
//             const respostas = response.split('\n').filter(r => r.trim() !== ''); // Formatação simples das strings

//             // Armazena o resultado da comparação
//             grupoPerguntas.forEach((pergunta, index) => {
//                 resultados.push({
//                     pergunta: pergunta.pergunta,    // Armazenar texto da pergunta
//                     resposta: respostas[index] || "Resposta não encontrada",    // Armazenar resposta correspondente a pergunta
//                 });
//             });
//         // }catch (error){
//         //     console.error(`Error ao carregar grupo de perguntas ${i / 5 + 1}:`, error.message || error);
//         //     }
//         }

//     // Retorna os resultados coletados
//     return { resultados };
    
// }

// module.exports.comparaPerguntasIAGemini = comparaPerguntasIAGemini;
