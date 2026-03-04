import axios from "axios"

const api = axios.create({
  baseURL: "/api"
})

export async function fetchDevices() {
  const res = await api.get("/devices")
  return res.data
}