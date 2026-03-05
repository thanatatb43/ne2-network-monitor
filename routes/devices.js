const express = require('express')
const router = express.Router()
const { Device } = require('../models')
const ping = require('ping')

/* =========================
   GET ALL DEVICES
========================= */
router.get("/", async (req, res) => {
  try {
    const devices = await Device.findAll({
      order: [['id', 'DESC']]
    })
    res.json(devices)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/status", async (req, res) => {
  try {
    const devices = await Device.findAll()

    const results = await Promise.all(
      devices.map(async (device) => {
        const response = await ping.promise.probe(device.wan_ip)

        return {
          id: device.id,
          name: device.pea_name,
          ip: device.wan_ip,
          status: response.alive ? "online" : "offline",
          time: response.time
        }
      })
    )

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: "Ping failed" })
  }
})

/* =========================
   GET SINGLE DEVICE
========================= */
router.get("/:id", async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id)

    if (!device) {
      return res.status(404).json({ message: "Device not found" })
    }

    res.json(device)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =========================
   CREATE DEVICE
========================= */
router.post("/", async (req, res) => {
  try {
    const device = await Device.create(req.body)
    res.status(201).json(device)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =========================
   UPDATE DEVICE
========================= */
router.put("/:id", async (req, res) => {
  try {
    await Device.update(req.body, {
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* =========================
   DELETE DEVICE
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Device.destroy({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router