import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Menus    from "./pages/Menus";
import Orders   from "./pages/Orders";
import "./App.css";

const NAV = [
  { path:"/",       label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { path:"/menus",  label:"Menus",     icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { path:"/orders", label:"Commandes", icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" },
];

function Icon({ d }) {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={d}/>
    </svg>
  );
}

// Route guard — redirect to /login if not authenticated
function Protected() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function Sidebar() {
  const location = useLocation();
  const { user }  = useAuth();
  const isAuth    = location.pathname === "/login" || location.pathname === "/register";
  if (isAuth) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🍽</div>
        <div className="brand-name">Cantine ENS</div>
      </div>
      <hr className="sidebar-divider"/>
      <nav className="sidebar-nav">
        {NAV.map(n => (
          <Link key={n.path} to={n.path}
            className={`nav-item ${location.pathname === n.path ? "active" : ""}`}>
            <span className="nav-icon-wrap"><Icon d={n.icon}/></span>
            {n.label}
          </Link>
        ))}
      </nav>
      <hr className="sidebar-divider"/>
      <div className="sidebar-section-label">COMPTE</div>
      <div className="sidebar-user">
        <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
          <div style={{fontSize:11,color:"var(--text-muted)",textTransform:"capitalize"}}>{user?.role}</div>
        </div>
      </div>
      <div className="sidebar-promo">
        <div className="sidebar-promo-title">Cantine ENS Marrakech</div>
        <p className="sidebar-promo-desc">Gérez vos menus et commandes facilement.</p>
      </div>
    </aside>
  );
}

function Topbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout } = useAuth();
  const isAuth    = location.pathname === "/login" || location.pathname === "/register";
  if (isAuth) return null;

  const current = NAV.find(n => n.path === location.pathname);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        <span className="breadcrumb-parent">Pages</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{current?.label || "Dashboard"}</span>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" onClick={handleLogout}>Déconnexion</button>
      </div>
    </header>
  );
}


function PrivateLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected layout */}
          <Route element={<Protected />}>
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}