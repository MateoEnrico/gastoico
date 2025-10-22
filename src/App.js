import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [gastos, setGastos] = useState([])

  // Al cargar la página, si no hay productos, agregamos uno vacío
  useEffect(() => {
    if (productos.length === 0) {
      setProductos([{ id: Date.now(), nombre: '', precio: '', guardado: false }]);
    }
  }, []);

  // Agregar un nuevo producto vacío
  const agregarProducto = () => {
    setProductos([
      ...productos,
      { id: Date.now(), nombre: '', precio: '', guardado: false }
    ]);
  };

  // Guardar los datos de un producto
  const cargarProducto = (id, nombre, precio) => {
    setProductos(productos.map(p =>
      p.id === id ? { ...p, nombre, precio, guardado: true } : p
    ));
  };

  // Volver a modo edición
  const editarProducto = (id) => {
    setProductos(productos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  // -----------------------------GASTOS---------------------------------
  useEffect(() => {
    if (gastos.length === 0) {
      setGastos([{ id: Date.now(), area: '', costoXhora: '', guardado: false }]);
    }
  }, []);

  // Agregar un nuevo gasto vacío
  const agregarGasto = () => {
    setGastos([
      ...gastos,
      { id: Date.now(), area: '', costoXhora: '', guardado: false }
    ]);
  };

  // Guardar los datos de un gasto
  const cargarGasto = (id, area, costoXhora) => {
    setGastos(gastos.map(p =>
      p.id === id ? { ...p, area, costoXhora, guardado: true } : p
    ));
  };

  // Volver a modo edición
  const editarGasto = (id) => {
    setGastos(gastos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  // 🗑️ Eliminar gasto
  const eliminarGasto = (id) => {
    setGastos(gastos.filter(p => p.id !== id));
  };

  return (
    <div className="cuerpo">
      <header>
        <a href="" className='cont-logo'>
          <img src="/navbarLogo.png" alt="Logo Gastoico" className='logo' />
        </a>
        <a href='#productos' className='navbar'>Productos</a>
        <a href='#gastos-fijos' className='navbar'>Gastos fijos</a>
        <a href='#mano-obra' className='navbar'>Mano de obra</a>
        <a href='#materia-prima' className='navbar'>Materia prima</a>
        <a href='#impuestos' className='navbar'>Impuestos</a>
        <a href='#servicios' className='navbar'>Servicios</a>
        <a href="" className='cont-login'>
          <img src="/Login.png" alt="" className='login'/>
        </a>
      </header>

      <div className='contenido'>
        <section id="productos">
          <h1 className="section-title">Productos</h1>
          <div className='prod-container'>
            {productos.map((producto) => (
              <div key={producto.id} className='cont-prod'>
                
                {/* ❌ Botón para eliminar */}
                <button
                  className="bot-eliminar"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  ✖
                </button>

                {producto.guardado ? (
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre || "(sin nombre)"}</h3>
                    <p className="producto-data">${producto.precio || 0}</p>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" onClick={() => editarProducto(producto.id)} className="bot-guardar">
                        Editar
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="cont-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const nombre = e.target.nombre.value.trim();
                      const precio = e.target.precio.value;
                      cargarProducto(producto.id, nombre, precio);
                    }}
                  >
                    <input
                      name="nombre"
                      type="text"
                      placeholder="Nombre del producto"
                      defaultValue={producto.nombre}
                      className="formulario"
                    />
                    <input
                      name="precio"
                      type="number"
                      placeholder="Precio"
                      defaultValue={producto.precio}
                      className="formulario"
                    />
                    <button type="submit" className="bot-guardar">Guardar</button>
                  </form>
                )}
              </div>
            ))}
            <button className='agreProd' onClick={agregarProducto}>+</button>
          </div>
        </section>

        <section id="gastos-fijos">
          <h1 className="section-title">Gastos fijos</h1>
          <div className='prod-container'>
            {gastos.map((gasto) => (
              <div key={gasto.id} className='cont-prod'>
                
                {/* ❌ Botón para eliminar */}
                <button
                  className="bot-eliminar"
                  onClick={() => eliminarGasto(gasto.id)}
                >
                  ✖
                </button>

                {gasto.guardado ? (
                  <div className="producto-info">
                    <h3 className="producto-nombre">{gasto.area || "(sin área)"}</h3>
                    <p className="producto-data">${gasto.costoXhora || 0}</p>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" onClick={() => editarGasto(gasto.id)} className="bot-guardar">
                        Editar
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="cont-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const area = e.target.area.value.trim();
                      const costoXhora = e.target.costoXhora.value;
                      cargarGasto(gasto.id, area, costoXhora);
                    }}
                  >
                    <input
                      name="area"
                      type="text"
                      placeholder="Área"
                      defaultValue={gasto.area}
                      className="formulario"
                    />
                    <input
                      name="costoXhora"
                      type="number"
                      placeholder="Costo por hora"
                      defaultValue={gasto.costoXhora}
                      className="formulario"
                    />
                    <button type="submit" className="bot-guardar">Guardar</button>
                  </form>
                )}
              </div>
            ))}
            <button className='agreProd' onClick={agregarGasto}>+</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
