'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addIndex(
      'latency_logs',
      ['device_id', 'createdAt'],
      {
        name: 'idx_latencylogs_device_createdAt'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex(
      'latency_logs',
      'idx_latencylogs_device_createdAt'
    );

  }
};