import { StableCard } from "./UI/StableCard.jsx";

export const Impuestos = ({ impuestos, setImpuestos, isReadOnly, onRequireLogin }) => {

  const agregarImpuesto = () => {
    setImpuestos([...impuestos, { id: String(Date.now()), nombre: '', porcentaje: '', guardado: false }]);
  };

  const guardarImpuesto = (id, nombre, porcentaje) => {
    if (onRequireLogin && onRequireLogin()) return;
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
      <h1 className="section-title">
        Impuestos
        <span className="help-icon" data-tooltip="Porcentajes adicionales que se le suman directamente al precio final (Ej: IVA del 21%)." style={{ width: '22px', height: '22px', fontSize: '14px', marginLeft: '12px' }}>?</span>
      </h1>
      <div className="prod-container">
        {impuestos.map((imp) => (
          <StableCard key={imp.id}>
            {!isReadOnly && <button className="bot-eliminar" onClick={() => eliminarImpuesto(imp.id)}>✕</button>}

            {imp.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{imp.nombre || "(sin nombre)"}</h3>
                <hr className="prod-divider" />
                <div className="info-costo">
                  <span className="info-costo-label">Porcentaje sobre venta</span>
                  <span className="info-costo-value">{imp.porcentaje || 0}%</span>
                </div>
                {!isReadOnly && <button type="button" onClick={() => editarImpuesto(imp.id)} className="bot-guardar">Editar</button>}
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  guardarImpuesto(imp.id, e.target.nombre.value.trim(), e.target.porcentaje.value);
                }}
              >
                <div className="form-group-relative">
                  <input name="nombre" type="text" placeholder="Nombre (Ej: IVA)" defaultValue={imp.nombre} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="porcentaje" type="number" step="any" placeholder="Porcentaje (%)" defaultValue={imp.porcentaje} className="formulario" required />
                  <span className="help-icon" data-tooltip="Ej: Si es el 21% de IVA, tipeá solo 21. Ese % se le suma al precio final de venta.">?</span>
                </div>
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className="agreProd" onClick={agregarImpuesto} disabled={isReadOnly}>+</button>
      </div>
    </>
  );
};
