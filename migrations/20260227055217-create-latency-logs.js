'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('latency_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      device_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'devices',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      latency: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: { type: Sequelize.STRING },   // up / down
      packetLoss: { type: Sequelize.FLOAT },   // percentage of packet loss
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('latency_logs', ['device_id', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('latency_logs');
  }
};