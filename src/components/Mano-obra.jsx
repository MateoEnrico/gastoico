import { StableCard } from "./UI/StableCard.jsx";

export const ManoObra = ({ manos, setManos }) => {

  const agregarMano = () => {
    setManos([...manos, { id: Date.now(), area: '', costoXhora: '', cantHoras: '', cantDias: '', empleados: '', guardado: false }]);
  };

  const cargarMano = (id, area, costoXhora, cantHoras, cantDias, empleados) => {
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
      <h1 className="section-title">Mano de obra</h1>
      <div className='prod-container'>
        {manos.map((mano) => (
          <StableCard key={mano.id}>
            <button className="bot-eliminar" onClick={() => eliminarMano(mano.id)}>✖</button>

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
                <button type="button" onClick={() => editarMano(mano.id)} className="bot-guardar">Editar</button>
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  cargarMano(mano.id, e.target.area.value.trim(), e.target.costoXhora.value, e.target.cantHoras.value, e.target.cantDias.value, e.target.empleados.value);
                }}
              >
                <input name="area" type="text" placeholder="Área" defaultValue={mano.area} className="formulario" />
                <input name="costoXhora" type="number" placeholder="Costo por hora" defaultValue={mano.costoXhora} className="formulario" />
                <input name="cantHoras" type="number" placeholder="Cantidad de horas por día" defaultValue={mano.cantHoras} className="formulario" />
                <input name="cantDias" type="number" placeholder="Cantidad de días x semana" defaultValue={mano.cantDias} className="formulario" />
                <input name="empleados" type="number" placeholder="Cantidad de empleados" defaultValue={mano.empleados} className="formulario" />
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className='agreProd' onClick={agregarMano}>+</button>
      </div>
    </>
  );
}
