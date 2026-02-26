const ctx = document.getElementById('latencyChart').getContext('2d')

const MAX_POINTS = 20   // เก็บย้อนหลัง 20 จุด (10 วิ x 20 = 200 วิ)
let deviceDatasets = {}
let chart

async function fetchDevices() {
    const res = await fetch('/api/devices')
    return await res.json()
}

async function pingDevice(ip) {
    try {
        const res = await fetch(`/api/ping?ip=${ip}`)
        const data = await res.json()
        return data.alive ? Number(data.latency) : null
    } catch {
        return null
    }
}

function createChart() {

    const savedState = loadChartState()

    chart = new Chart(ctx, {
        type: 'line',
        data: savedState || {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            animation: true,
            interaction: {
                mode: 'nearest',
                intersect: false
            },
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Latency (ms)'
                    }
                }
            }
        }
    })

    // rebuild deviceDatasets map
    chart.data.datasets.forEach(ds => {
        deviceDatasets[ds.label] = ds
    })
}

async function updateChart() {

    const devices = await fetchDevices()
    const now = new Date().toLocaleTimeString()

    if (chart.data.labels.length >= MAX_POINTS) {
        chart.data.labels.shift()
        chart.data.datasets.forEach(ds => ds.data.shift())
    }

    chart.data.labels.push(now)

    for (const device of devices) {

        const ip = device.gateway || device.wan_ip
        if (!ip) continue

        const name = device.pea_name || ip
        const latency = await pingDevice(ip)

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
            deviceDatasets[name].borderColor = '#6c757d'

        } else {

            deviceDatasets[name].data.push(latency)
            deviceDatasets[name].borderDash = []
        }
    }

    chart.update()
}

function randomColor() {
    return `hsl(${Math.random() * 360},70%,50%)`
}

function saveChartState() {
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

createChart()
updateChart()
chart.update()
saveChartState()
setInterval(updateChart, 10000)