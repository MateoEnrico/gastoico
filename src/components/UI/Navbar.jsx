import React from 'react'

export const Navbar = () => {
  return (
    <header>
        <a href="" className='cont-logo'>
          <img src="/navbarLogo.png" alt="Logo Gastoico" className='logo' />
        </a>
        <a href='#productos' className='navbar'>Productos</a>
        <a href='#gastos-fijos' className='navbar'>Gastos fijos</a>
        <a href='#mano-obra' className='navbar'>Mano de obra</a>
        <a href='#materia-prima' className='navbar'>Materia prima</a>
        <a href='#impuestos' className='navbar'>Impuestos</a>
        <a href='#servicios' className='navbar'>Servicios</a>
        <a href="" className='cont-login'>
          <img src="/Login.png" alt="" className='login'/>
        </a>
      </header>
  )
}
