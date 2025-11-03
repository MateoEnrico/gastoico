import React, { useState, useEffect } from "react";

export const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    if (servicios.length === 0) {
      setServicios([{ 
        id: Date.now(), 
        nombre: '', 
        unidad: '', 
        cantidadUni: '', 
        precioXUni: '', 
        guardado: false 
      }]);
    }
  }, []);

  // ➕ Agregar nuevo servicio
  const agregarServicio = () => {
    setServicios([
      ...servicios,
      { id: Date.now(), nombre: '', unidad: '', cantidadUni: '', precioXUni: '', guardado: false }
    ]);
  };

  // 💾 Guardar servicio
  const guardarServicio = (id, nombre, unidad, cantidadUni, precioXUni) => {
    setServicios(servicios.map(s =>
      s.id === id ? { ...s, nombre, unidad, cantidadUni, precioXUni, guardado: true } : s
    ));
  };

  // ✏️ Editar servicio
  const editarServicio = (id) => {
    setServicios(servicios.map(s =>
      s.id === id ? { ...s, guardado: false } : s
    ));
  };

  // 🗑️ Eliminar servicio
  const eliminarServicio = (id) => {
    setServicios(servicios.filter(s => s.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Servicios</h1>
      <div className='prod-container'>
        {servicios.map((serv) => (
          <div key={serv.id} className='cont-prod'>

            {/* ❌ Botón eliminar */}
            <button
              className="bot-eliminar"
              onClick={() => eliminarServicio(serv.id)}
            >
              ✖
            </button>

            {serv.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{serv.nombre || "(sin nombre)"}</h3>
                <p className="producto-data">Unidad: {serv.unidad || "(sin unidad)"}</p>
                <p className="producto-data">Cantidad: {serv.cantidadUni || 0}</p>
                <p className="producto-data">Precio x unidad: ${serv.precioXUni || 0}</p>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => editarServicio(serv.id)} className="bot-guardar">
                    Editar
                  </button>
                </div>
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const nombre = e.target.nombre.value.trim();
                  const unidad = e.target.unidad.value.trim();
                  const cantidadUni = e.target.cantidadUni.value;
                  const precioXUni = e.target.precioXUni.value;
                  guardarServicio(serv.id, nombre, unidad, cantidadUni, precioXUni);
                }}
              >
                <input
                  name="nombre"
                  type="text"
                  placeholder="Nombre del servicio"
                  defaultValue={serv.nombre}
                  className="formulario"
                />
                <select
                  name="unidad"
                  defaultValue={serv.unidad}
                  className="formulario"
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="llamados">Llamados</option>
                  <option value="horas">Horas</option>
                  <option value="productos">Productos</option>
                </select>
                <input
                  name="cantidadUni"
                  type="number"
                  placeholder="Cantidad de unidades"
                  defaultValue={serv.cantidadUni}
                  className="formulario"
                />
                <input
                  name="precioXUni"
                  type="number"
                  placeholder="Precio por unidad"
                  defaultValue={serv.precioXUni}
                  className="formulario"
                />
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </div>
        ))}
        <button className='agreProd' onClick={agregarServicio}>+</button>
      </div>
    </>
  );
};
