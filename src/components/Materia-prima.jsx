import React, { useState, useEffect } from "react";

export const MateriaPrima = () => {
  const [materiaPrima, setMateriaPrima] = useState([]);

  useEffect(() => {
    if (materiaPrima.length === 0) {
      setMateriaPrima([
        {
          id: Date.now(),
          tipo: "",
          nombre: "",
          unidadesXPaquete: "",
          tipoUnidad: "",
          precioXPaquete: "",
          cantidadPaquetes: "",
          guardado: false,
        },
      ]);
    }
  }, []);

  // ➕ Agregar nueva materia prima
  const agregarMateriaPrima = () => {
    setMateriaPrima([
      ...materiaPrima,
      {
        id: Date.now(),
        tipo: "",
        nombre: "",
        unidadesXPaquete: "",
        tipoUnidad: "",
        precioXPaquete: "",
        cantidadPaquetes: "",
        guardado: false,
      },
    ]);
  };

  // 💾 Guardar datos
  const cargarMateriaPrima = (
    id,
    tipo,
    nombre,
    unidadesXPaquete,
    tipoUnidad,
    precioXPaquete,
    cantidadPaquetes
  ) => {
    setMateriaPrima(
      materiaPrima.map((p) =>
        p.id === id
          ? {
              ...p,
              tipo,
              nombre,
              unidadesXPaquete,
              tipoUnidad,
              precioXPaquete,
              cantidadPaquetes,
              guardado: true,
            }
          : p
      )
    );
  };

  // ✏️ Editar
  const editarMateriaPrima = (id) => {
    setMateriaPrima(
      materiaPrima.map((p) => (p.id === id ? { ...p, guardado: false } : p))
    );
  };

  // 🗑️ Eliminar
  const eliminarMateriaPrima = (id) => {
    setMateriaPrima(materiaPrima.filter((p) => p.id !== id));
  };

  return (
    <>
      <h1 className="section-title">Materias primas</h1>
      <div className="prod-container">
        {materiaPrima.map((materiaPrima) => (
          <div key={materiaPrima.id} className="cont-prod">
            {/* ❌ Botón eliminar */}
            <button
              className="bot-eliminar"
              onClick={() => eliminarMateriaPrima(materiaPrima.id)}
            >
              ✖
            </button>

            {materiaPrima.guardado ? (
              <div className="producto-info">
                <h3 className="producto-nombre">
                  {materiaPrima.nombre || "(sin nombre)"}
                </h3>
                <p className="producto-data">
                  Tipo: {materiaPrima.tipo || "(sin tipo)"}
                </p>
                <p className="producto-data">
                  Unidades: {materiaPrima.unidadesXPaquete || 0}
                </p>
                <p className="producto-data">
                  Tipo de unidad: {materiaPrima.tipoUnidad || "(vacío)"}
                </p>
                <p className="producto-data">
                  Precio paquete: ${materiaPrima.precioXPaquete || 0}
                </p>
                <p className="producto-data">
                  Cantidad de paquetes: {materiaPrima.cantidadPaquetes || 0}
                </p>
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => editarMateriaPrima(materiaPrima.id)}
                    className="bot-guardar"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="cont-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const nombre = e.target.nombre.value.trim();
                  const tipo = e.target.tipo.value;
                  const unidadesXPaquete = e.target.unidadesXPaquete.value;
                  const tipoUnidad = e.target.tipoUnidad.value;
                  const precioXPaquete = e.target.precioXPaquete.value;
                  const cantidadPaquetes = e.target.cantidadPaquetes.value;
                  cargarMateriaPrima(
                    materiaPrima.id,
                    tipo,
                    nombre,
                    unidadesXPaquete,
                    tipoUnidad,
                    precioXPaquete,
                    cantidadPaquetes
                  );
                }}
              >
                <input
                  style={{ marginTop: 0 }}
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  defaultValue={materiaPrima.nombre}
                  className="formulario"
                />
                <input
                  name="tipo"
                  type="text"
                  placeholder="Tipo"
                  defaultValue={materiaPrima.tipo}
                  className="formulario"
                />
                <input
                  name="unidadesXPaquete"
                  type="number"
                  placeholder="Unidades por paquete"
                  defaultValue={materiaPrima.unidadesXPaquete}
                  className="formulario"
                />
                {/* 🔹 Select de tipo de unidad */}
                <select
                  name="tipoUnidad"
                  defaultValue={materiaPrima.tipoUnidad}
                  className="formulario"
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="Toneladas">Toneladas</option>
                  <option value="Kilos">Kilos</option>
                  <option value="Miligramos">Miligramos</option>
                  <option value="Litros">Litros</option>
                  <option value="Mililitros">Mililitros</option>
                  <option value="Unidades">Unidades</option>
                </select>
                <input
                  name="precioXPaquete"
                  type="number"
                  placeholder="Precio"
                  defaultValue={materiaPrima.precioXPaquete}
                  className="formulario"
                />
                <input
                  name="cantidadPaquetes"
                  type="number"
                  placeholder="Cantidad de paquetes"
                  defaultValue={materiaPrima.cantidadPaquetes}
                  className="formulario"
                />
                <button
                  type="submit"
                  className="bot-guardar"
                  style={{ marginTop: 15 }}
                >
                  Guardar
                </button>
              </form>
            )}
          </div>
        ))}
        <button className="agreProd" onClick={agregarMateriaPrima}>
          +
        </button>
      </div>
    </>
  );
};
