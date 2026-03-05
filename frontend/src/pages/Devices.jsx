import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import "./Devices.css";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const fetchDevices = async () => {
    const res = await api.get("/devices/status");
    console.log(res.data);
    setDevices(res.data);
  };

  // ===== FILTER + SEARCH =====
  const filteredDevices = useMemo(() => {
    return devices
      .filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.ip.includes(search),
      )
      .filter((d) =>
        statusFilter === "all" ? true : d.status === statusFilter,
      );
  }, [devices, search, statusFilter]);

  // ===== SORT =====
  const sortedDevices = useMemo(() => {
    const sorted = [...filteredDevices].sort((a, b) => {
      if (sortField === "response") {
        return sortAsc
          ? (a.time || 9999) - (b.time || 9999)
          : (b.time || 9999) - (a.time || 9999);
      }

      return sortAsc
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
    return sorted;
  }, [filteredDevices, sortField, sortAsc]);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(sortedDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDevices = sortedDevices.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const changeSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="mb-4 fw-semibold">Devices</h4>

          {/* Summary */}
          <div className="d-flex gap-4 mb-4">
            <div>
              <div className="text-muted small">Total</div>
              <div className="fw-bold fs-5">{devices.length}</div>
            </div>
            <div>
              <div className="text-muted small">Online</div>
              <div className="fw-bold fs-5 text-success">
                {devices.filter((d) => d.status === "online").length}
              </div>
            </div>
            <div>
              <div className="text-muted small">Offline</div>
              <div className="fw-bold fs-5 text-danger">
                {devices.filter((d) => d.status === "offline").length}
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-6">
              <label className="form-label small text-muted">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search name or IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="col-md-3 text-end">
              <div className="fw-semibold">Total: {sortedDevices.length}</div>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive unifi-table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th></th>

                  <th className="sortable" onClick={() => changeSort("name")}>
                    Name {sortField === "name" && (sortAsc ? "▲" : "▼")}
                  </th>

                  <th>IP Address</th>

                  <th
                    className="text-end sortable"
                    onClick={() => changeSort("response")}
                  >
                    Latency {sortField === "response" && (sortAsc ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedDevices.map((device) => (
                  <tr key={device.id}>
                    {/* STATUS DOT */}
                    <td style={{ width: 40 }}>
                      <span
                        className={
                          device.status === "online"
                            ? "status-dot online"
                            : "status-dot offline"
                        }
                      ></span>
                    </td>

                    {/* NAME */}
                    <td className="fw-medium">{device.name}</td>

                    {/* IP */}
                    <td className="text-muted small">{device.ip}</td>

                    {/* LATENCY */}
                    <td className="text-end">
                      {device.status === "online" ? (
                        <span
                          className={
                            device.time > 100
                              ? "latency warning"
                              : "latency good"
                          }
                        >
                          {device.time} ms
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <nav className="mt-3">
            <ul className="pagination pagination-sm justify-content-end">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Devices;
