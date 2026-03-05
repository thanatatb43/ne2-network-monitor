import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-container">
      <header className="navbar">
        <h2>NE2 Monitor</h2>
        <span>Admin</span>
      </header>

      <div className="body-container">
        <aside className="sidebar">
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>

          <NavLink to="/devices" className="nav-link">
            Devices
          </NavLink>
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>

      <footer className="footer">
        © 2026 แผนกคอมพิวเตอร์และเครือข่าย กดส.ฉ.2
      </footer>
    </div>
  );
}
