import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Login    from "./pages/Login";
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

function Sidebar() {
  const location = useLocation();
  if (location.pathname === "/login") return null;
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
            className={`nav-item ${location.pathname===n.path?"active":""}`}>
            <span className="nav-icon-wrap"><Icon d={n.icon}/></span>
            {n.label}
          </Link>
        ))}
      </nav>
      <hr className="sidebar-divider"/>
      <div className="sidebar-section-label">COMPTE</div>
      <nav className="sidebar-nav">
        <Link to="/login" className="nav-item">
          <span className="nav-icon-wrap">
            <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </span>
          Connexion
        </Link>
      </nav>
      <div className="sidebar-promo">
        <div className="sidebar-promo-title">Cantine ENS Marrakech</div>
        <p className="sidebar-promo-desc">Gérez vos menus et commandes depuis ce tableau de bord.</p>
      </div>
    </aside>
  );
}

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === "/login") return null;
  const current = NAV.find(n => n.path === location.pathname);
  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        <span className="breadcrumb-parent">Pages</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{current?.label || "Dashboard"}</span>
      </div>
      <div className="topbar-right">
        <input className="topbar-search" placeholder="Rechercher…" readOnly/>
        <button className="topbar-btn" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}

function Shell() {
  const location = useLocation();
  const isLogin  = location.pathname === "/login";
  return (
    <div className="app-shell">
      <Sidebar/>
      <div className={isLogin ? "" : "main-wrapper"}>
        <Topbar/>
        <main className={isLogin ? "" : "main-content"}>
          <Routes>
            <Route path="/login"  element={<Login/>}/>
            <Route path="/"       element={<Dashboard/>}/>
            <Route path="/menus"  element={<Menus/>}/>
            <Route path="/orders" element={<Orders/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><Shell/></BrowserRouter>;
}