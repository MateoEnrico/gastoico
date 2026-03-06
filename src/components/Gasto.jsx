import { StableCard } from "./UI/StableCard.jsx";

export const Gasto = ({ gastos, setGastos }) => {

  const agregarGasto = () => {
    setGastos([...gastos, { id: Date.now(), tipo: '', mes: '', precio: '', guardado: false }]);
  };

  const cargarGasto = (id, tipo, mes, precio) => {
    setGastos(gastos.map(p =>
      p.id === id ? { ...p, tipo, mes, precio, guardado: true } : p
    ));
  };

  const editarGasto = (id) => {
    setGastos(gastos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  const eliminarGasto = (id) => {
    setGastos(gastos.filter(p => p.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Gastos fijos</h1>
      <div className='prod-container'>
        {gastos.map((gasto) => (
          <StableCard key={gasto.id}>
            <button className="bot-eliminar" onClick={() => eliminarGasto(gasto.id)}>✖</button>

            {gasto.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{gasto.tipo || "(sin nombre)"}</h3>
                <hr className="prod-divider" />
                <div className="info-row">
                  <span className="info-label">Mes de cobro</span>
                  <span className="info-val">{gasto.mes || "—"}</span>
                </div>
                <div className="info-costo">
                  <span className="info-costo-label">Precio mensual</span>
                  <span className="info-costo-value">${gasto.precio || 0}</span>
                </div>
                <button type="button" onClick={() => editarGasto(gasto.id)} className="bot-guardar">Editar</button>
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  cargarGasto(gasto.id, e.target.tipo.value.trim(), e.target.mes.value, e.target.precio.value);
                }}
              >
                <input name="tipo" type="text" placeholder="Nombre de costo" defaultValue={gasto.tipo} className="formulario" />
                <input name="mes" type="text" placeholder="Mes de cobro" defaultValue={gasto.mes} className="formulario" />
                <input name="precio" type="number" placeholder="Precio" defaultValue={gasto.precio} className="formulario" />
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className='agreProd' onClick={agregarGasto}>+</button>
      </div>
    </>
  );
}
