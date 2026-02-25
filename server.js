const express = require("express");
const app = express();
const PORT = 3000;

const pingRoute = require("./routes/ping");

app.use(express.json());
app.use(express.static("public"));

app.use("/api/ping", pingRoute);

// ===== Devices API =====
let devices = [];

app.get("/api/devices", (req, res) => {
  res.json(devices);
});

app.post("/api/devices", (req, res) => {
  const newDevice = {
    id: Date.now(),
    name: req.body.name,
    wanGateway: req.body.wanGateway || ""
  };

  devices.push(newDevice);
  res.json(newDevice);
});

app.delete("/api/devices/:id", (req, res) => {
  devices = devices.filter(d => d.id != req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});