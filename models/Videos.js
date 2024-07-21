module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define('Video', {
      materia: DataTypes.STRING,
    }, {
      tableName: 'videos'
    });
  
    Video.associate = (models) => {
        Video.belongsTo(models.Topico,
          {foreignKey: 'topicoId'},
          );
    };
  
    return Video;
  };