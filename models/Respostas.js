const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resposta extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
      this.belongsTo(models.Simulados, { foreignKey: 'simuladoId', as: 'simulado' });
      this.belongsTo(models.Questões, { foreignKey: 'questaoId', as: 'questoes' });
      this.belongsTo(models.Opcao, { foreignKey: 'opcaoId', as: 'opcao' }); 
    }
  }

  Resposta.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    resposta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: DataTypes.ENUM({
      values: ['DISSERTATIVA', 'OBJETIVA'],
      allowNull: false
    }),
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    simuladoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Resposta',
    tableName: 'resposta'
  });

  return Resposta;
};
