const express = require("express");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
const port = 3000;

app.use(cors());

const devicesRouter = require("./routes/devices");
const pingRouter = require("./routes/ping");
const latencyRouter = require("./routes/latencyLogs");

const { startPingMonitor } = require("./services/pingService");
const { aggregateHourly } = require("./services/aggregateService");

// ==========================
// START SERVICES
// ==========================

// ping ทุก 30 วิ
startPingMonitor();

// aggregate ทุกต้นชั่วโมง
cron.schedule("0 * * * *", async () => {
  console.log("Running hourly aggregation...");

  try {
    await aggregateHourly();
    console.log("Hourly aggregation complete");
  } catch (err) {
    console.error("Aggregation error:", err.message);
  }
});

// ==========================
// MIDDLEWARE
// ==========================

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/pages", express.static("pages"));

// ==========================
// ROUTES
// ==========================

app.use("/api/devices", devicesRouter);
app.use("/api/ping", pingRouter);
app.use("/api/latency", latencyRouter);

// ==========================
// SPA FALLBACK
// ==========================

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==========================
// START SERVER
// ==========================

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});