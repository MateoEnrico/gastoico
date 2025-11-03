import React, { useState, useEffect } from "react";

export const ManoObra = () => {
  const [manos, setManos] = useState([])

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
    <>
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
    </>
  );
}
