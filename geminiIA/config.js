// configurações da IA gemini
const dotenv = require("dotenv");       
const { GoogleGenerativeAI } = require("@google/generative-ai");    //interface para interagir com os modelos de IA generativa do Google.
const { GoogleAICacheManager } = require('@google/generative-ai/server');

//Carrega o arquivo .env
dotenv.config();    

//Escolher qual modelo sera usado do gemini
const MODEL_NAME = "gemini-1.5-pro-latest"; 

//Chave no .env
//Libera o acesso a IA
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Configuração do gerenciador de cache
const cacheManager = new GoogleAICacheManager(process.env.API_KEY);  

const model = genAI.getGenerativeModel({ model: MODEL_NAME });

module.exports = { model, cacheManager};