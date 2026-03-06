import { StableCard } from "./UI/StableCard.jsx";

export const MateriaPrima = ({ materiasPrimas, setMateriasPrimas }) => {

  const agregarMateriaPrima = () => {
    setMateriasPrimas([...materiasPrimas, {
      id: Date.now(), tipo: '', nombre: '', unidadesXPaquete: '', tipoUnidad: '', precioXPaquete: '', cantidadPaquetes: '', guardado: false
    }]);
  };

  const cargarMateriaPrima = (id, tipo, nombre, unidadesXPaquete, tipoUnidad, precioXPaquete, cantidadPaquetes) => {
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

  return (
    <>
      <h1 className="section-title">Materias primas</h1>
      <div className="prod-container">
        {materiasPrimas.map((mp) => (
          <StableCard key={mp.id}>
            <button className="bot-eliminar" onClick={() => eliminarMateriaPrima(mp.id)}>✖</button>

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
                <button type="button" onClick={() => editarMateriaPrima(mp.id)} className="bot-guardar">Editar</button>
              </div>
            ) : (
              <form className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  cargarMateriaPrima(mp.id, e.target.tipo.value, e.target.nombre.value.trim(), e.target.unidadesXPaquete.value, e.target.tipoUnidad.value, e.target.precioXPaquete.value, e.target.cantidadPaquetes.value);
                }}
              >
                <input style={{ marginTop: 0 }} name="nombre" type="text" placeholder="Nombre" defaultValue={mp.nombre} className="formulario" />
                <input name="tipo" type="text" placeholder="Tipo" defaultValue={mp.tipo} className="formulario" />
                <input name="unidadesXPaquete" type="number" placeholder="Unidades por paquete" defaultValue={mp.unidadesXPaquete} className="formulario" />
                <select name="tipoUnidad" defaultValue={mp.tipoUnidad} className="formulario">
                  <option value="">Seleccionar unidad</option>
                  <option value="Toneladas">Toneladas</option>
                  <option value="Kilos">Kilos</option>
                  <option value="Miligramos">Miligramos</option>
                  <option value="Litros">Litros</option>
                  <option value="Mililitros">Mililitros</option>
                  <option value="Unidades">Unidades</option>
                </select>
                <input name="precioXPaquete" type="number" placeholder="Precio" defaultValue={mp.precioXPaquete} className="formulario" />
                <input name="cantidadPaquetes" type="number" placeholder="Cantidad de paquetes" defaultValue={mp.cantidadPaquetes} className="formulario" />
                <button type="submit" className="bot-guardar" style={{ marginTop: 15 }}>Guardar</button>
              </form>
            )}
          </StableCard>
        ))}
        <button className="agreProd" onClick={agregarMateriaPrima}>+</button>
      </div>
    </>
  );
};
