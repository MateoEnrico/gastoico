import React, { useState, useEffect } from "react";

export const Producto = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (productos.length === 0) {
      setProductos([{ id: Date.now(), nombre: '', precio: 0, guardado: false }]);
    }
  }, []);

  const agregarProducto = () => {
    setProductos([
      ...productos,
      { id: Date.now(), nombre: '', precio: 0, guardado: false }
    ]);
  };

  const cargarProducto = (id, nombre, precio) => {
    setProductos(productos.map(p =>
      p.id === id ? { ...p, nombre, precio: Number(precio) || 0, guardado: true } : p
    ));
  };

  const editarProducto = (id) => {
    setProductos(productos.map(p =>
      p.id === id ? { ...p, guardado: false } : p
    ));
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Productos</h1>
      <div className='prod-container'>
        {productos.map((producto) => (
          <div key={producto.id} className='cont-prod'>
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
    </>
  );
}
