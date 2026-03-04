const express = require('express');
const router = express.Router();
const { LatencyLog, Device } = require('../models');
const { Op } = require('sequelize');

router.get('/latency/history', async (req, res) => {
  try {
    const devices = await Device.findAll();

    const result = {};

    for (const device of devices) {
      const logs = await LatencyLog.findAll({
        where: { device_id: device.id },
        order: [['createdAt', 'DESC']],
        limit: 30
      });

      result[device.name] = logs.reverse(); 
      // reverse เพื่อเรียงจากเก่า → ใหม่
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;