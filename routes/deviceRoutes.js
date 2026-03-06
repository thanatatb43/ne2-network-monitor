import express from "express"
import ping from "ping"
import Device from "../models/device.js"

const router = express.Router()

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
          status: response.alive ? "online" : "offline"
        }
      })
    )

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: "Ping failed" })
  }
})

// ดึงข้อมูลอุปกรณ์ทั้งหมด
router.get("/", async (req, res) => {
  try {
    const devices = await Device.findAll()
    res.json(devices)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch devices" })
  }
})

export default router