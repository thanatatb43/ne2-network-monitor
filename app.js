const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const devicesRouter = require("./routes/devices")
const pingRouter = require("./routes/ping");

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