'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LatencyHourly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LatencyHourly.init({
    device_id: DataTypes.INTEGER,
    avg_latency: DataTypes.FLOAT,
    uptime_percent: DataTypes.FLOAT,
    hour: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'LatencyHourly',
  });
  return LatencyHourly;
};