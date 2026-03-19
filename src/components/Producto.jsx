import { useState } from "react";
import { StableCard } from "./UI/StableCard.jsx";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const findName = (arr, id, campo) =>
  arr.find(x => String(x.id) === String(id))?.[campo] ?? null;

const getLabels = (arr, ids, campo) =>
  (ids || []).map(id => findName(arr, id, campo)).filter(Boolean);

export const itemVacioProducto = () => ({
  id: String(Date.now()),
  nombre: "",
  precioVenta: "",
  gananciaDeseada: "",
  cantidad: "",
  materiaPrimasSeleccionadas: [],
  fijosSeleccionados: [],
  manoObraSeleccionada: [],
  manoVariableSeleccionada: [],
  impuestosSeleccionados: [],
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

/* ─── EditForm ──────────────────────────────────────────────────────────────── */
function EditForm({ producto, onGuardar, materiasPrimas, gastosFijos, manoObra, manoVariable, impuestos }) {
  const [selMP, setSelMP] = useState(producto.materiaPrimasSeleccionadas || []);
  const [selFijos, setSelFijos] = useState(producto.fijosSeleccionados || []);
  const [selMano, setSelMano] = useState(producto.manoObraSeleccionada || []);
  const [selServ, setSelServ] = useState(producto.manoVariableSeleccionada || []);
  const [selImp, setSelImp] = useState(producto.impuestosSeleccionados || []);

  const toggle = (set) => (id) =>
    set(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <form
      className="prod-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        onGuardar(producto.id, {
          id: producto.id,
          nombre: fd.get("nombre"),
          precioVenta: fd.get("precioVenta"),
          gananciaDeseada: fd.get("gananciaDeseada"),
          cantidad: fd.get("cantidad"),
          materiaPrimasSeleccionadas: selMP,
          fijosSeleccionados: selFijos,
          manoObraSeleccionada: selMano,
          manoVariableSeleccionada: selServ,
          impuestosSeleccionados: selImp,
          precioCosto: 0,
          guardado: false,
        });
      }}
    >
      <div className="form-group-relative">
        <input
          name="nombre" type="text" placeholder="Nombre (Ej: Torta de Chocolate)"
          defaultValue={producto.nombre} className="formulario" required
          style={{ marginTop: 0 }}
        />
      </div>
      <div className="form-group-relative">
        <input
          name="cantidad" type="number" step="any" placeholder="Unidades producidas / mes"
          defaultValue={producto.cantidad} className="formulario" required
        />
        <span className="help-icon" data-tooltip="Cuántas unidades de esto vas a producir y vender en el mes para diluir los gastos fijos.">?</span>
      </div>

      <div className="split-row">
        <div className="split-field">
          <input
            name="gananciaDeseada" type="number" step="any" placeholder="% Rentabilidad"
            defaultValue={producto.gananciaDeseada} className="formulario"
          />
          <span className="help-icon" data-tooltip="Opcional. Si ponés el % acá, el sistema calcula el precio de venta por vos.">?</span>
        </div>
        <div className="split-field">
          <input
            name="precioVenta" type="number" step="any" placeholder="Precio Final ($)"
            defaultValue={producto.precioVenta} className="formulario"
          />
          <span className="help-icon" data-tooltip="Opcional. Cuánto vas a cobrarle a tus clientes finales.">?</span>
        </div>
      </div>

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
        label="Servicios"
        items={manoVariable.filter(s => s.guardado)}
        selected={selServ} onToggle={toggle(setSelServ)} nameField="nombre"
      />
      <ChipGroup
        label="Impuestos"
        items={impuestos.filter(i => i.guardado)}
        selected={selImp} onToggle={toggle(setSelImp)} nameField="nombre"
      />

      <button type="submit" className="bot-guardar">Calcular y guardar</button>
    </form>
  );
}

