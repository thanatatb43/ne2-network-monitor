const routes = {
  dashboard: {
    path: "/pages/dashboard.html",
    init: () => {
      if (typeof initDashboard === "function") {
        initDashboard();
      }
    }
  },
  devices: {
    path: "/pages/devices.html",
    init: () => {
      if (typeof initDevices === "function") {
        initDevices();
      }
    }
  }
};

async function navigate(page, addToHistory = true) {
  if (!routes[page]) return;

  const container = document.getElementById("app");

  if (!container) {
    console.error("Container #app not found");
    return;
  }

  try {
    const response = await fetch(routes[page].path);

    if (!response.ok) {
      container.innerHTML = `
        <div class="alert alert-danger">
          ไม่สามารถโหลดหน้า ${page} ได้
        </div>`;
      return;
    }

    const html = await response.text();

    // Inject HTML
    container.innerHTML = html;

    // ✅ รอให้ browser render DOM เสร็จก่อนค่อย init
    requestAnimationFrame(() => {
      routes[page].init();
    });

    // ✅ ป้องกัน pushState ซ้ำตอนกด back/forward
    if (addToHistory) {
      history.pushState({ page }, "", `#${page}`);
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="alert alert-danger">
        เกิดข้อผิดพลาดในการโหลดหน้า
      </div>`;
  }
}

// รองรับ back / forward
window.addEventListener("popstate", (e) => {
  if (e.state?.page) {
    navigate(e.state.page, false);
  }
});

// โหลดครั้งแรก
document.addEventListener("DOMContentLoaded", () => {
  const page = location.hash.replace("#", "") || "dashboard";
  navigate(page, false);
});