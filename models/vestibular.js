const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Vestibular extends Model {
    static associate(models) {
        this.hasMany(models.Questões, { foreignKey: 'vestibularId', as: 'questoes' });
    }
} 

Vestibular.init({
 id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
 },
 nome: {
    type: DataTypes.STRING,
    allowNull: false,
 },
 ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
 },
}, {
 sequelize,
 modelName: 'Vestibular',
 tableName: 'vestibular', 
});

return Vestibular;
}