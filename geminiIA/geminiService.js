const { model } = require("../geminiIA/config");
const { generationConfig, safetySettings } = require("../utils/geminiIAutils");
const { Questões } = require('../models');

async function comparaPerguntasIAGemini() {
   // Recupera todas as perguntas do banco de dados
   const todasPerguntas = await Questões.findAll();

//Chat é iniciado com o modelo importado, passando as configurações de geração e segurança. O histórico de conversa é inicializado como um array vazio.
    const chat = model.startChat({
       generationConfig,
       safetySettings,
       history: [],
    });
   
    // Inicializa um array para armazenar os resultados
    const resultados = [];

    // Loop através de todas as perguntas do banco de dados
    for (let pergunta of todasPerguntas) {
      // Constrói o prompt para a comparação
      const prompt = `Seja curto e objetivo, compare as questões e responda com apenas "A questão é semelhante a uma pergunta já existente" caso aja uma pergunta
      semelhante, mas perguntada de outra forma, responda com apenas "Não a questão semelhante" caso não aja nenhuma questão
      semelhante, nem perguntada de outra forma. "${pergunta.pergunta}"`;
      // Envia o prompt para a IA e obtém a resposta
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      console.log(`Questão: "${pergunta.pergunta}":`, response.text());

       // Armazena o resultado da comparação
       resultados.push({
         pergunta: pergunta.pergunta,
         resposta: response.text(),
     });

      // Aqui você pode adicionar lógica para determinar se a nova pergunta é semelhante a alguma das existentes
      // Por exemplo, você pode definir um limite de similaridade acima do qual considera que a pergunta é duplicada
  }
  // Retorna os resultados coletados
  return { resultados };

}

module.exports.comparaPerguntasIAGemini = comparaPerguntasIAGemini;