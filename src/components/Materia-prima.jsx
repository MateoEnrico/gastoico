import { useState } from "react";
import { StableCard } from "./UI/StableCard.jsx";

export const MateriaPrima = ({ materiasPrimas, setMateriasPrimas, isReadOnly, onRequireLogin }) => {
  const [globalPercent, setGlobalPercent] = useState("");

  const agregarMateriaPrima = () => {
    setMateriasPrimas([...materiasPrimas, {
      id: Date.now(), tipo: '', nombre: '', unidadesXPaquete: '', tipoUnidad: '', precioXPaquete: '', cantidadPaquetes: '', guardado: false
    }]);
  };

  const cargarMateriaPrima = (id, tipo, nombre, unidadesXPaquete, tipoUnidad, precioXPaquete, cantidadPaquetes) => {
    if (onRequireLogin && onRequireLogin()) return;
    setMateriasPrimas(materiasPrimas.map(p =>
      p.id === id ? { ...p, tipo, nombre, unidadesXPaquete, tipoUnidad, precioXPaquete, cantidadPaquetes, guardado: true } : p
    ));
  };

  const editarMateriaPrima = (id) => {
    setMateriasPrimas(materiasPrimas.map(p => p.id === id ? { ...p, guardado: false } : p));
  };

  const eliminarMateriaPrima = (id) => {
    setMateriasPrimas(materiasPrimas.filter(p => p.id !== id));
  };

  const aplicarAumentoGlobal = () => {
    const porcentaje = parseFloat(globalPercent);
    if (isNaN(porcentaje) || porcentaje === 0) return;
    const factor = 1 + (porcentaje / 100);

    setMateriasPrimas(materiasPrimas.map(p => {
      if (!p.guardado) return p;
      const nuevoPrecio = parseFloat(p.precioXPaquete) * factor;
      return { ...p, precioXPaquete: nuevoPrecio.toFixed(2) };
    }));
    setGlobalPercent("");
  };

  return (
    <>
      <h1 className="section-title">
        Materias primas
        <span className="help-icon" data-tooltip="Cargá acá todos los ingredientes e insumos que uses. Luego podrás armar las recetas de tus productos." style={{ width: '22px', height: '22px', fontSize: '14px', marginLeft: '12px' }}>?</span>
      </h1>

      {!isReadOnly && materiasPrimas.some(mp => mp.guardado) && (
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

      <div className="prod-container">
        {materiasPrimas.map((mp) => (
          <StableCard key={mp.id}>
            {!isReadOnly && <button className="bot-eliminar" onClick={() => eliminarMateriaPrima(mp.id)}>✖</button>}

            {mp.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{mp.nombre || "(sin nombre)"}</h3>
                <hr className="prod-divider" />
                <div className="info-row">
                  <span className="info-label">Tipo</span>
                  <span className="info-val">{mp.tipo || "—"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Unidades / paquete</span>
                  <span className="info-val">{mp.unidadesXPaquete || 0} {mp.tipoUnidad || ""}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Precio paquete</span>
                  <span className="info-val">${mp.precioXPaquete || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Cant. paquetes</span>
                  <span className="info-val">{mp.cantidadPaquetes || 0}</span>
                </div>
                <div className="info-costo">
                  <span className="info-costo-label">Costo por unidad</span>
                  <span className="info-costo-value">${mp.unidadesXPaquete ? parseFloat((mp.precioXPaquete / mp.unidadesXPaquete).toFixed(2)) : 0}</span>
                </div>
                {!isReadOnly && <button type="button" onClick={() => editarMateriaPrima(mp.id)} className="bot-guardar">Editar</button>}
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  cargarMateriaPrima(mp.id, e.target.tipo.value, e.target.nombre.value.trim(), e.target.unidadesXPaquete.value, e.target.tipoUnidad.value, e.target.precioXPaquete.value, e.target.cantidadPaquetes.value);
                }}
              >
                <div className="form-group-relative">
                  <input style={{ marginTop: 0 }} name="nombre" type="text" placeholder="Nombre (Ej: Harina)" defaultValue={mp.nombre} className="formulario" required />
                </div>
                <div className="form-group-relative">
                  <input name="tipo" type="text" placeholder="Tipo (Ej: Secos)" defaultValue={mp.tipo} className="formulario" />
                </div>
                <div className="form-group-relative">
                  <input name="unidadesXPaquete" type="number" step="any" placeholder="Unidades por paquete" defaultValue={mp.unidadesXPaquete} className="formulario" required />
                  <span className="help-icon" data-tooltip="Ej: Si compraste un cajón de 30 huevos, poné 30. Si es 1 kilo, poné 1000 y en unidad elegí gramos.">?</span>
                </div>
                <select name="tipoUnidad" defaultValue={mp.tipoUnidad} className="formulario" required>
                  <option value="">Seleccionar unidad</option>
                  <option value="Toneladas">Toneladas</option>
                  <option value="Kilos">Kilos</option>
                  <option value="Miligramos">Miligramos</option>
                  <option value="Litros">Litros</option>
                  <option value="Mililitros">Mililitros</option>
                  <option value="Unidades">Unidades</option>
                </select>
                <div className="form-group-relative">
                  <input name="precioXPaquete" type="number" step="any" placeholder="Precio total del paquete" defaultValue={mp.precioXPaquete} className="formulario" required />
                  <span className="help-icon" data-tooltip="Cuánto pagaste en total por este insumo o paquete.">?</span>
                </div>
                <div className="form-group-relative">
                  <input name="cantidadPaquetes" type="number" step="any" placeholder="Paquetes en stock (Opcional)" defaultValue={mp.cantidadPaquetes} className="formulario" />
                </div>
                <button type="submit" className="bot-guardar" style={{ marginTop: 15 }}>Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className="agreProd" onClick={agregarMateriaPrima} disabled={isReadOnly}>+</button>
      </div>
    </>
  );
};
