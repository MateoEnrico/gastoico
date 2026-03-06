import { useState, useEffect, useRef } from "react";
import { InicioSesion } from "./Inicio-sesion.jsx";
import { supabase } from "../../supabase.js";
import "./Navbar.css";

function UserMenu({ session }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const name    = session.user.user_metadata?.display_name ?? "";
  const email   = session.user.email ?? "";
  const inicial = (name || email).charAt(0).toUpperCase();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
  };

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-avatar" onClick={() => setOpen(v => !v)} aria-label="Menú de usuario">
        {inicial}
      </button>
      {open && (
        <div className="user-dropdown">
          {name && <span className="user-name">{name}</span>}
          <span className="user-email">{email}</span>
          <hr className="user-divider" />
          <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export const Navbar = ({ session }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  /* Cerrar el modal automáticamente cuando se detecta sesión activa */
  useEffect(() => {
    if (session) setShowLogin(false);
  }, [session]);

  return (
    <>
      <header className={`navbar-header ${menuOpen ? "expanded" : ""}`}>
        <div className="top-row">
          <a href="#" className="cont-logo">
            <img src="/navbarLogo.png" alt="Logo Gastoico" className="logo" />
          </a>
        </div>

        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className="arrow">▼</span>
        </button>

        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#productos"     className="navbar" onClick={() => setMenuOpen(false)}>Productos</a>
          <a href="#gastos-fijos"  className="navbar" onClick={() => setMenuOpen(false)}>Gastos fijos</a>
          <a href="#mano-obra"     className="navbar" onClick={() => setMenuOpen(false)}>Mano de obra</a>
          <a href="#materia-prima" className="navbar" onClick={() => setMenuOpen(false)}>Materia prima</a>
          <a href="#impuestos"     className="navbar" onClick={() => setMenuOpen(false)}>Impuestos</a>
          <a href="#servicios"     className="navbar" onClick={() => setMenuOpen(false)}>Servicios</a>
        </nav>

        {session ? (
          <UserMenu session={session} />
        ) : (
          <div className="cont-login" onClick={() => setShowLogin(true)}>
            <img src="/Login.png" alt="Login" className="login" />
          </div>
        )}
      </header>

      {showLogin && <InicioSesion onClose={() => setShowLogin(false)} />}
    </>
  );
};
