import { useState } from "react";
import { supabase } from "../../supabase.js";
import "./InicioSesion.css";

const ERRORES = {
  "Invalid login credentials":   "Email o contraseña incorrectos.",
  "Email not confirmed":          "Confirmá tu email antes de ingresar.",
  "User already registered":      "Ya existe una cuenta con ese email.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
};

const traducir = (msg) => ERRORES[msg] ?? msg ?? "Ocurrió un error. Intentá de nuevo.";

export const InicioSesion = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const fd       = new FormData(e.target);
    const email    = fd.get("email").trim();
    const password = fd.get("password");

    if (isRegister) {
      const confirmar = fd.get("confirmar");
      if (password !== confirmar) {
        setError("Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }
      const nombre = fd.get("nombre")?.trim();
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: nombre } },
      });
      if (err) {
        setError(traducir(err.message));
      } else {
        setSuccess("¡Cuenta creada! Revisá tu email para confirmar.");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(traducir(err.message));
      } else {
        onClose();
      }
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (err) setError(traducir(err.message));
  };

  const switchMode = () => {
    setIsRegister(v => !v);
    setError("");
    setSuccess("");
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        <h2 className="modal-title">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

        {error   && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">{success}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              name="nombre" type="text" placeholder="Nombre"
              className="modal-input" autoComplete="name"
            />
          )}
          <input
            name="email" type="email" placeholder="Correo electrónico"
            className="modal-input" required autoComplete="email"
          />
          <input
            name="password" type="password" placeholder="Contraseña"
            className="modal-input" required autoComplete={isRegister ? "new-password" : "current-password"}
          />
          {isRegister && (
            <input
              name="confirmar" type="password" placeholder="Confirmar contraseña"
              className="modal-input" required autoComplete="new-password"
            />
          )}
          <button type="submit" className="btn-inicio" disabled={loading}>
            {loading ? "Cargando..." : isRegister ? "Crear cuenta" : "Ingresar"}
          </button>
        </form>

        <div className="modal-divider"><span>o</span></div>

        <button className="btn-google" onClick={handleGoogle} type="button">
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <p className="toggle-text">
          {isRegister ? "¿Ya tenés cuenta? " : "¿No tenés cuenta? "}
          <span onClick={switchMode}>
            {isRegister ? "Iniciá sesión" : "Registrate"}
          </span>
        </p>
      </div>
    </div>
  );
};
