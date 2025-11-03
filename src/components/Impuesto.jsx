import React, { useState, useEffect } from "react";

export const Impuestos = () => {
  const [impuestos, setImpuestos] = useState([]);

  useEffect(() => {
    if (impuestos.length === 0) {
      setImpuestos([{ id: Date.now(), nombre: '', porcentaje: '', aplica: '', guardado: false }]);
    }
  }, []);

  // ➕ Agregar nuevo impuesto vacío
  const agregarImpuesto = () => {
    setImpuestos([
      ...impuestos,
      { id: Date.now(), nombre: '', porcentaje: '', aplica: '', guardado: false }
    ]);
  };

  // 💾 Guardar impuesto
  const guardarImpuesto = (id, nombre, porcentaje, aplica) => {
    setImpuestos(impuestos.map(p =>
      p.id === id ? { ...p, nombre, porcentaje, aplica, guardado: true } : p
    ));
  };

  // ✏️ Volver a modo edición
  const editarImpuesto = (id) => {
    setImpuestos(impuestos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  // 🗑️ Eliminar impuesto
  const eliminarImpuesto = (id) => {
    setImpuestos(impuestos.filter(p => p.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Impuestos</h1>
      <div className='prod-container'>
        {impuestos.map((imp) => (
          <div key={imp.id} className='cont-prod'>

            {/* ❌ Botón eliminar */}
            <button
              className="bot-eliminar"
              onClick={() => eliminarImpuesto(imp.id)}
            >
              ✖
            </button>

            {imp.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{imp.nombre || "(sin nombre)"}</h3>
                <p className="producto-data">Porcentaje: {imp.porcentaje || 0}%</p>
                <p className="producto-data">Aplica a: {imp.aplica || "(sin dato)"}</p>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => editarImpuesto(imp.id)} className="bot-guardar">
                    Editar
                  </button>
                </div>
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const nombre = e.target.nombre.value.trim();
                  const porcentaje = e.target.porcentaje.value;
                  const aplica = e.target.aplica.value.trim();
                  guardarImpuesto(imp.id, nombre, porcentaje, aplica);
                }}
              >
                <input
                  name="nombre"
                  type="text"
                  placeholder="Nombre del impuesto"
                  defaultValue={imp.nombre}
                  className="formulario"
                />
                <input
                  name="porcentaje"
                  type="number"
                  placeholder="Porcentaje"
                  defaultValue={imp.porcentaje}
                  className="formulario"
                />
                <input
                  name="aplica"
                  type="text"
                  placeholder="Aplica a..."
                  defaultValue={imp.aplica}
                  className="formulario"
                />
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </div>
        ))}
        <button className='agreProd' onClick={agregarImpuesto}>+</button>
      </div>
    </>
  );
};
