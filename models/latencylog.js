'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LatencyLog extends Model {
    static associate(models) {
      // a log belongs to a device
      LatencyLog.belongsTo(models.Device, {
        foreignKey: 'device_id'
      });
    }
  }
  LatencyLog.init({
    device_id: DataTypes.INTEGER,
    latency: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: DataTypes.STRING,
    packetLoss: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'LatencyLog',
    tableName: 'latency_logs'
  });
  return LatencyLog;
};