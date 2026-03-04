import { useEffect, useState } from "react"
import { fetchDevices } from "../services/api"

export default function Dashboard() {

  const [devices, setDevices] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await fetchDevices()
      setDevices(data)
    } catch (err) {
      console.error("API Error:", err)
    }
  }

  return (
    <div>
      <h2>Dashboard Page</h2>

      <ul>
        {devices.map((d, index) => (
          <li key={index}>
            {d.pea_name || d.name || JSON.stringify(d)}
          </li>
        ))}
      </ul>

    </div>
  )
}