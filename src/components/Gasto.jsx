import React, { useState, useEffect } from "react";

export const Gasto = () => {
  const [gastos, setGastos] = useState([]);

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
  return (
    <>
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
    </>
  );
}
