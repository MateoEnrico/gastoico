import React, { useState, useEffect } from "react";
import './App.css';
import { Navbar } from "./components/UI/Navbar.jsx";
import { Producto } from './components/Producto.jsx';
import { Gasto } from "./components/Gasto.jsx";
import { ManoObra } from "./components/Mano-obra.jsx";
import { MateriaPrima } from "./components/Materia-prima.jsx";
import { Impuestos } from "./components/Impuesto.jsx";
import { Servicios } from "./components/Servicio.jsx";


function App() {

  return (
    <div className="cuerpo">
      <Navbar/>
      <div className='contenido'>
        <section id="productos">
          <Producto/>
        </section>
        <section id="gastos-fijos">
          <Gasto/>
        </section>
        <section id="mano-obra">
          <ManoObra/>
        </section>
        <section id="materia-prima">
          <MateriaPrima/>
        </section>
        <section id="impuestos">
          <Impuestos/>
        </section>
        <section id="servicios">
          <Servicios/>
        </section>
      </div>

      <footer>
        <h1>Gastoico</h1>
        <p>Contacto</p>
      </footer>
    </div>
  );
}

export default App;
