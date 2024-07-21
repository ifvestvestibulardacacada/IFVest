module.exports = (sequelize, DataTypes)=>{
    const AreaProf = sequelize.define('AreaProf',{
            usuarioId: DataTypes.INTEGER,
            areaId: DataTypes.INTEGER
        }, {
            tableName: 'areaprof'
        });
    
        //belongsTo
        //belongsToMany
        //hasOne
        //hasMany
        AreaProf.associate = (models)=>{
            AreaProf.belongsTo(models.Usuario, 
            {foreignKey: 'usuarioId'})
        }
        AreaProf.associate = (models)=>{
            AreaProf.belongsTo(models.Area, 
            {foreignKey: 'areaId'})
        }
    
        return AreaProf;
    }