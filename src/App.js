import { useState, useEffect, useRef } from "react";
import './App.css';
import { supabase }       from './supabase.js';
import { Navbar }         from "./components/UI/Navbar.jsx";
import { ParticleCanvas } from "./components/UI/ParticleCanvas.jsx";
import { Producto, itemVacioProducto } from './components/Producto.jsx';
import { Gasto }          from "./components/Gasto.jsx";
import { ManoObra }       from "./components/Mano-obra.jsx";
import { MateriaPrima }   from "./components/Materia-prima.jsx";
import { Impuestos }      from "./components/Impuesto.jsx";
import { Servicios }      from "./components/Servicio.jsx";

/* ─── Estado inicial (modo offline o antes de cargar datos del user) ─────── */
const defaultGasto = () => ({ id: String(Date.now()),     tipo: '', mes: '', precio: '', guardado: false });
const defaultMano  = () => ({ id: String(Date.now() + 1), area: '', costoXhora: '', cantHoras: '', cantDias: '', empleados: '', guardado: false });
const defaultMP    = () => ({ id: String(Date.now() + 2), tipo: '', nombre: '', unidadesXPaquete: '', tipoUnidad: '', precioXPaquete: '', cantidadPaquetes: '', guardado: false });
const defaultServ  = () => ({ id: String(Date.now() + 3), nombre: '', unidad: '', cantidadUni: '', precioXUni: '', guardado: false });
const defaultImp   = () => ({ id: String(Date.now() + 4), nombre: '', porcentaje: '', guardado: false });

/* ─── Conversiones React (camelCase) ↔ Supabase (snake_case) ────────────── */
const toGastoRow  = (i, u) => ({ id: String(i.id), user_id: u, tipo: i.tipo, mes: i.mes, precio: parseFloat(i.precio) || 0, guardado: i.guardado });
const fromGastoRow = r => ({ id: r.id, tipo: r.tipo ?? '', mes: r.mes ?? '', precio: String(r.precio ?? ''), guardado: r.guardado ?? false });

const toManoRow   = (i, u) => ({ id: String(i.id), user_id: u, area: i.area, costo_x_hora: parseFloat(i.costoXhora) || 0, cant_horas: parseFloat(i.cantHoras) || 0, cant_dias: parseFloat(i.cantDias) || 0, empleados: parseFloat(i.empleados) || 0, guardado: i.guardado });
const fromManoRow = r => ({ id: r.id, area: r.area ?? '', costoXhora: String(r.costo_x_hora ?? ''), cantHoras: String(r.cant_horas ?? ''), cantDias: String(r.cant_dias ?? ''), empleados: String(r.empleados ?? ''), guardado: r.guardado ?? false });

const toMPRow     = (i, u) => ({ id: String(i.id), user_id: u, tipo: i.tipo, nombre: i.nombre, unidades_x_paquete: parseFloat(i.unidadesXPaquete) || 0, tipo_unidad: i.tipoUnidad, precio_x_paquete: parseFloat(i.precioXPaquete) || 0, cantidad_paquetes: parseFloat(i.cantidadPaquetes) || 0, guardado: i.guardado });
const fromMPRow   = r => ({ id: r.id, tipo: r.tipo ?? '', nombre: r.nombre ?? '', unidadesXPaquete: String(r.unidades_x_paquete ?? ''), tipoUnidad: r.tipo_unidad ?? '', precioXPaquete: String(r.precio_x_paquete ?? ''), cantidadPaquetes: String(r.cantidad_paquetes ?? ''), guardado: r.guardado ?? false });

const toServRow   = (i, u) => ({ id: String(i.id), user_id: u, nombre: i.nombre, unidad: i.unidad, cantidad_uni: parseFloat(i.cantidadUni) || 0, precio_x_uni: parseFloat(i.precioXUni) || 0, guardado: i.guardado });
const fromServRow = r => ({ id: r.id, nombre: r.nombre ?? '', unidad: r.unidad ?? '', cantidadUni: String(r.cantidad_uni ?? ''), precioXUni: String(r.precio_x_uni ?? ''), guardado: r.guardado ?? false });

