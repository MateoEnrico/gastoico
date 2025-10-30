import React, { useState, useEffect } from "react";
import './App.css';
import { Navbar } from "./components/UI/Navbar.jsx";
import { Producto } from "./components/Producto.jsx";


function App() {
  const [gastos, setGastos] = useState([]);
  const [manos, setManos] = useState([])

  // -----------------------------GASTOS---------------------------------
  useEffect(() => {
    if (gastos.length === 0) {
      setGastos([{ id: Date.now(), tipo: '', mes: '', precio: '', guardado: false }]);
    }
  }, []);

  // Agregar un nuevo gasto vacío
  const agregarGasto = () => {
    setGastos([
      ...gastos,
      { id: Date.now(), tipo: '', mes: '', precio: '', guardado: false }
    ]);
  };

  // Guardar los datos de un gasto
  const cargarGasto = (id, tipo, mes, precio) => {
    setGastos(gastos.map(p =>
      p.id === id ? { ...p, tipo, mes, precio, guardado: true } : p
    ));
  };

  // Volver a modo edición
  const editarGasto = (id) => {
    setGastos(gastos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  // 🗑️ Eliminar gasto
  const eliminarGasto = (id) => {
    setGastos(gastos.filter(p => p.id !== id));
  };

    // -----------------------------Mano de obra---------------------------------
  useEffect(() => {
    if (manos.length === 0) {
      setManos([{ id: Date.now(), area: '', costoXhora: '', cantHoras: '', cantDias: '', empleados: '', guardado: false }]);
    }
  }, []);

  // Agregar un nuevo gasto vacío
  const agregarMano = () => {
    setManos([
      ...manos,
      { id: Date.now(), area: '', costoXhora: '', cantHoras: '', cantDias: '', empleados: '', guardado: false }
    ]);
  };

  // Guardar los datos de un gasto
  const cargarMano = (id, area, costoXhora, cantHoras, cantDias, empleados) => {
    setManos(manos.map(p =>
      p.id === id ? { ...p, area, costoXhora, cantHoras, cantDias, empleados, guardado: true } : p
    ));
  };

  // Volver a modo edición
  const editarMano = (id) => {
    setManos(manos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  // 🗑️ Eliminar gasto
  const eliminarMano = (id) => {
    setManos(manos.filter(p => p.id !== id));
  };

  return (
    <div className="cuerpo">
      <Navbar/>

      <div className='contenido'>
        <section id="productos">
          <Producto/>
        </section>
        {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------- */}
        <section id="gastos-fijos">
          <h1 className="section-title">Gastos fijos</h1>
          <div className='prod-container'>
            {gastos.map((gasto) => (
              <div key={gasto.id} className='cont-prod'>
                
                {/* ❌ Botón para eliminar */}
                <button
                  className="bot-eliminar"
                  onClick={() => eliminarGasto(gasto.id)}
                >
                  ✖
                </button>

                {gasto.guardado ? (
                  <div className="producto-info">
                    <h3 className="producto-nombre">{gasto.tipo || "(sin nombre)"}</h3>
                    <p className="producto-data">Mes: {gasto.mes || "(sin mes)"}</p>
                    <p className="producto-data">Precio: ${gasto.precio || 0}</p>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" onClick={() => editarGasto(gasto.id)} className="bot-guardar">
                        Editar
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="cont-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const tipo = e.target.tipo.value.trim();
                      const mes = e.target.mes.value;
                      const precio = e.target.precio.value;
                      cargarGasto(gasto.id, tipo, mes, precio);
                    }}
                  >
                    <input
                      name="tipo"
                      type="text"
                      placeholder="Nombre de costo"
                      defaultValue={gasto.tipo}
                      className="formulario"
                    />
                    <input
                      name="mes"
                      type="text"
                      placeholder="Mes de cobro"
                      defaultValue={gasto.mes}
                      className="formulario"
                    />
                    <input
                      name="precio"
                      type="number"
                      placeholder="Precio"
                      defaultValue={gasto.precio}
                      className="formulario"
                    />
                    <button type="submit" className="bot-guardar">Guardar</button>
                  </form>
                )}
              </div>
            ))}
            <button className='agreProd' onClick={agregarGasto}>+</button>
          </div>
        </section>
        {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------- */}
        <section id="mano-obra">
          <h1 className="section-title">Mano de obra</h1>
          <div className='prod-container'>
            {manos.map((mano) => (
              <div key={mano.id} className='cont-prod'>
                
                {/* ❌ Botón para eliminar */}
                <button
                  className="bot-eliminar"
                  onClick={() => eliminarMano(mano.id)}
                >
                  ✖
                </button>

                {mano.guardado ? (
                  <div className="producto-info">
                    <h3 className="producto-nombre">{mano.area || "(sin área)"}</h3>
                    <p className="producto-data">Valor hora: ${mano.costoXhora || 0}</p>
                    <p className="producto-data">Horas: {mano.cantHoras || 0}</p>
                    <p className="producto-data">Días: {mano.cantDias || 0}</p>
                    <p className="producto-data">Empleados: {mano.empleados || 0}</p>
                    <p className="producto-data">Costo mensual: ${mano.empleados*mano.cantDias*mano.cantHoras*mano.costoXhora*4 || 0}</p>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" onClick={() => editarMano(mano.id)} className="bot-guardar">
                        Editar
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="cont-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const area = e.target.area.value.trim();
                      const costoXhora = e.target.costoXhora.value;
                      const cantHoras = e.target.cantHoras.value;
                      const cantDias = e.target.cantDias.value;
                      const empleados = e.target.empleados.value;
                      cargarMano(mano.id, area, costoXhora, cantHoras, cantDias, empleados);
                    }}
                  >
                    <input
                      name="area"
                      type="text"
                      placeholder="Área"
                      defaultValue={mano.area}
                      className="formulario"
                    />
                    <input
                      name="costoXhora"
                      type="number"
                      placeholder="Costo por hora"
                      defaultValue={mano.costoXhora}
                      className="formulario"
                    />
                    <input
                      name="cantHoras"
                      type="number"
                      placeholder="Cantidad de horas por día"
                      defaultValue={mano.cantHoras}
                      className="formulario"
                    />
                    <input
                      name="cantDias"
                      type="number"
                      placeholder="Cantidad de días x semana"
                      defaultValue={mano.cantDias}
                      className="formulario"
                    />
                    <input
                      name="empleados"
                      type="number"
                      placeholder="Cantidad de empleados"
                      defaultValue={mano.empleados}
                      className="formulario"
                    />
                    <button type="submit" className="bot-guardar">Guardar</button>
                  </form>
                )}
              </div>
            ))}
            <button className='agreProd' onClick={agregarMano}>+</button>
          </div>
        </section>
        {/* ----------------------------------------------------------------------------------- */}
      </div>

      <footer>
        <h1>Gastoico</h1>
        <p>Contacto</p>
      </footer>
    </div>
  );
}

export default App;
