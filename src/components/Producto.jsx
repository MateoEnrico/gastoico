import React, { useState, useEffect } from "react";

export const Producto = ({
  materiasPrimas = [],
  gastosFijos = [],
  manoObra = [],
  manoVariable = []
}) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (productos.length === 0) {
      setProductos([{
        id: Date.now(),
        nombre: '',
        precioVenta: '',
        cantidad: '',
        materiaPrimaXUnidad: '',
        fijos: '',
        manoObra: '',
        manoVariable: '',
        precioCosto: 0,
        guardado: false
      }]);
    }
  }, []);

  const agregarProducto = () => {
    setProductos([
      ...productos,
      {
        id: Date.now(),
        nombre: '',
        precioVenta: '',
        cantidad: '',
        materiaPrimaXUnidad: '',
        fijos: '',
        manoObra: '',
        manoVariable: '',
        precioCosto: 0,
        guardado: false
      }
    ]);
  };

  const guardarProducto = (id, data) => {
    let costo = 0;
    if(data.materiaPrimaXUnidad) {
      const match = data.materiaPrimaXUnidad.match(/\[(.*?)\]/);
      const cantidad = match ? parseFloat(match[1]) : 0;
      costo += cantidad;
    }

    setProductos(productos.map(p =>
      p.id === id ? { ...data, precioCosto: costo, guardado: true } : p
    ));
  };

  const editarProducto = (id) => {
    setProductos(productos.map(p => p.id === id ? { ...p, guardado: false } : p));
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Productos</h1>
      <div className="prod-container">
        {productos.map(producto => (
          <div key={producto.id} className="cont-prod" style={{height: "535px"}}>

            <button className="bot-eliminar" onClick={() => eliminarProducto(producto.id)}>✖</button>

            {producto.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">{producto.nombre || "(sin nombre)"}</h3>
                <p className="producto-data">Precio venta: ${producto.precioVenta || 0}</p>
                <p className="producto-data">Cantidad: {producto.cantidad || 0}</p>
                <p className="producto-data">Materia prima: {producto.materiaPrimaXUnidad || "(vacío)"}</p>
                <p className="producto-data">Fijos: {producto.fijos || "(vacío)"}</p>
                <p className="producto-data">Mano de obra: {producto.manoObra || "(vacío)"}</p>
                <p className="producto-data">Mano variable: {producto.manoVariable || "(vacío)"}</p>
                <p className="producto-data">Precio costo: ${producto.precioCosto}</p>
                <button type="button" onClick={() => editarProducto(producto.id)} className="bot-guardar">Editar</button>
              </div>
            ) : (
              <form className="cont-form" onSubmit={(e) => {
                e.preventDefault();
                const data = {
                  id: producto.id,
                  nombre: e.target.nombre.value,
                  precioVenta: e.target.precioVenta.value,
                  cantidad: e.target.cantidad.value,
                  materiaPrimaXUnidad: e.target.materiaPrimaXUnidad.value,
                  fijos: e.target.fijos.value,
                  manoObra: e.target.manoObra.value,
                  manoVariable: e.target.manoVariable.value,
                  precioCosto: producto.precioCosto,
                  guardado: false
                };
                guardarProducto(producto.id, data);
              }}>
                <input name="nombre" type="text" placeholder="Nombre" defaultValue={producto.nombre} className="formulario" style={{marginTop: "0px"}}/>
                <input name="precioVenta" type="number" placeholder="Precio de venta" defaultValue={producto.precioVenta} className="formulario" />
                <input name="cantidad" type="number" placeholder="Cantidad" defaultValue={producto.cantidad} className="formulario" />

                <select name="materiaPrimaXUnidad" defaultValue={producto.materiaPrimaXUnidad || "Materia prima"} className="formulario">
                  <option disabled>Materia prima</option>
                  {materiasPrimas.map(mp => (
                    <option key={mp} value={mp}>{mp}</option>
                  ))}
                </select>

                <select name="fijos" defaultValue={producto.fijos || "Fijo"} className="formulario">
                  <option disabled>Fijo</option>
                  {gastosFijos.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>

                <select name="manoObra" defaultValue={producto.manoObra || "Mano de obra"} className="formulario">
                  <option disabled>Mano de obra</option>
                  {manoObra.map(mo => (
                    <option key={mo} value={mo}>{mo}</option>
                  ))}
                </select>

                <select name="manoVariable" defaultValue={producto.manoVariable || "Mano variable"} className="formulario">
                  <option disabled>Mano variable</option>
                  {manoVariable.map(mv => (
                    <option key={mv} value={mv}>{mv}</option>
                  ))}
                </select>

                <button type="submit" className="bot-guardar" style={{marginTop: "20px"}}>Guardar</button>
              </form>
            )}
          </div>
        ))}
        <button className="agreProd" onClick={agregarProducto} style={{height: "535px"}}>+</button>
      </div>
    </>
  );
};
