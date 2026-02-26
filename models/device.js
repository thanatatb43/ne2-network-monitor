'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Device.init({
    type: DataTypes.STRING,
    pea_name: DataTypes.STRING,
    province: DataTypes.STRING,
    gateway: DataTypes.STRING,
    wan_gateway: DataTypes.STRING,
    wan_ip: DataTypes.STRING,
    vpn_main: DataTypes.STRING,
    vpn_backup: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};