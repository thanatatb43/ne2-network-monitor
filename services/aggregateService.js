const { sequelize, LatencyLog, LatencyHourly } = require("../models");
const { Op } = require("sequelize");

const aggregateHourly = async () => {

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const results = await LatencyLog.findAll({
        attributes: [
            "device_id",
            [sequelize.fn("AVG", sequelize.col("latency")), "avg_latency"],
            [
                sequelize.literal(
                    "SUM(CASE WHEN status='online' THEN 1 ELSE 0 END) / COUNT(*) * 100"
                ),
                "uptime_percent"
            ]
        ],
        where: {
            createdAt: {
                [Op.gte]: oneHourAgo
            }
        },
        group: ["device_id"]
    });

    for (const row of results) {

        await LatencyHourly.create({
            device_id: row.device_id,
            avg_latency: row.get("avg_latency"),
            uptime_percent: row.get("uptime_percent"),
            hour: new Date()
        });

    }

    // ลบ raw log
    await LatencyLog.destroy({
        where: {
            createdAt: {
                [Op.lte]: oneHourAgo
            }
        }
    });

    console.log("Hourly aggregation complete");
};

module.exports = { aggregateHourly };