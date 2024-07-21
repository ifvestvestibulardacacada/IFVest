// Funções de utilidade da IA gemini
const {
    HarmCategory,
    HarmBlockThreshold,
   } = require("@google/generative-ai");
   
   //Configurações para os gastos no uso da IA
   const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
   };
   
   //Como o modelo deve lidar com diferentes categorias de conteúdo prejudicial
   const safetySettings = [
    {
       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
   ];
   
   module.exports = { generationConfig, safetySettings };