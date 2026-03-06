const express = require('express');
const { LatencyLog, Device, sequelize } = require('../models');

const router = express.Router();

// Get all latency logs with device relations
router.get('/', async (req, res) => {
    try {
        const latencyLogs = await LatencyLog.findAll({
            include: [
                {
                    model: Device,
                    as: 'device',
                    attributes: ['id', 'pea_name', 'gateway']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(latencyLogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/latest', async (req, res) => {

    const result = await LatencyLog.findOne({
        attributes: [
            [sequelize.fn("AVG", sequelize.col("latency")), "avg_latency"]
        ]
    });

    res.json({
        avg_latency: result.get("avg_latency") || 0
    });

});

// latency logs ของอุปกรณ์หนึ่งๆ
router.get('/device/:deviceId', async (req, res) => {

    try {
        const latencyLogs = await LatencyLog.findAll({
            where: { device_id: req.params.deviceId },
            include: [
                {
                    model: Device,
                    as: 'device',
                    attributes: ['id', 'pea_name', 'gateway']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        res.status(200).json(latencyLogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get latency log by ID with device relation
router.get('/:id', async (req, res) => {
    try {
        const latencyLog = await LatencyLog.findByPk(req.params.id, {
            include: [
                {
                    model: Device,
                    as: 'device',
                    attributes: ['id', 'pea_name', 'gateway']
                }
            ]
        });

        if (!latencyLog) {
            return res.status(404).json({ error: 'Latency log not found' });
        }

        res.status(200).json(latencyLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;