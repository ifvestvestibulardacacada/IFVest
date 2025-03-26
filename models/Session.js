'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // define association here
    }
  }
  Session.init({
    sid: {
      type: DataTypes.STRING,
      primaryKey: true, // ✅ Chave primária única
      unique: true
    },
    sess: { // ✅ Nome exato exigido pelo middleware
      type: DataTypes.JSONB, // ✅ Tipo correto para dados da sessão
      allowNull: false
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: false // ✅ Desativa createdAt/updatedAt
  });
  return Session;
};