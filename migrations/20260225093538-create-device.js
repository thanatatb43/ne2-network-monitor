'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: Sequelize.STRING,
      pea_name: Sequelize.STRING,
      province: Sequelize.STRING,
      gateway: Sequelize.STRING,
      wan_gateway: Sequelize.STRING,
      wan_ip: Sequelize.STRING,
      vpn_main: Sequelize.STRING,
      vpn_backup: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Devices');
  }
};