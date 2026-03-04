const cron = require('node-cron');
const ping = require('ping');
const { Device, LatencyLog } = require('../models');

cron.schedule('* * * * *', async () => {
  console.log('Running network monitor...');

  const devices = await Device.findAll();

  for (const device of devices) {
    try {
      const res = await ping.promise.probe(device.wan_ip);

      const latency = res.time === 'unknown' ? 0 : parseFloat(res.time);
      const status = res.alive ? 'up' : 'down';
      const packetLoss = res.packetLoss || 0;

      await LatencyLog.create({
        device_id: device.id,
        latency,
        status,
        packetLoss
      });

      console.log(`${device.name} → ${status} (${latency} ms)`);
    } catch (err) {
      console.error('Ping error:', err.message);
    }
  }
});