module.exports = (sequelize, DataTypes) => {
    const Favorito = sequelize.define('Favorito', {
      // Colunas do modelo Favorito, se houver
    }, {
      tableName: 'favoritos'
    });
  
    Favorito.associate = (models) => {
      Favorito.belongsTo(models.Usuario,
        {foreignKey: 'usuarioId'});
      Favorito.belongsTo(models.Topico,
        {foreignKey: 'topicoId'});
    };
  
    return Favorito;
  };