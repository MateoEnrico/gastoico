import React, { useState } from "react";
import { InicioSesion } from "./Inicio-sesion.jsx";
import "./Navbar.css";

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={`navbar-header ${menuOpen ? "expanded" : ""}`}>
        <div className="top-row">
          <a href="#" className="cont-logo">
            <img src="/navbarLogo.png" alt="Logo Gastoico" className="logo" />
          </a>
        </div>

        {/* Botón de menú (solo en móvil) */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className="arrow">▼</span>
        </button>

        {/* Links */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#productos" className="navbar">Productos</a>
          <a href="#gastos-fijos" className="navbar">Gastos fijos</a>
          <a href="#mano-obra" className="navbar">Mano de obra</a>
          <a href="#materia-prima" className="navbar">Materia prima</a>
          <a href="#impuestos" className="navbar">Impuestos</a>
          <a href="#servicios" className="navbar">Servicios</a>
        </nav>

        <div className="cont-login" onClick={() => setShowLogin(true)}>
            <img src="/Login.png" alt="Login" className="login" />
        </div>
      </header>

      {showLogin && <InicioSesion onClose={() => setShowLogin(false)} />}
    </>
  );
};
