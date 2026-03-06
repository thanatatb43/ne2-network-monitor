'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addConstraint('latencyhourlies', {
      fields: ['device_id', 'hour'],
      type: 'unique',
      name: 'unique_device_hour'
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint(
      'latencyhourlies',
      'unique_device_hour'
    );

  }
};