import { StableCard } from "./UI/StableCard.jsx";

export const ManoObra = ({ manos, setManos, isReadOnly, onRequireLogin }) => {

  const agregarMano = () => {
    setManos([...manos, { id: Date.now(), area: '', costoXhora: '', cantHoras: '', cantDias: '', empleados: '', guardado: false }]);
  };

  const cargarMano = (id, area, costoXhora, cantHoras, cantDias, empleados) => {
    if (onRequireLogin && onRequireLogin()) return;
    setManos(manos.map(p =>
      p.id === id ? { ...p, area, costoXhora, cantHoras, cantDias, empleados, guardado: true } : p
    ));
  };

  const editarMano = (id) => {
    setManos(manos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  const eliminarMano = (id) => {
    setManos(manos.filter(p => p.id !== id));
  };

  return (
    <>
      <h1 className="section-title">
        Mano de obra
        <span className="help-icon" data-tooltip="Calculá cuánto vale el tiempo y esfuerzo dedicado a producir (incluso tu propio tiempo)." style={{ width: '22px', height: '22px', fontSize: '14px', marginLeft: '12px' }}>?</span>
      </h1>
      <div className='prod-container'>
        {manos.map((mano) => (
          <StableCard key={mano.id}>
            {!isReadOnly && <button className="bot-eliminar" onClick={() => eliminarMano(mano.id)}>✖</button>}

            {mano.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{mano.area || "(sin área)"}</h3>
                <hr className="prod-divider" />
                <div className="info-row">
                  <span className="info-label">Valor hora</span>
                  <span className="info-val">${mano.costoXhora || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Horas / día</span>
                  <span className="info-val">{mano.cantHoras || 0} hs</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Días / semana</span>
                  <span className="info-val">{mano.cantDias || 0} días</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Empleados</span>
                  <span className="info-val">{mano.empleados || 0}</span>
                </div>
                <div className="info-costo">
                  <span className="info-costo-label">Costo mensual</span>
                  <span className="info-costo-value">${parseFloat((mano.empleados * mano.cantDias * mano.cantHoras * mano.costoXhora * 4) || 0).toFixed(2)}</span>
                </div>
                {!isReadOnly && <button type="button" onClick={() => editarMano(mano.id)} className="bot-guardar">Editar</button>}
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  cargarMano(mano.id, e.target.area.value.trim(), e.target.costoXhora.value, e.target.cantHoras.value, e.target.cantDias.value, e.target.empleados.value);
                }}
              >
                <div className="form-group-relative">
                  <input name="area" type="text" placeholder="Área (Ej: Producción)" defaultValue={mano.area} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="costoXhora" type="number" step="any" placeholder="Costo por hora ($)" defaultValue={mano.costoXhora} className="formulario" required />
                  <span className="help-icon" data-tooltip="Cuánto le pagás por hora. Si sos vos, imaginá cuánto te gustaría ganar de sueldo y dividilo por las horas que trabajás en el mes.">?</span>
                </div>
                <div className="form-group-relative">
                  <input name="cantHoras" type="number" step="any" placeholder="Cant. horas diarias" defaultValue={mano.cantHoras} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="cantDias" type="number" step="any" placeholder="Días trabajados x semana" defaultValue={mano.cantDias} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="empleados" type="number" step="any" placeholder="Cantidad de empleados" defaultValue={mano.empleados} className="formulario" required />
                </div>
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className='agreProd' onClick={agregarMano} disabled={isReadOnly}>+</button>
      </div>
    </>
  );
}
