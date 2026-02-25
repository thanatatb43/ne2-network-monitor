const container = document.getElementById("monitorContainer");

let devices = [];

// ==========================
// โหลดรายการ Device
// ==========================
async function loadDevices() {
  try {
    const res = await fetch("/api/devices");
    devices = await res.json();

    renderCards();
    startMonitoring();

  } catch (err) {
    console.error("โหลด device ไม่สำเร็จ", err);
  }
}

// ==========================
// สร้าง Card
// ==========================
function renderCards() {
  container.innerHTML = "";

  devices.forEach(device => {

    const card = `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            ${device.name}
          </div>

          <div class="card-body text-center">

            <!-- Loader -->
            <div class="spinner-border text-primary" 
                 id="loader-${device.id}" 
                 role="status">
            </div>

            <!-- Status -->
            <div id="status-${device.id}" style="display:none;">
              <h5>
                <span id="badge-${device.id}" 
                      class="badge badge-secondary">
                  Checking...
                </span>
              </h5>
              <p>Latency: <span id="latency-${device.id}">-</span> ms</p>
            </div>

          </div>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });
}

// ==========================
// เช็คสถานะอุปกรณ์
// ==========================
async function checkDevice(device) {

  const loader = document.getElementById(`loader-${device.id}`);
  const statusBox = document.getElementById(`status-${device.id}`);
  const badge = document.getElementById(`badge-${device.id}`);
  const latencyText = document.getElementById(`latency-${device.id}`);

  loader.style.display = "inline-block";
  statusBox.style.display = "none";

  try {
    const res = await fetch(`/api/ping?ip=${device.wanGateway}`);
    const data = await res.json();

    badge.className = "badge badge-success";
    badge.innerText = "Online";
    latencyText.innerText = data.latency;

  } catch (err) {

    badge.className = "badge badge-danger";
    badge.innerText = "Offline";
    latencyText.innerText = "-";

  }

  loader.style.display = "none";
  statusBox.style.display = "block";
}

// ==========================
// เริ่ม Monitor ทุก 10 วิ
// ==========================
function startMonitoring() {

  // เช็คครั้งแรก
  devices.forEach(device => checkDevice(device));

  // เช็คทุก 10 วิ
  setInterval(() => {
    devices.forEach(device => checkDevice(device));
  }, 10000);
}


// ==========================
// เริ่มทำงาน
// ==========================
loadDevices();