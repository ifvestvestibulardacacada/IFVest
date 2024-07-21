module.exports = (sequelize, DataTypes) => {
  const Topico = sequelize.define('Topico', {
    materia: DataTypes.STRING,
    areaId: DataTypes.INTEGER,
  }, {
    tableName: 'topicos'
  });

  Topico.associate = (models) => {
    Topico.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    Topico.belongsTo(models.Area,  
      {foreignKey: 'areaId'},);
    Topico.hasMany(models.Favorito)
    Topico.belongsToMany(models.Questões, { through: 'questoes_topicos', foreignKey: 'topicoId' });
    Topico.hasMany(models.Video);
  };



  return Topico;
};