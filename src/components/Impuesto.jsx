import { StableCard } from "./UI/StableCard.jsx";

export const Impuestos = ({ impuestos, setImpuestos }) => {

  const agregarImpuesto = () => {
    setImpuestos([...impuestos, { id: String(Date.now()), nombre: '', porcentaje: '', guardado: false }]);
  };

  const guardarImpuesto = (id, nombre, porcentaje) => {
    setImpuestos(impuestos.map(i =>
      i.id === id ? { ...i, nombre, porcentaje, guardado: true } : i
    ));
  };

  const editarImpuesto = (id) => {
    setImpuestos(impuestos.map(i => i.id === id ? { ...i, guardado: false } : i));
  };

  const eliminarImpuesto = (id) => {
    setImpuestos(impuestos.filter(i => i.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Impuestos</h1>
      <div className="prod-container">
        {impuestos.map((imp) => (
          <StableCard key={imp.id}>
            <button className="bot-eliminar" onClick={() => eliminarImpuesto(imp.id)}>✕</button>

            {imp.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{imp.nombre || "(sin nombre)"}</h3>
                <hr className="prod-divider" />
                <div className="info-costo">
                  <span className="info-costo-label">Porcentaje sobre venta</span>
                  <span className="info-costo-value">{imp.porcentaje || 0}%</span>
                </div>
                <button type="button" onClick={() => editarImpuesto(imp.id)} className="bot-guardar">Editar</button>
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  guardarImpuesto(imp.id, e.target.nombre.value.trim(), e.target.porcentaje.value);
                }}
              >
                <input name="nombre" type="text" placeholder="Nombre del impuesto" defaultValue={imp.nombre} className="formulario" />
                <input name="porcentaje" type="number" placeholder="Porcentaje (%)" defaultValue={imp.porcentaje} className="formulario" />
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className="agreProd" onClick={agregarImpuesto}>+</button>
      </div>
    </>
  );
};
