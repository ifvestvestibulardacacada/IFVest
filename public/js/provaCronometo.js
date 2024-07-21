// Variáveis globais para o cronômetro
let tempoTotal = 0;
let cronometroInterval;

// Função para formatar o tempo no formato "minutos:segundos"
function formatarTempo(tempo) {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

// Função para iniciar o cronômetro
function iniciarCronometro() {
    cronometroInterval = setInterval(function() {
        tempoTotal++;
        document.getElementById("cronometro").textContent = formatarTempo(tempoTotal);
    }, 1000); // 1000 milissegundos = 1 segundo
}

// Função para parar o cronômetro
function pararCronometro() {
    clearInterval(cronometroInterval);
}

// Inicie o cronômetro quando a página carregar
iniciarCronometro();