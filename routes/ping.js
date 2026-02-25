const express = require("express");
const router = express.Router();
const ping = require("ping");

router.get("/", async (req, res) => {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: "IP required" });
  }

  try {
    const result = await ping.promise.probe(ip);

    res.json({
      alive: result.alive,
      latency: result.time || 0
    });

  } catch (err) {
    res.status(500).json({ error: "Ping failed" });
  }
});

module.exports = router;