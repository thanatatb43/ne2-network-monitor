const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// เสิร์ฟไฟล์ใน public
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const pingRoute = require('./routes/ping')
app.use('/api/ping', pingRoute)