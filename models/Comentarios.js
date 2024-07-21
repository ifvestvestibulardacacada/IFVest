module.exports = (sequelize, DataTypes)=>{
    const Comentario = sequelize.define('Comentario',{
            usuarioId: DataTypes.INTEGER,
            comentario: DataTypes.STRING 
        }, {
            tableName: 'comentarios'
        });
    
        //belongsTo
        //belongsToMany
        //hasOne
        //hasMany
        Comentario.associate = (models)=>{
            Comentario.belongsTo(models.Usuario, 
            {foreignKey: 'usuarioId'})
        }
    
        return Comentario;
    }