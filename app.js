const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const cors = require("cors")

app.use(cors())

const devicesRouter = require("./routes/devices")
const pingRouter = require("./routes/ping");
const { startPingMonitor } = require("./services/pingService");
const { aggregateHourly } = require("./services/aggregateService");

startPingMonitor();
setInterval(() => {
    aggregateHourly();
}, 3600000); // 1 hour

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/pages", express.static("pages"));

app.use("/api/devices", devicesRouter)
app.use("/api/ping", pingRouter)

// ✅ Express 5 SPA fallback
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

