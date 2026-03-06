const { sequelize, LatencyLog, LatencyHourly } = require("../models");
const { Op } = require("sequelize");

const aggregateHourly = async () => {

    const now = new Date(Date.now());

    // ชั่วโมงปัจจุบัน เช่น 14:00
    const endHour = new Date(now);
    endHour.setMinutes(0, 0, 0);

    // ชั่วโมงก่อนหน้า เช่น 13:00
    const startHour = new Date(endHour);
    startHour.setHours(startHour.getHours() - 1);

    console.log(`Aggregating ${startHour} -> ${endHour}`);

    const results = await LatencyLog.findAll({
        attributes: [
            "device_id",
            [sequelize.fn("AVG", sequelize.fn("IFNULL", sequelize.col("latency"), 0)), "avg_latency"],
            [
                sequelize.literal(
                    "SUM(CASE WHEN status='online' THEN 1 ELSE 0 END) / COUNT(*) * 100"
                ),
                "uptime_percent"
            ]
        ],
        where: {
            createdAt: {
                [Op.gte]: startHour,
                [Op.lt]: endHour
            }
        },
        group: ["device_id"]
    });

    for (const row of results) {

        const exists = await LatencyHourly.findOne({
            where: {
                device_id: row.device_id,
                hour: startHour
            }
        });

        if (!exists) {
            await LatencyHourly.upsert({
                device_id: row.device_id,
                avg_latency: row.get("avg_latency"),
                uptime_percent: row.get("uptime_percent"),
                hour: startHour
            });
        }

    }

    // 🔥 ลบ raw log ทั้งหมด
    await LatencyLog.destroy({
        truncate: true
    });

    console.log("✅ Hourly aggregation complete");
};

module.exports = { aggregateHourly };