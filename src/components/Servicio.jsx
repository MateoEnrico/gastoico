import { useState } from "react";
import { StableCard } from "./UI/StableCard.jsx";

export const Servicios = ({ servicios, setServicios, isReadOnly, onRequireLogin }) => {
  const [globalPercent, setGlobalPercent] = useState("");

  const agregarServicio = () => {
    setServicios([...servicios, { id: Date.now(), nombre: '', unidad: '', cantidadUni: '', precioXUni: '', guardado: false }]);
  };

  const guardarServicio = (id, nombre, unidad, cantidadUni, precioXUni) => {
    if (onRequireLogin && onRequireLogin()) return;
    setServicios(servicios.map(s =>
      s.id === id ? { ...s, nombre, unidad, cantidadUni, precioXUni, guardado: true } : s
    ));
  };

  const editarServicio = (id) => {
    setServicios(servicios.map(s => s.id === id ? { ...s, guardado: false } : s));
  };

  const eliminarServicio = (id) => {
    setServicios(servicios.filter(s => s.id !== id));
  };

  const aplicarAumentoGlobal = () => {
    const porcentaje = parseFloat(globalPercent);
    if (isNaN(porcentaje) || porcentaje === 0) return;
    const factor = 1 + (porcentaje / 100);

    setServicios(servicios.map(p => {
      if (!p.guardado) return p;
      const nuevoPrecio = parseFloat(p.precioXUni) * factor;
      return { ...p, precioXUni: nuevoPrecio.toFixed(2) };
    }));
    setGlobalPercent("");
  };

  return (
    <>
      <h1 className="section-title">
        Servicios / Variables
        <span className="help-icon" data-tooltip="Costos que pagás POR cada venta o según volumen. (Ej: envío, comisiones)" style={{ width: '22px', height: '22px', fontSize: '14px', marginLeft: '12px' }}>?</span>
      </h1>

      {!isReadOnly && servicios.some(s => s.guardado) && (
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
        {servicios.map((serv) => (
          <StableCard key={serv.id}>
            {!isReadOnly && <button className="bot-eliminar" onClick={() => eliminarServicio(serv.id)}>✖</button>}

            {serv.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{serv.nombre || "(sin nombre)"}</h3>
                <hr className="prod-divider" />
                <div className="info-row">
                  <span className="info-label">Unidad</span>
                  <span className="info-val">{serv.unidad || "—"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Cantidad</span>
                  <span className="info-val">{serv.cantidadUni || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Precio / unidad</span>
                  <span className="info-val">${serv.precioXUni || 0}</span>
                </div>
                <div className="info-costo">
                  <span className="info-costo-label">Total</span>
                  <span className="info-costo-value">${parseFloat((serv.cantidadUni * serv.precioXUni) || 0).toFixed(2)}</span>
                </div>
                {!isReadOnly && <button type="button" onClick={() => editarServicio(serv.id)} className="bot-guardar">Editar</button>}
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  guardarServicio(serv.id, e.target.nombre.value.trim(), e.target.unidad.value, e.target.cantidadUni.value, e.target.precioXUni.value);
                }}
              >
                <div className="form-group-relative">
                  <input style={{ marginTop: 0 }} name="nombre" type="text" placeholder="Nombre (Ej: MercadoLibre)" defaultValue={serv.nombre} className="formulario" required />
                </div>
                <select name="unidad" defaultValue={serv.unidad} className="formulario" required>
                  <option value="">Selecciónar tipo costo</option>
                  <option value="Servicio Variable">% de venta</option>
                  <option value="Fijo por Ventas">Costo fijo por venta</option>
                </select>
                <div className="form-group-relative">
                  <input name="cantidadUni" type="number" step="any" placeholder="Cant. ventas aprox" defaultValue={serv.cantidadUni} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="precioXUni" type="number" step="any" placeholder="Costo por venta" defaultValue={serv.precioXUni} className="formulario" required />
                  <span className="help-icon" data-tooltip="Comisión o costo en dinero que pagás cada vez que vendés este producto.">?</span>
                </div>
                <button type="submit" className="bot-guardar" style={{ marginTop: 15 }}>Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className='agreProd' onClick={agregarServicio} disabled={isReadOnly}>+</button>
      </div>
    </>
  );
};
