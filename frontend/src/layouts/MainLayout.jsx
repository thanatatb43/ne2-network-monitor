import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div style={{ display: "flex", height: "100vh" }}>

            {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#2c3e50",
        color: "white",
        padding: "20px"
      }}>
        <h3>NE2 Monitor</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/devices" style={{ color: "white" }}>Devices</Link>
        </nav>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  )
}