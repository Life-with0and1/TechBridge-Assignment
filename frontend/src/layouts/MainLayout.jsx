import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-layout ${theme}`}>
      <aside className="sidebar">
        <h2>Finance Tracker</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>

          <NavLink to="/transactions">Transactions</NavLink>

          {user?.role === "admin" && (
            <NavLink to="/users">Users</NavLink>
          )}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <strong>{user?.name}</strong>
            <span> ({user?.role})</span>
          </div>

          <div>
            <button type="button" onClick={toggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;