const toImpRow    = (i, u) => ({ id: String(i.id), user_id: u, nombre: i.nombre, porcentaje: parseFloat(i.porcentaje) || 0, guardado: i.guardado });
const fromImpRow  = r => ({ id: r.id, nombre: r.nombre ?? '', porcentaje: String(r.porcentaje ?? ''), guardado: r.guardado ?? false });

const toProdRow   = (i, u) => ({ id: String(i.id), user_id: u, nombre: i.nombre, precio_venta: parseFloat(i.precioVenta) || 0, cantidad: parseFloat(i.cantidad) || 0, materias_primas_seleccionadas: i.materiaPrimasSeleccionadas ?? [], fijos_seleccionados: i.fijosSeleccionados ?? [], mano_obra_seleccionada: i.manoObraSeleccionada ?? [], mano_variable_seleccionada: i.manoVariableSeleccionada ?? [], impuestos_seleccionados: i.impuestosSeleccionados ?? [], precio_costo: i.precioCosto || 0, guardado: i.guardado });
const fromProdRow = r => ({ id: r.id, nombre: r.nombre ?? '', precioVenta: String(r.precio_venta ?? ''), cantidad: String(r.cantidad ?? ''), materiaPrimasSeleccionadas: r.materias_primas_seleccionadas ?? [], fijosSeleccionados: r.fijos_seleccionados ?? [], manoObraSeleccionada: r.mano_obra_seleccionada ?? [], manoVariableSeleccionada: r.mano_variable_seleccionada ?? [], impuestosSeleccionados: r.impuestos_seleccionados ?? [], precioCosto: r.precio_costo || 0, guardado: r.guardado ?? false });

/* ─── Sync fire-and-forget ────────────────────────────────────────────────── */
const syncChange = (table, toRow, prev, next, userId) => {
  if (!supabase) return;
  prev.forEach(item => {
    if (!next.find(n => String(n.id) === String(item.id)))
      supabase.from(table).delete().eq('id', String(item.id)).then();
  });
  next.forEach(item => {
    const old = prev.find(p => String(p.id) === String(item.id));
    if (!old || JSON.stringify(old) !== JSON.stringify(item))
      supabase.from(table).upsert(toRow(item, userId)).then();
  });
};

