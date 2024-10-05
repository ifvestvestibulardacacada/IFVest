document.addEventListener('DOMContentLoaded', function () {
    const btnGenerate = document.querySelector("#generate-pdf");

    if (btnGenerate) {
        btnGenerate.addEventListener("click", () => {
            console.log("Botão de gerar PDF clicado!");

            // Captura o formulário de simulado pelo ID
            const impressao = document.querySelector("#questionario");

            if (impressao) {
                // Opcional: Remover o botão de envio do formulário (se estiver presente)
                const submitButton = document.querySelector("button[type=submit]");
                if (submitButton) {
                    submitButton.style.display = 'none'; // Esconde o botão de envio
                }

                // Define as opções para gerar o PDF
                const design = {
                    margin: [10, 10, 10, 10],
                    filename: "IFVEST_simulado.pdf",
                    html2canvas: { scale: 2 }, // Melhorar a resolução do PDF
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                };

                // Gera o PDF a partir do formulário capturado
                html2pdf().set(design).from(impressao).save().then(() => {
                    // Opcional: Restaurar o botão de envio após o PDF ser gerado
                    if (submitButton) {
                        submitButton.style.display = ''; // Mostra o botão novamente
                    }
                });
            } else {
                console.error("Formulário #questionario não encontrado");
            }
        });
    } else {
        console.error("Botão #generate-pdf não encontrado");
    }
});
