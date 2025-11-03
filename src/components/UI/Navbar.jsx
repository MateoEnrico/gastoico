import React, { useState } from 'react';
import { InicioSesion } from './Inicio-sesion.jsx';

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header>
        <a href="#" className='cont-logo'>
          <img src="/navbarLogo.png" alt="Logo Gastoico" className='logo' />
        </a>
        <a href='#productos' className='navbar'>Productos</a>
        <a href='#gastos-fijos' className='navbar'>Gastos fijos</a>
        <a href='#mano-obra' className='navbar'>Mano de obra</a>
        <a href='#materia-prima' className='navbar'>Materia prima</a>
        <a href='#impuestos' className='navbar'>Impuestos</a>
        <a href='#servicios' className='navbar'>Servicios</a>

        <div className='cont-login' onClick={() => setShowLogin(true)}>
          <img src="/Login.png" alt="Login" className='login' />
        </div>
      </header>

      {showLogin && <InicioSesion onClose={() => setShowLogin(false)} />}
    </>
  );
};
