import { useEffect, useState } from "react"
import api from "../services/api"
import "./Dashboard.css"

function Dashboard() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const onlineCount = devices.filter(d => d.status === "online").length
const offlineCount = devices.filter(d => d.status === "offline").length
const sortedDevices = [...devices].sort((a, b) =>
  a.status === "online" && b.status === "offline" ? -1 : 1
)

  useEffect(() => {
  const loadStatus = async () => {
    try {
      const res = await api.get("/devices/status")
      setDevices(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  loadStatus()
  const interval = setInterval(loadStatus, 10000)

  return () => clearInterval(interval)
}, [])

  if (loading) return <p>Loading dashboard...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
  <div className="dashboard">
    <h2>Dashboard</h2>

    {/* ✅ ย้าย summary ออกมา */}
    <div className="summary">
      <div className="summary-card online">
        Online: {onlineCount}
      </div>
      <div className="summary-card offline">
        Offline: {offlineCount}
      </div>
      <div className="summary-card total">
        Total: {devices.length}
      </div>
    </div>

    <div className="card-container">
      {sortedDevices.map((device) => (
        <div
          key={device.id}
          className={`card ${
            device.status === "online" ? "online" : "offline"
          }`}
        >
          <h3>
  <span className={`dot ${device.status}`}></span>
  {device.name}
</h3>
          <p>{device.ip}</p>
          <span>{device.status.toUpperCase()}</span>
          <p>Response: {device.time} ms</p>
        </div>
      ))}
    </div>
  </div>
)
}

export default Dashboard