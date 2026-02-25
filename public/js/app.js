const deviceList = ["8.8.8.8", "1.1.1.1"]; // ใส่ IP ที่ต้องการ

async function loadPing() {
  const container = document.getElementById("deviceContainer");

  // เคลียร์ก่อน
  container.innerHTML = "";

  // 1️⃣ สร้าง card พร้อม spinner ก่อน
  deviceList.forEach(ip => {
    const card = `
      <div class="col-md-4 mb-3" id="card-${ip}">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary">
            <h3 class="card-title">Ping ${ip}</h3>
          </div>
          <div class="card-body text-center">
            <div class="spinner-border text-primary" role="status"></div>
            <div class="mt-2 text-muted">Checking...</div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });

  try {
    const res = await fetch("/api/ping");
    const devices = await res.json();

    // 2️⃣ อัปเดตแต่ละ card เมื่อข้อมูลมา
    devices.forEach(device => {
      const statusClass =
        device.status === "online" ? "bg-success" : "bg-danger";

      const badgeClass =
        device.status === "online" ? "bg-success" : "bg-danger";

      const card = document.getElementById(`card-${device.ip}`);

      if (card) {
        card.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-header ${statusClass}">
              <h3 class="card-title">Ping ${device.ip}</h3>
            </div>
            <div class="card-body">
              <p>Status:
                <span class="badge ${badgeClass}">
                  ${device.status}
                </span>
              </p>
              <p>Latency: ${device.latency} ms</p>
              <p>Packet Loss: ${device.loss}%</p>
            </div>
          </div>
        `;
      }
    });

  } catch (err) {
    console.error("Error loading ping data:", err);
  }
}

// โหลดครั้งแรก
loadPing();

// รีเฟรชทุก 10 วินาที
setInterval(loadPing, 10000);