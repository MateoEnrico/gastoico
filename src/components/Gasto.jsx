import { useState } from "react";
import { StableCard } from "./UI/StableCard.jsx";

export const Gasto = ({ gastos, setGastos, isReadOnly, onRequireLogin }) => {
  const [globalPercent, setGlobalPercent] = useState("");

  const agregarGasto = () => {
    setGastos([...gastos, { id: Date.now(), tipo: '', mes: '', precio: '', guardado: false }]);
  };

  const cargarGasto = (id, tipo, mes, precio) => {
    if (onRequireLogin && onRequireLogin()) return;
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

  const aplicarAumentoGlobal = () => {
    const porcentaje = parseFloat(globalPercent);
    if (isNaN(porcentaje) || porcentaje === 0) return;
    const factor = 1 + (porcentaje / 100);

    setGastos(gastos.map(p => {
      if (!p.guardado) return p;
      const nuevoPrecio = parseFloat(p.precio) * factor;
      return { ...p, precio: nuevoPrecio.toFixed(2) };
    }));
    setGlobalPercent("");
  };

  return (
    <>
      <h1 className="section-title">
        Gastos fijos
        <span className="help-icon" data-tooltip="Gastos que pagás todos los meses vendas o no vendas (Ej: Alquiler, internet, sueldo base)." style={{ width: '22px', height: '22px', fontSize: '14px', marginLeft: '12px' }}>?</span>
      </h1>

      {!isReadOnly && gastos.some(g => g.guardado) && (
        <div className="global-updater-box">
          <div className="global-updater-content">
            <span className="global-updater-label">Aumento Masivo de Costos:</span>
            <div className="global-updater-input-group">
              <input
                type="number"
                placeholder="Ej: 15"
                value={globalPercent}
                onChange={(e) => setGlobalPercent(e.target.value)}
              />
              <span>%</span>
            </div>
          </div>
          <button className="global-updater-btn" onClick={aplicarAumentoGlobal}>Aplicar Incremento</button>
        </div>
      )}

      <div className='prod-container'>
        {gastos.map((gasto) => (
          <StableCard key={gasto.id}>
            {!isReadOnly && <button className="bot-eliminar" onClick={() => eliminarGasto(gasto.id)}>✖</button>}

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
                {!isReadOnly && <button type="button" onClick={() => editarGasto(gasto.id)} className="bot-guardar">Editar</button>}
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  cargarGasto(gasto.id, e.target.tipo.value.trim(), e.target.mes.value, e.target.precio.value);
                }}
              >
                <div className="form-group-relative">
                  <input name="tipo" type="text" placeholder="Nombre de costo (Ej: Luz)" defaultValue={gasto.tipo} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="mes" type="text" placeholder="Mes de cobro (Ej: Enero)" defaultValue={gasto.mes} className="formulario" />
                </div>
                <div className="form-group-relative">
                  <input name="precio" type="number" step="any" placeholder="Precio a pagar" defaultValue={gasto.precio} className="formulario" required />
                  <span className="help-icon" data-tooltip="Monto fijo pagado por todo el período.">?</span>
                </div>
                <button type="submit" className="bot-guardar">Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className='agreProd' onClick={agregarGasto} disabled={isReadOnly}>+</button>
      </div>
    </>
  );
}
