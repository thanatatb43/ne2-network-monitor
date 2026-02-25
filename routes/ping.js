const express = require("express");
const ping = require("ping");
const router = express.Router();

const devices = ["8.8.8.8", "1.1.1.1"];

router.get("/", async (req, res) => {
  const results = [];

  for (let ip of devices) {
    const result = await ping.promise.probe(ip);

    results.push({
      ip,
      status: result.alive ? "online" : "offline",
      latency: result.time,
      loss: result.packetLoss || 0
    });
  }

  res.json(results);
});

module.exports = router;