/* ─── App ─────────────────────────────────────────────────────────────────── */
function App() {
  const [session,        setSession]   = useState(null);
  const sessionRef                     = useRef(null);

  const [gastos,         setGastosBase]  = useState([defaultGasto()]);
  const [manos,          setManosBase]   = useState([defaultMano()]);
  const [materiasPrimas, setMPBase]      = useState([defaultMP()]);
  const [servicios,      setServBase]    = useState([defaultServ()]);
  const [impuestos,      setImpBase]     = useState([defaultImp()]);
  const [productos,      setProdBase]    = useState([itemVacioProducto()]);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      sessionRef.current = session;
      if (session) loadUserData(session.user.id);
    });
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      sessionRef.current = session;
      if (session) {
        loadUserData(session.user.id);
      } else {
        setGastosBase([defaultGasto()]);
        setManosBase([defaultMano()]);
        setMPBase([defaultMP()]);
        setServBase([defaultServ()]);
        setImpBase([defaultImp()]);
        setProdBase([itemVacioProducto()]);
      }
    }) ?? { data: { subscription: null } };
    return () => subscription?.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async (userId) => {
    if (!supabase) return;
    const [gR, mR, mpR, sR, iR, pR] = await Promise.all([
      supabase.from('gastos').select('*').eq('user_id', userId),
      supabase.from('manos_obra').select('*').eq('user_id', userId),
      supabase.from('materias_primas').select('*').eq('user_id', userId),
      supabase.from('servicios').select('*').eq('user_id', userId),
      supabase.from('impuestos').select('*').eq('user_id', userId),
      supabase.from('productos').select('*').eq('user_id', userId),
    ]);
    if (gR.data?.length)  setGastosBase(gR.data.map(fromGastoRow));
    if (mR.data?.length)  setManosBase(mR.data.map(fromManoRow));
    if (mpR.data?.length) setMPBase(mpR.data.map(fromMPRow));
    if (sR.data?.length)  setServBase(sR.data.map(fromServRow));
    if (iR.data?.length)  setImpBase(iR.data.map(fromImpRow));
    if (pR.data?.length)  setProdBase(pR.data.map(fromProdRow));
  };

  /* Wrappers con sync automático */
  const setGastos = u => { const n = typeof u === 'function' ? u(gastos) : u; setGastosBase(n); if (sessionRef.current) syncChange('gastos', toGastoRow, gastos, n, sessionRef.current.user.id); };
  const setManos  = u => { const n = typeof u === 'function' ? u(manos)  : u; setManosBase(n);  if (sessionRef.current) syncChange('manos_obra', toManoRow, manos, n, sessionRef.current.user.id); };
  const setMateriasPrimas = u => { const n = typeof u === 'function' ? u(materiasPrimas) : u; setMPBase(n); if (sessionRef.current) syncChange('materias_primas', toMPRow, materiasPrimas, n, sessionRef.current.user.id); };
  const setServicios = u => { const n = typeof u === 'function' ? u(servicios) : u; setServBase(n); if (sessionRef.current) syncChange('servicios', toServRow, servicios, n, sessionRef.current.user.id); };
  const setImpuestos = u => { const n = typeof u === 'function' ? u(impuestos) : u; setImpBase(n); if (sessionRef.current) syncChange('impuestos', toImpRow, impuestos, n, sessionRef.current.user.id); };
  const setProductos = u => { const n = typeof u === 'function' ? u(productos) : u; setProdBase(n); if (sessionRef.current) syncChange('productos', toProdRow, productos, n, sessionRef.current.user.id); };

  return (
    <div className="cuerpo">
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob a1" />
        <div className="aurora-blob a2" />
        <div className="aurora-blob a3" />
      </div>

      <ParticleCanvas />
      <Navbar session={session} />

      <div className="contenido">
        <section id="productos">
          <Producto
            productos={productos} setProductos={setProductos}
            materiasPrimas={materiasPrimas} gastosFijos={gastos}
            manoObra={manos} manoVariable={servicios}
            impuestos={impuestos}
          />
        </section>
        <section id="materia-prima">
          <MateriaPrima materiasPrimas={materiasPrimas} setMateriasPrimas={setMateriasPrimas} />
        </section>
        <section id="gastos-fijos">
          <Gasto gastos={gastos} setGastos={setGastos} />
        </section>
        <section id="mano-obra">
          <ManoObra manos={manos} setManos={setManos} />
        </section>
        <section id="servicios">
          <Servicios servicios={servicios} setServicios={setServicios} />
        </section>
        <section id="impuestos">
          <Impuestos impuestos={impuestos} setImpuestos={setImpuestos} />
        </section>
      </div>

      <footer>
        <div className="footer-brand">
          <span className="footer-name">Gastoico</span>
          <span className="footer-tagline">Calculá el costo real de tu producto</span>
        </div>
        <nav className="footer-nav">
          <a href="#productos"     className="footer-link">Productos</a>
          <a href="#materia-prima" className="footer-link">Materia prima</a>
          <a href="#gastos-fijos"  className="footer-link">Gastos fijos</a>
          <a href="#mano-obra"     className="footer-link">Mano de obra</a>
          <a href="#servicios"     className="footer-link">Servicios</a>
          <a href="#impuestos"     className="footer-link">Impuestos</a>
        </nav>
        <div className="footer-copy">
          <span>contacto@gastoico.com</span>
          <span>© 2026 Gastoico</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
