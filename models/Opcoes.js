// models/Opcoes.js
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

class Opcao extends Model {
    static associate(models) {
        this.belongsTo(models.Questões, { foreignKey: 'questao_id', as: 'Questao' });
        this.hasMany(models.Resposta, { foreignKey: 'opcaoId', as: 'respostas' });
      }
}

Opcao.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    questao_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    correta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    alternativa: {
        type: DataTypes.ENUM({
            values: ['A', 'B', 'C', 'D', 'E']
       }),
      allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Opcao',
    tableName: 'opcoes', // Certifique-se de que este nome de tabela esteja correto
});

return Opcao;
}