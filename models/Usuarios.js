module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      usuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email_secundario:{
        type: DataTypes.STRING,
        allowNull: true,
      } ,
     
      perfil: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      imagemPerfil:{
        type: DataTypes.STRING,
        allwNull: true,
      },
    },{
      tableName: 'usuarios'
    });
  
    Usuario.associate = (models) => {
      // Associação com Comentario
      Usuario.hasMany(models.Comentario, {
        foreignKey: 'usuarioId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
  
      // Associação com AreaProf
      Usuario.hasMany(models.AreaProf, {
        foreignKey: 'usuarioId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
  
      // Associação com Favorito
      Usuario.hasMany(models.Favorito, {
        foreignKey: 'usuarioId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
  
      // Associação com Perguntas
      Usuario.hasMany(models.Questões, {
        foreignKey: 'usuarioId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
  
      // Associação com Respostas
      Usuario.hasMany(models.Resposta, {
        foreignKey: 'usuarioId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  
    return Usuario;
  };
  