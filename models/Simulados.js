'use strict';

module.exports = (sequelize, DataTypes) => {
  const Simulados = sequelize.define('Simulados', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'simulados'
  });

  Simulados.associate = (models) => {
    // Associação com o modelo Usuario
    Simulados.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    
    Simulados.hasMany(models.Resposta, {
      foreignKey: 'provaId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // Associação com o modelo PerguntasProvas (um questionário tem várias perguntas)
    Simulados.belongsToMany(models.Questões, { through: 'perguntas_provas', foreignKey: 'provaId' });

  };
  

  return Simulados;
};
