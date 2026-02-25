document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if the devices page elements exist
  if (document.getElementById("deviceContainer")) {
    loadDevices();

    const form = document.getElementById("addDeviceForm");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        await fetch("/api/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        this.reset();
        loadDevices();
      });
    }
  }
});

async function loadDevices() {
  const res = await fetch("/api/devices");
  const devices = await res.json();

  const container = document.getElementById("deviceContainer");
  if (!container) return;
  container.innerHTML = "";

  devices.forEach(device => {
    container.innerHTML += createDeviceCard(device);
  });
}

function createDeviceCard(device) {
  return `
    <div class="col-md-4 mb-3">
      <div class="card card-primary">
        <div class="card-header d-flex justify-content-between">
          <h3 class="card-title">${device.name}</h3>
          <button onclick="deleteDevice(${device.id})" class="btn btn-sm btn-danger">X</button>
        </div>
        <div class="card-body">
          <p><b>ประเภท:</b> ${device.type}</p>
          <p><b>จังหวัด:</b> ${device.province}</p>

          ${device.wanGateway ? `<p><b>WAN Gateway:</b> ${device.wanGateway}</p>` : ""}
          ${device.wanIP ? `<p><b>WAN IP:</b> ${device.wanIP}</p>` : ""}
          ${device.vpnMain ? `<p><b>VPN MAIN:</b> ${device.vpnMain}</p>` : ""}
          ${device.vpnBackup ? `<p><b>VPN BACKUP:</b> ${device.vpnBackup}</p>` : ""}
          ${device.gateway ? `<p><b>Gateway:</b> ${device.gateway}</p>` : ""}
        </div>
      </div>
    </div>
  `;
}

async function deleteDevice(id) {
  await fetch(`/api/devices/${id}`, { method: "DELETE" });
  loadDevices();
}
