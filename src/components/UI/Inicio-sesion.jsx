import React, { useState } from "react";
import "./InicioSesion.css";

export const InicioSesion = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="overlay" >
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

        <form>
          {isRegister && (
            <input type="text" placeholder="Nombre de usuario" required />
          )}
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="btn-inicio">
            {isRegister ? "Registrarse" : "Ingresar"}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Iniciá sesión" : "Registrate"}
          </span>
        </p>
      </div>
    </div>
  );
};
