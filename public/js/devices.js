function initDevices() {
  console.log("Devices init");

  // ==============================
  // ELEMENT CHECK (กันพังเวลาไม่อยู่หน้า devices)
  // ==============================
  const tbody = document.querySelector("#deviceTable tbody");
  if (!tbody) return;

  // ==============================
  // STATE
  // ==============================
  let editingId = null;
  let deleteId = null;

  // ==============================
  // ELEMENTS
  // ==============================
  const btn = document.querySelector("#saveDevice");
  const btnText = document.querySelector("#btnText");
  const btnSpinner = document.querySelector("#btnSpinner");
  const cancelBtn = document.querySelector("#cancelEdit");

  const deleteModalEl = document.getElementById("deleteModal");
  const successModalEl = document.getElementById("successModal");

  const deleteModal = deleteModalEl ? new bootstrap.Modal(deleteModalEl) : null;
  const successModal = successModalEl ? new bootstrap.Modal(successModalEl) : null;

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  // ==============================
  // INIT LOAD
  // ==============================
  loadDevices();

  // ==============================
  // SAVE / UPDATE
  // ==============================
  btn?.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      toggleLoading(true);
      showLoader();

      const data = getFormData();

      const url = editingId
        ? `/api/devices/${editingId}`
        : "/api/devices";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();

      resetForm();
      await loadDevices(result.id);
      showSuccess(editingId ? "Device updated!" : "Device created!");

    } catch (err) {
      console.error(err);
    } finally {
      toggleLoading(false);
      hideLoader();
    }
  });

  // ==============================
  // CANCEL
  // ==============================
  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
  });

  // ==============================
  // TABLE EVENT DELEGATION
  // ==============================
  tbody.addEventListener("click", async (e) => {

    const editBtn = e.target.closest(".editBtn");
    const deleteBtn = e.target.closest(".deleteBtn");

    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      await editDevice(id);
    }

    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      await deleteDevice(id);
    }
  });

  // ==============================
  // DELETE CONFIRM
  // ==============================
  confirmDeleteBtn?.addEventListener("click", async () => {

    confirmDeleteBtn.disabled = true;
    if (!deleteId) return;

    try {
      showLoader();

      await fetch(`/api/devices/${deleteId}`, {
        method: "DELETE"
      });

      deleteModal?.hide();
      await loadDevices();

      showSuccess("Device deleted successfully");

    } catch (err) {
      console.error(err);
    } finally {
      toggleLoading(false);
      hideLoader();
      deleteId = null;
      confirmDeleteBtn.disabled = false;
    }
  });

  // ==============================
  // FUNCTIONS
  // ==============================

  async function loadDevices(highlightId = null) {
    try {
      showLoader();

      const res = await fetch("/api/devices");
      const data = await res.json();

      tbody.innerHTML = "";

      data.forEach(device => {

        const row = document.createElement("tr");
        if (device.id === highlightId) {
          row.style.backgroundColor = "#d4edda";
        }

        row.innerHTML = `
          <td>${device.id}</td>
          <td>${device.type}</td>
          <td>${device.pea_name}</td>
          <td>${device.province}</td>
          <td>${device.gateway}</td>
          <td>${device.wan_gateway}</td>
          <td>${device.wan_ip}</td>
          <td>${device.vpn_main}</td>
          <td>${device.vpn_backup}</td>
          <td class="text-center">
            <button class="action-btn btn-edit me-1 editBtn" data-id="${device.id}">
              <i class="fas fa-pen"></i>
            </button>
            <button class="action-btn btn-delete deleteBtn" data-id="${device.id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;

        tbody.appendChild(row);
      });

    } catch (err) {
      console.error(err);
    } finally {
      hideLoader();
    }
  }

  async function editDevice(id) {
    try {
      showLoader();

      const res = await fetch(`/api/devices/${id}`);
      const device = await res.json();

      fillForm(device);

      editingId = id;

      btnText.textContent = "Update Device";
      btn.classList.replace("btn-primary", "btn-warning");
      cancelBtn.style.display = "inline-block";

    } catch (err) {
      console.error(err);
    } finally {
      hideLoader();
    }
  }

  async function deleteDevice(id) {
    deleteId = id;
    deleteModal?.show();
  }

  function showSuccess(message) {
    if (!successModal) return;
    document.getElementById("successMessage").textContent = message;
    successModal.show();
    setTimeout(() => successModal.hide(), 1500);
  }

  function getFormData() {
    return {
      type: document.getElementById("type")?.value,
      pea_name: document.getElementById("pea_name")?.value,
      province: document.getElementById("province")?.value,
      gateway: document.getElementById("gateway")?.value,
      wan_gateway: document.getElementById("wan_gateway")?.value,
      wan_ip: document.getElementById("wan_ip")?.value,
      vpn_main: document.getElementById("vpn_main")?.value,
      vpn_backup: document.getElementById("vpn_backup")?.value
    };
  }

  function fillForm(device) {
    Object.keys(device).forEach(key => {
      const el = document.getElementById(key);
      if (el) el.value = device[key];
    });
  }

  function resetForm() {
    editingId = null;
    document.querySelectorAll("#deviceForm input").forEach(input => input.value = "");

    btnText.textContent = "Save Device";
    btn.classList.replace("btn-warning", "btn-primary");
    cancelBtn.style.display = "none";
  }

  function toggleLoading(isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    if (btnSpinner) {
      btnSpinner.style.display = isLoading ? "inline-block" : "none";
    }
  }

  function showLoader() {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.style.display = "none";
  }
}