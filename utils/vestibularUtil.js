const { Vestibular } = require('../models');

async function criarOuAtualizarVestibular(vestibularId, novoVestibular, anoVestibular) {
  try {
    let vestibular = null;

    // Tenta encontrar o vestibular existente
    if (vestibularId && vestibularId !== "outro") {
      vestibular = await Vestibular.findOne({
        where: { id: vestibularId },
      });
    }

    // Se não encontrar um vestibular ou se precisar atualizar, cria um novo
    if (!vestibular && novoVestibular ) {
      vestibular = await Vestibular.create({
        nome: novoVestibular,
        ano: anoVestibular,
      });
    }else{
      if(vestibular.ano && (vestibular.ano.toString() !== anoVestibular.toString())){
        // Atualiza o vestibular existente
        vestibular = await Vestibular.create({
          nome: vestibular.nome,
          ano: anoVestibular,
        });
      }
    }
   

    return vestibular;
  } catch (error) {
    console.error("Erro ao criar ou atualizar vestibular:", error);
    throw error;
  }
}

  
  module.exports = {
    criarOuAtualizarVestibular
  };