/* ─── SavedView ────────────────────────────────────────────────────────────── */
function SavedView({ producto, onEditar, materiasPrimas, gastosFijos, manoObra, manoVariable, impuestos }) {
  const sections = [
    { label: "Mat. primas", ids: producto.materiaPrimasSeleccionadas, arr: materiasPrimas, campo: "nombre" },
    { label: "Gastos fijos", ids: producto.fijosSeleccionados, arr: gastosFijos, campo: "tipo" },
    { label: "Mano de obra", ids: producto.manoObraSeleccionada, arr: manoObra, campo: "area" },
    { label: "Servicios", ids: producto.manoVariableSeleccionada, arr: manoVariable, campo: "nombre" },
    { label: "Impuestos", ids: producto.impuestosSeleccionados, arr: impuestos, campo: "nombre" },
  ];

  return (
    <div className="producto-info">
      <h3 className="producto-nombre">{producto.nombre || "(sin nombre)"}</h3>
      <hr className="prod-divider" />
      <div className="info-row">
        <span className="info-label">Cantidad / mes</span>
        <span className="info-val">{producto.cantidad || 0} und.</span>
      </div>
      <div className="info-row">
        <span className="info-label">Margen ganancia</span>
        <span className="info-val">{producto.gananciaDeseada ? `${producto.gananciaDeseada}%` : "—"}</span>
      </div>
      <div className="info-row" style={{ marginTop: '8px', borderTop: '1px dashed rgba(239, 172, 59, 0.2)', paddingTop: '8px' }}>
        <span className="info-label" style={{ color: 'var(--light)' }}>Precio ideal/venta</span>
        <span className="info-val" style={{ fontSize: '18px' }}>${producto.precioVenta || 0}</span>
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

      {!producto.isReadOnly && (
        <button type="button" className="bot-guardar" onClick={() => onEditar(producto.id)}>
          Editar
        </button>
      )}
    </div>
  );
}

/* ─── ProductoCard ─────────────────────────────────────────────────────────── */
function ProductoCard({ producto, onGuardar, onEditar, onEliminar, materiasPrimas, gastosFijos, manoObra, manoVariable, impuestos, isReadOnly }) {
  return (
    <StableCard>
      {!isReadOnly && <button className="bot-eliminar" onClick={() => onEliminar(producto.id)}>✕</button>}
      {producto.guardado ? (
        <SavedView
          producto={{ ...producto, isReadOnly }} onEditar={onEditar}
          materiasPrimas={materiasPrimas} gastosFijos={gastosFijos}
          manoObra={manoObra} manoVariable={manoVariable}
          impuestos={impuestos}
        />
      ) : (
        <EditForm
          producto={producto} onGuardar={onGuardar}
          materiasPrimas={materiasPrimas} gastosFijos={gastosFijos}
          manoObra={manoObra} manoVariable={manoVariable}
          impuestos={impuestos}
        />
      )}
    </StableCard>
  );
}

/* ─── Producto (componente raíz de la sección) ─────────────────────────────── */
export const Producto = ({
  productos = [],
  setProductos,
  materiasPrimas = [],
  gastosFijos = [],
  manoObra = [],
  manoVariable = [],
  impuestos = [],
  isReadOnly,
  onRequireLogin
}) => {

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

    const precioVenta = parseFloat(data.precioVenta) || 0;
    (data.impuestosSeleccionados || []).forEach(id => {
      const imp = impuestos.find(i => String(i.id) === String(id));
      if (imp) {
        const v = (parseFloat(imp.porcentaje) / 100) * precioVenta;
        costo += isNaN(v) ? 0 : v;
      }
    });

    return parseFloat(costo.toFixed(2));
  };

  const guardarProducto = (id, data) => {
    if (onRequireLogin && onRequireLogin()) return;
    const cantidad = parseFloat(data.cantidad) || 1;
    const precioCosto = calcularPrecioCosto(data, cantidad);

    // Calcular ganancia / precio venta automático
    let pVenta = parseFloat(data.precioVenta);
    const gDeseada = parseFloat(data.gananciaDeseada);

    // Si escribió un precio de venta manual, se respeta ese.
    // Pero si no puso precio de venta Y puso ganancia, se calcula solo.
    if (isNaN(pVenta) && !isNaN(gDeseada)) {
      pVenta = precioCosto * (1 + (gDeseada / 100));
    }

    // Limpiamos NaN a string vacío si la persona dejó todo vacío.
    const pVentaFinal = isNaN(pVenta) ? "" : pVenta.toFixed(2);

    setProductos(prev => prev.map(p => p.id === id ? {
      ...data,
      precioCosto,
      precioVenta: pVentaFinal,
      guardado: true
    } : p));
  };

  const editarProducto = (id) => setProductos(prev => prev.map(p => p.id === id ? { ...p, guardado: false } : p));
  const eliminarProducto = (id) => setProductos(prev => prev.filter(p => p.id !== id));

  return (
    <>
      <h1 className="section-title">
        Productos
        <span className="help-icon" data-tooltip="Agregá tus productos finales aquí. Completá con sus recetas y asigná una cantidad estimada mensual para prorratear los costos fijos." style={{ width: '22px', height: '22px', fontSize: '14px', marginLeft: '12px' }}>?</span>
      </h1>
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
            impuestos={impuestos}
            isReadOnly={isReadOnly}
          />
        ))}
        <button className="agreProd" onClick={() => setProductos(prev => [...prev, itemVacioProducto()])} disabled={isReadOnly}>+</button>
      </div>
    </>
  );
};
