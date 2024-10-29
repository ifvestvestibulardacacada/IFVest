module.exports = (sequelize, DataTypes) => {
    const Questões = sequelize.define('Questões', {
      pergunta: DataTypes.TEXT,
      titulo: DataTypes.TEXT,
      tipo: DataTypes.ENUM({
        values: ['DISSERTATIVA', 'OBJETIVA'],
        allowNull: false
      })
    }, {
      tableName: 'questoes'
    });
  
    Questões.associate = (models) => {
      Questões.belongsToMany(models.Topico, { through: 'questoes_topicos', foreignKey: 'questaoId' });
      Questões.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Questões.belongsToMany(models.Simulados, { through: 'perguntas_provas', foreignKey: 'QuestõesId' });
      Questões.hasMany(models.Opcao, { foreignKey: 'questao_id', as: 'Opcoes' });
      Questões.hasMany(models.Resposta, { foreignKey: 'questaoId', as: 'Respostas' });
       Questões.belongsTo(models.Area, {
        foreignKey: 'areaId',
        as: 'Area'
      });
    };     
    return Questões;
  };
  