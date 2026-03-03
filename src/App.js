import { useState } from "react";
import './App.css';
import { Navbar }       from "./components/UI/Navbar.jsx";
import { ParticleCanvas } from "./components/UI/ParticleCanvas.jsx";
import { Producto }     from './components/Producto.jsx';
import { Gasto }        from "./components/Gasto.jsx";
import { ManoObra }     from "./components/Mano-obra.jsx";
import { MateriaPrima } from "./components/Materia-prima.jsx";
import { Impuestos }    from "./components/Impuesto.jsx";
import { Servicios }    from "./components/Servicio.jsx";

// Estado centralizado: cuando haya backend, reemplazar los useState con:
// useEffect(() => { fetch('/api/user-data').then(r => r.json()).then(data => { setGastos(data.gastos); ... }) }, [userId])

function App() {
  const [gastos, setGastos] = useState([
    { id: Date.now(), tipo: '', mes: '', precio: '', guardado: false }
  ]);
  const [manos, setManos] = useState([
    { id: Date.now() + 1, area: '', costoXhora: '', cantHoras: '', cantDias: '', empleados: '', guardado: false }
  ]);
  const [materiasPrimas, setMateriasPrimas] = useState([
    { id: Date.now() + 2, tipo: '', nombre: '', unidadesXPaquete: '', tipoUnidad: '', precioXPaquete: '', cantidadPaquetes: '', guardado: false }
  ]);
  const [servicios, setServicios] = useState([
    { id: Date.now() + 3, nombre: '', unidad: '', cantidadUni: '', precioXUni: '', guardado: false }
  ]);

  return (
    <div className="cuerpo">

      {/* Manchas de color difuminadas en el fondo */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob a1" />
        <div className="aurora-blob a2" />
        <div className="aurora-blob a3" />
      </div>

      {/* Partículas doradas interactivas (canvas) */}
      <ParticleCanvas />

      <Navbar />

      <div className="contenido">
        <section id="productos">
          <Producto
            materiasPrimas={materiasPrimas}
            gastosFijos={gastos}
            manoObra={manos}
            manoVariable={servicios}
          />
        </section>
        <section id="gastos-fijos">
          <Gasto gastos={gastos} setGastos={setGastos} />
        </section>
        <section id="mano-obra">
          <ManoObra manos={manos} setManos={setManos} />
        </section>
        <section id="materia-prima">
          <MateriaPrima materiasPrimas={materiasPrimas} setMateriasPrimas={setMateriasPrimas} />
        </section>
        <section id="impuestos">
          <Impuestos />
        </section>
        <section id="servicios">
          <Servicios servicios={servicios} setServicios={setServicios} />
        </section>
      </div>

      <footer>
        <div className="footer-brand">
          <span className="footer-name">Gastoico</span>
          <span className="footer-tagline">Calculá el costo real de tu producto</span>
        </div>

        <nav className="footer-nav">
          <a href="#productos"     className="footer-link">Productos</a>
          <a href="#gastos-fijos"  className="footer-link">Gastos fijos</a>
          <a href="#mano-obra"     className="footer-link">Mano de obra</a>
          <a href="#materia-prima" className="footer-link">Materia prima</a>
          <a href="#impuestos"     className="footer-link">Impuestos</a>
          <a href="#servicios"     className="footer-link">Servicios</a>
        </nav>

        <div className="footer-copy">
          <span>contacto@gastoico.com</span>
          <span>© 2026 Gastoico</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
