let chart
let chartInterval
let deviceDatasets = {}
const MAX_POINTS = 20

// ===============================
// INIT
// ===============================
async function initDashboard() {

  console.log("Dashboard init")

  const canvas = document.getElementById("latencyChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  createChart(ctx)

  // 🔥 รอรอบแรกให้เสร็จก่อน
  await updateDashboard()

  // แล้วค่อยเริ่ม interval
  chartInterval = setInterval(updateDashboard, 10000)
}

// ===============================
// CREATE CHART
// ===============================
function createChart(ctx) {

  const savedState = loadChartState()

  chart = new Chart(ctx, {
    type: "line",
    data: savedState || {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      animation: true,
      interaction: {
        mode: "nearest",
        intersect: false
      },
      plugins: {
        legend: { position: "top" }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Latency (ms)"
          }
        }
      }
    }
  })

  // rebuild dataset map
  chart.data.datasets.forEach(ds => {
    deviceDatasets[ds.label] = ds
  })
}

// ===============================
// FETCH DEVICES
// ===============================
async function fetchDevices() {
  const res = await fetch("/api/devices")
  return await res.json()
}

// ===============================
// PING DEVICE
// ===============================
async function pingDevice(ip) {
  try {
    const res = await fetch(`/api/ping?ip=${ip}`)
    const data = await res.json()
    return data.alive ? Number(data.latency) : null
  } catch {
    return null
  }
}

// ===============================
// MAIN UPDATE LOOP
// ===============================
async function updateDashboard() {

  if (!chart) return

  const devices = await fetchDevices()

  // 🔥 แสดงการ์ดก่อนเลย (ยังไม่รู้ online/offline)
  renderDeviceCards(devices, [])

  const now = new Date().toLocaleTimeString()

  if (chart.data.labels.length >= MAX_POINTS) {
    chart.data.labels.shift()
    chart.data.datasets.forEach(ds => ds.data.shift())
  }

  chart.data.labels.push(now)

  // 🔥 ยิง ping parallel
  const pingPromises = devices.map(async device => {

    const ip = device.gateway || device.wan_ip
    if (!ip) return null

    const name = device.pea_name || ip
    const latency = await pingDevice(ip)

    return { name, latency }
  })

  const pingResults = (await Promise.all(pingPromises)).filter(r => r !== null)

  // --- update chart ---
  pingResults.forEach(result => {

    const { name, latency } = result

    if (!deviceDatasets[name]) {

      const color = randomColor()

      const newDataset = {
        label: name,
        data: [],
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        fill: false
      }

      deviceDatasets[name] = newDataset
      chart.data.datasets.push(newDataset)
    }

    if (latency === null) {
      deviceDatasets[name].data.push(0)
      deviceDatasets[name].borderDash = [6, 6]
      deviceDatasets[name].borderColor = "#6c757d"
    } else {
      deviceDatasets[name].data.push(latency)
      deviceDatasets[name].borderDash = []
    }
  })

  chart.update()
  saveChartState()

  // 🔥 update การ์ดจริงหลัง ping เสร็จ
  renderDeviceCards(devices, pingResults)
}

// ===============================
// RENDER CARDS
// ===============================
function renderDeviceCards(devices, pingResults) {

  const container = document.getElementById("deviceList")
  if (!container) return

  container.innerHTML = ""

  let online = 0
  let offline = 0

  devices.forEach(device => {

    const ip = device.gateway || device.wan_ip
    if (!ip) return

    const name = device.pea_name || ip
    const result = pingResults.find(r => r.name === name)

    const latency = result ? result.latency : null
    const isOnline = latency !== null

    if (isOnline) online++
    else offline++

    const card = `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            ${name}
          </div>
          <div class="card-body text-center">
            <span class="badge ${isOnline ? 'bg-success' : 'bg-danger'}">
              ${isOnline ? 'Online' : 'Offline'}
            </span>
            <div class="mt-2">
              Latency: ${isOnline ? latency + ' ms' : '-'}
            </div>
          </div>
        </div>
      </div>
    `

    container.innerHTML += card
  })

  document.getElementById("totalCount").innerText = devices.length
  document.getElementById("onlineCount").innerText = online
  document.getElementById("offlineCount").innerText = offline
}

// ===============================
// UTILITIES
// ===============================
function randomColor() {
  return `hsl(${Math.random() * 360},70%,50%)`
}

function saveChartState() {
  if (!chart) return
  const state = {
    labels: chart.data.labels,
    datasets: chart.data.datasets
  }
  localStorage.setItem("latencyChartState", JSON.stringify(state))
}

function loadChartState() {
  const saved = localStorage.getItem("latencyChartState")
  if (!saved) return null
  return JSON.parse(saved)
}

function destroyDashboard() {
  if (chartInterval) clearInterval(chartInterval)
  if (chart) chart.destroy()
}