const { Vestibular } = require('../models');

async function criarOuAtualizarVestibular(vestibularId, novoVestibular, anoVestibular) {

    let vestibular = null;
  
    if (vestibularId && vestibularId!== "outro") {
      vestibular = await Vestibular.findOne({
        where: {
          id: vestibularId,
        }
      });
    }
  
    if (vestibular && (vestibular.ano!== anoVestibular) && anoVestibular !== 0 || novoVestibular ) {

      vestibular = await Vestibular.create({
        nome: novoVestibular || vestibular.nome, // Mantém o nome se vestibularId for fornecido
        ano: anoVestibular,
      });
    }
  
    if (!vestibular) {
      return { id: null };
    }
    return vestibular;
  }
  
  module.exports = {
    criarOuAtualizarVestibular
  };