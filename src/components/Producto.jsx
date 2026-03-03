import { useState } from "react";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const findName = (arr, id, campo) =>
  arr.find(x => String(x.id) === String(id))?.[campo] ?? null;

const getLabels = (arr, ids, campo) =>
  (ids || []).map(id => findName(arr, id, campo)).filter(Boolean);

const itemVacio = () => ({
  id: Date.now(),
  nombre: "",
  precioVenta: "",
  cantidad: "",
  materiaPrimasSeleccionadas: [],
  fijosSeleccionados: [],
  manoObraSeleccionada: [],
  manoVariableSeleccionada: [],
  precioCosto: 0,
  guardado: false,
});

/* ─── ChipGroup ────────────────────────────────────────────────────────────── */
function ChipGroup({ label, items, selected, onToggle, nameField }) {
  return (
    <div className="chip-group">
      <span className="chip-label">{label}</span>
      <div className="chip-wrap">
        {items.length === 0 ? (
          <span className="chip-empty">Sin items guardados</span>
        ) : (
          items.map(item => {
            const id = String(item.id);
            return (
              <button
                key={id}
                type="button"
                className={`chip${selected.includes(id) ? " chip-on" : ""}`}
                onClick={() => onToggle(id)}
              >
                {item[nameField]}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─── EditForm (se desmonta al guardar → estado se resetea naturalmente) ───── */
function EditForm({ producto, onGuardar, materiasPrimas, gastosFijos, manoObra, manoVariable }) {
  const [selMP,    setSelMP]    = useState(producto.materiaPrimasSeleccionadas || []);
  const [selFijos, setSelFijos] = useState(producto.fijosSeleccionados        || []);
  const [selMano,  setSelMano]  = useState(producto.manoObraSeleccionada      || []);
  const [selServ,  setSelServ]  = useState(producto.manoVariableSeleccionada  || []);

  const toggle = (set) => (id) =>
    set(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <form
      className="prod-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        onGuardar(producto.id, {
          id:                         producto.id,
          nombre:                     fd.get("nombre"),
          precioVenta:                fd.get("precioVenta"),
          cantidad:                   fd.get("cantidad"),
          materiaPrimasSeleccionadas: selMP,
          fijosSeleccionados:         selFijos,
          manoObraSeleccionada:       selMano,
          manoVariableSeleccionada:   selServ,
          precioCosto:                0,
          guardado:                   false,
        });
      }}
    >
      <input
        name="nombre" type="text" placeholder="Nombre del producto"
        defaultValue={producto.nombre} className="formulario"
        style={{ marginTop: 0 }}
      />
      <input
        name="precioVenta" type="number" placeholder="Precio de venta ($)"
        defaultValue={producto.precioVenta} className="formulario"
      />
      <input
        name="cantidad" type="number" placeholder="Unidades producidas / mes"
        defaultValue={producto.cantidad} className="formulario"
      />

      <ChipGroup
        label="Materias primas"
        items={materiasPrimas.filter(mp => mp.guardado)}
        selected={selMP} onToggle={toggle(setSelMP)} nameField="nombre"
      />
      <ChipGroup
        label="Gastos fijos"
        items={gastosFijos.filter(g => g.guardado)}
        selected={selFijos} onToggle={toggle(setSelFijos)} nameField="tipo"
      />
      <ChipGroup
        label="Mano de obra"
        items={manoObra.filter(m => m.guardado)}
        selected={selMano} onToggle={toggle(setSelMano)} nameField="area"
      />
      <ChipGroup
        label="Mano variable / Servicios"
        items={manoVariable.filter(s => s.guardado)}
        selected={selServ} onToggle={toggle(setSelServ)} nameField="nombre"
      />

      <button type="submit" className="bot-guardar">Calcular y guardar</button>
    </form>
  );
}

/* ─── SavedView ────────────────────────────────────────────────────────────── */
function SavedView({ producto, onEditar, materiasPrimas, gastosFijos, manoObra, manoVariable }) {
  const sections = [
    { label: "Mat. primas",  ids: producto.materiaPrimasSeleccionadas, arr: materiasPrimas, campo: "nombre" },
    { label: "Gastos fijos", ids: producto.fijosSeleccionados,         arr: gastosFijos,   campo: "tipo"   },
    { label: "Mano de obra", ids: producto.manoObraSeleccionada,       arr: manoObra,      campo: "area"   },
    { label: "M. variable",  ids: producto.manoVariableSeleccionada,   arr: manoVariable,  campo: "nombre" },
  ];

  return (
    <div className="producto-info">
      <h3 className="producto-nombre">{producto.nombre || "(sin nombre)"}</h3>
      <hr className="prod-divider" />

      <div className="info-row">
        <span className="info-label">Precio venta</span>
        <span className="info-val">${producto.precioVenta || 0}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Cantidad / mes</span>
        <span className="info-val">{producto.cantidad || 0} und.</span>
      </div>

      {sections.map(({ label, ids, arr, campo }) => {
        const names = getLabels(arr, ids, campo);
        if (names.length === 0) return null;
        return (
          <div key={label} className="info-section">
            <p className="info-section-label">{label}</p>
            <div className="info-pills-row">
              {names.map(name => (
                <span key={name} className="info-pill">{name}</span>
              ))}
            </div>
          </div>
        );
      })}

      <div className="info-costo">
        <span className="info-costo-label">Precio costo</span>
        <span className="info-costo-value">${producto.precioCosto}</span>
      </div>

      <button type="button" className="bot-guardar" onClick={() => onEditar(producto.id)}>
        Editar
      </button>
    </div>
  );
}

/* ─── ProductoCard ─────────────────────────────────────────────────────────── */
function ProductoCard({ producto, onGuardar, onEditar, onEliminar, materiasPrimas, gastosFijos, manoObra, manoVariable }) {
  return (
    <div className="cont-prod">
      <button className="bot-eliminar" onClick={() => onEliminar(producto.id)}>✕</button>
      {producto.guardado ? (
        <SavedView
          producto={producto} onEditar={onEditar}
          materiasPrimas={materiasPrimas} gastosFijos={gastosFijos}
          manoObra={manoObra} manoVariable={manoVariable}
        />
      ) : (
        <EditForm
          producto={producto} onGuardar={onGuardar}
          materiasPrimas={materiasPrimas} gastosFijos={gastosFijos}
          manoObra={manoObra} manoVariable={manoVariable}
        />
      )}
    </div>
  );
}

/* ─── Producto (componente raíz de la sección) ─────────────────────────────── */
export const Producto = ({
  materiasPrimas = [],
  gastosFijos    = [],
  manoObra       = [],
  manoVariable   = [],
}) => {
  const [productos, setProductos] = useState([itemVacio()]);

  const calcularPrecioCosto = (data, cantidad) => {
    let costo = 0;

    (data.materiaPrimasSeleccionadas || []).forEach(id => {
      const mp = materiasPrimas.find(m => String(m.id) === String(id));
      if (mp) {
        const v = parseFloat(mp.precioXPaquete) / parseFloat(mp.unidadesXPaquete);
        costo += isNaN(v) ? 0 : v;
      }
    });

    (data.fijosSeleccionados || []).forEach(id => {
      const g = gastosFijos.find(g => String(g.id) === String(id));
      if (g) {
        const v = parseFloat(g.precio) / cantidad;
        costo += isNaN(v) ? 0 : v;
      }
    });

    (data.manoObraSeleccionada || []).forEach(id => {
      const m = manoObra.find(m => String(m.id) === String(id));
      if (m) {
        const v = (parseFloat(m.empleados) * parseFloat(m.cantDias) * parseFloat(m.cantHoras) * parseFloat(m.costoXhora) * 4) / cantidad;
        costo += isNaN(v) ? 0 : v;
      }
    });

    (data.manoVariableSeleccionada || []).forEach(id => {
      const s = manoVariable.find(s => String(s.id) === String(id));
      if (s) {
        const v = (parseFloat(s.cantidadUni) * parseFloat(s.precioXUni)) / cantidad;
        costo += isNaN(v) ? 0 : v;
      }
    });

    return parseFloat(costo.toFixed(2));
  };

  const guardarProducto = (id, data) => {
    const cantidad     = parseFloat(data.cantidad) || 1;
    const precioCosto  = calcularPrecioCosto(data, cantidad);
    setProductos(prev => prev.map(p => p.id === id ? { ...data, precioCosto, guardado: true } : p));
  };

  const editarProducto  = (id) => setProductos(prev => prev.map(p => p.id === id ? { ...p, guardado: false } : p));
  const eliminarProducto = (id) => setProductos(prev => prev.filter(p => p.id !== id));

  return (
    <>
      <h1 className="section-title">Productos</h1>
      <div className="prod-container">
        {productos.map(producto => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            onGuardar={guardarProducto}
            onEditar={editarProducto}
            onEliminar={eliminarProducto}
            materiasPrimas={materiasPrimas}
            gastosFijos={gastosFijos}
            manoObra={manoObra}
            manoVariable={manoVariable}
          />
        ))}
        <button className="agreProd" onClick={() => setProductos(prev => [...prev, itemVacio()])}>+</button>
      </div>
    </>
  );
};
