const ping = require("ping");
const { Device, LatencyLog } = require("../models");

const startPingMonitor = () => {
    setInterval(async () => {

        console.log("Running ping monitor...");

        try {

            const devices = await Device.findAll();

            await Promise.all(
                devices.map(async (device) => {

                    try {

                        if (!device.gateway) {

                            await LatencyLog.create({
                                device_id: device.id,
                                latency: null,
                                status: "error",
                                packetLoss: 100
                            });

                            return;
                        }

                        const result = await ping.promise.probe(device.gateway, {
                            timeout: 2
                        });

                        const isAlive = result.alive === true;

                        await LatencyLog.create({
                            device_id: device.id,
                            latency: isAlive ? parseFloat(result.time) : null,
                            status: isAlive ? "online" : "offline",
                            packetLoss: result.packetLoss
                                ? parseFloat(result.packetLoss)
                                : (isAlive ? 0 : 100)
                        });

                        await Device.update(
                            {
                                status: isAlive ? "online" : "offline",
                                lastChecked: new Date()
                            },
                            {
                                where: { id: device.id }
                            }
                        );

                    } catch (deviceError) {

                        console.error(`Device ${device.id} ping error:`, deviceError.message);

                        await LatencyLog.create({
                            device_id: device.id,
                            latency: null,
                            status: "error",
                            packetLoss: 100
                        });

                        await Device.update(
                            {
                                status: "error",
                                lastChecked: new Date()
                            },
                            {
                                where: { id: device.id }
                            }
                        );

                    }

                })
            );

            console.log("✅ Ping cycle complete");

        } catch (err) {

            console.error("Ping monitor error:", err.message);

        }

    }, 60000); // 60 sec
};

module.exports = { startPingMonitor };