module.exports = (sequelize, DataTypes)=>{
    const Noticia = sequelize.define('Noticia',{
            usuarioId: DataTypes.INTEGER,
            titulo: DataTypes.STRING,
            sub_titulo: DataTypes.STRING,
            resumo: DataTypes.STRING,
            links: DataTypes.STRING,
        }, {
            tableName: 'noticias'
        }
    );
    

        Noticia.associate = (models)=>{
            Noticia.belongsTo(models.Usuario, 
            {foreignKey: 'usuarioId'})
        }
    
        return Noticia;
    }