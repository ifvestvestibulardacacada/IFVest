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
  