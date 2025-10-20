import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);

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

  return (
    <div>
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
          <img src="/Login.png" alt="" className='login'/> Iniciar Sesión 
        </a>
      </header>

      <div className='contenido'>
        <section id="productos">
          <h1>Productos</h1>

          <div className='prod-container'>
            {productos.map((producto) => (
              <div key={producto.id} className='cont-prod'>
                {producto.guardado ? (
                  <div className="producto-info">
                    <h3>{producto.nombre || "(sin nombre)"}</h3>
                    <p>${producto.precio || 0}</p>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" onClick={() => editarProducto(producto.id)}>
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
      </div>
    </div>
  );
}

export default App;
