"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { nube, nubeConfigurada } from "@/lib/nube/cliente";
import { olvidarAlSalir, reintentarAlVolverLaSenal, sincronizarAlEntrar } from "@/lib/nube/sincronizar";
import { Logo } from "./marca";
import { Aviso, CLASE_CAMPO } from "./ui";

/**
 * La puerta de /app. Con Supabase configurado hay que entrar con la cuenta de Gastoico (la misma de
 * Gastagro). Sin Supabase (desarrollo), pasa directo y guarda solo en el dispositivo.
 */
export function ConSesion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Session | null | "cargando">(nubeConfigurada ? "cargando" : null);
  const [sincronizado, setSincronizado] = useState(false);
  const [recuperando, setRecuperando] = useState(false);

  useEffect(() => {
    const cliente = nube();
    if (!cliente) return;
    void cliente.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data } = cliente.auth.onAuthStateChange((evento, nueva) => {
      setSesion(nueva);
      if (evento === "SIGNED_OUT") olvidarAlSalir();
      if (evento === "PASSWORD_RECOVERY") setRecuperando(true);
    });
    const dejar = reintentarAlVolverLaSenal();
    return () => {
      data.subscription.unsubscribe();
      dejar();
    };
  }, []);

  const usuario = sesion && sesion !== "cargando" ? sesion.user.id : null;
  useEffect(() => {
    if (!usuario) return;
    let vigente = true;
    void sincronizarAlEntrar(usuario).finally(() => vigente && setSincronizado(true));
    return () => {
      vigente = false;
    };
  }, [usuario]);

  if (!nubeConfigurada) return <>{children}</>;
  if (sesion === "cargando") return <Cargando />;
  if (!sesion) return <Entrar />;
  if (recuperando) return <NuevaClave onListo={() => setRecuperando(false)} />;
  if (!sincronizado) return <Cargando />;
  return <>{children}</>;
}

/** Mientras cargan los datos: la forma del inicio, sin números. */
export function Cargando() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5 px-4 pt-[calc(env(safe-area-inset-top)_+_1rem)] lg:px-8 lg:pt-6" aria-busy="true" aria-label="Cargando">
      <div className="esqueleto h-7 w-32" />
      <div className="grid gap-2">
        <div className="esqueleto h-4 w-28" />
        <div className="esqueleto h-11 w-56" />
        <div className="esqueleto h-8 w-44 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="esqueleto h-32 rounded-tarjeta" />
        <div className="esqueleto h-32 rounded-tarjeta" />
      </div>
      <div className="esqueleto h-24 rounded-tarjeta" />
    </div>
  );
}

/** Salir de la cuenta: lo del dispositivo se borra (queda en la nube). */
export async function salir() {
  await nube()?.auth.signOut();
}

function Entrar() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [modo, setModo] = useState<"entrar" | "crear" | "olvido">("entrar");
  const [aviso, setAviso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mandando, setMandando] = useState(false);

  async function conGoogle() {
    setError(null);
    const { error } = await nube()!.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/app` } });
    if (error) setError("No se pudo entrar con Google. Probá con tu mail y una contraseña.");
  }

  async function conMail(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setAviso(null);
    if (!email.includes("@")) return setError("Escribí tu mail.");
    if (modo === "olvido") {
      setMandando(true);
      const { error } = await nube()!.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/app` });
      setMandando(false);
      if (error && /rate|seconds/i.test(error.message)) return setError("Ya te mandamos un mail hace un ratito. Esperá unos minutos y probá de nuevo.");
      if (error) return setError("No pudimos mandar el mail. Revisá la conexión y probá de nuevo.");
      return setAviso("Si ese mail tiene cuenta, te llegó un enlace para elegir una contraseña nueva. Si no lo ves, mirá en Correo no deseado.");
    }
    if (clave.length < 6) return setError("La contraseña tiene que tener al menos 6 letras o números.");
    setMandando(true);
    const auth = nube()!.auth;
    // El mail de confirmación vuelve a esta app (si no, Supabase manda a la Site URL, que es Gastoico).
    const { data, error } = modo === "entrar" ? await auth.signInWithPassword({ email, password: clave }) : await auth.signUp({ email, password: clave, options: { emailRedirectTo: `${window.location.origin}/app` } });
    setMandando(false);
    if (!error && !data.session) {
      setModo("entrar");
      return setError("Si ya tenías cuenta en Gastoico o Gastagro con ese mail, entrá con esa contraseña. Si es nueva, revisá tu mail para confirmarla.");
    }
    if (!error) return;
    if (/invalid login/i.test(error.message)) setError("El mail o la contraseña no coinciden. Si es tu primera vez, tocá «Crear mi cuenta».");
    else if (/already registered/i.test(error.message)) setError("Ese mail ya tiene cuenta. Tocá «Ya tengo cuenta» y entrá.");
    else if (/confirm/i.test(error.message)) setError("Falta confirmar el mail: revisá tu correo.");
    else setError("No pudimos entrar. Revisá la conexión y probá de nuevo.");
  }

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-sm content-center gap-7 px-5 py-12">
      <Logo tamano="text-4xl" simbolo="size-11" />
      <div className="grid gap-2">
        <h1 className="font-marca text-[28px] leading-tight text-balance">
          {modo === "entrar" ? "Entrá a tu plata" : modo === "crear" ? "Creá tu cuenta" : "Elegí una contraseña nueva"}
        </h1>
        <p className="text-texto-2">
          {modo === "olvido" ? "Escribí tu mail y te mandamos un enlace." : "Una cuenta para Gastoico y Gastagro. Lo que cargues queda guardado aunque cambies de celular."}
        </p>
      </div>

      {modo !== "olvido" && (
        <>
          <button
            type="button"
            onClick={conGoogle}
            className="presionable flex min-h-13 items-center justify-center gap-3 rounded-chico border-[1.5px] border-linea bg-superficie px-4 font-semibold"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
              <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z" />
              <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
            </svg>
            Entrar con Google
          </button>
          <div className="flex items-center gap-3 text-sm text-texto-2">
            <span className="h-px flex-1 bg-linea" />o con tu mail<span className="h-px flex-1 bg-linea" />
          </div>
        </>
      )}

      <form onSubmit={conMail} noValidate className="grid gap-3">
        <input id="mail" className={CLASE_CAMPO} type="email" autoComplete="email" inputMode="email" placeholder="tu@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Mail" />
        {modo !== "olvido" && (
          <input
            id="clave"
            className={CLASE_CAMPO}
            type="password"
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            aria-label="Contraseña"
          />
        )}
        {error && <Aviso tono="error">{error}</Aviso>}
        {aviso && <Aviso>{aviso}</Aviso>}
        <button type="submit" disabled={mandando} className="presionable min-h-13 rounded-chico bg-primario px-4 font-semibold text-sobre-primario disabled:opacity-60">
          {mandando ? "Un momento…" : modo === "entrar" ? "Entrar" : modo === "crear" ? "Crear mi cuenta" : "Mandarme el mail"}
        </button>
        {modo === "entrar" && (
          <button type="button" onClick={() => (setModo("olvido"), setError(null), setAviso(null))} className="justify-self-center py-2 text-sm text-texto-2 underline underline-offset-4">
            Olvidé mi contraseña
          </button>
        )}
        <button
          type="button"
          onClick={() => (setModo(modo === "entrar" ? "crear" : "entrar"), setError(null), setAviso(null))}
          className="justify-self-center py-2 text-sm font-semibold text-primario underline underline-offset-4"
        >
          {modo === "entrar" ? "Es mi primera vez: crear mi cuenta" : "Ya tengo cuenta"}
        </button>
      </form>
    </main>
  );
}

function NuevaClave({ onListo }: { onListo: () => void }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mandando, setMandando] = useState(false);

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    if (clave.length < 6) return setError("La contraseña tiene que tener al menos 6 letras o números.");
    setMandando(true);
    const { error } = await nube()!.auth.updateUser({ password: clave });
    setMandando(false);
    if (error && /different/i.test(error.message)) return setError("Tiene que ser distinta de la anterior.");
    if (error) return setError("No pudimos guardarla. Revisá la conexión y probá de nuevo.");
    onListo();
  }

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-sm content-center gap-7 px-5 py-12">
      <Logo tamano="text-4xl" simbolo="size-11" />
      <h1 className="font-marca text-[28px] leading-tight">Elegí tu contraseña nueva</h1>
      <form onSubmit={guardar} noValidate className="grid gap-3">
        <input id="clave-nueva" className={CLASE_CAMPO} type="password" autoComplete="new-password" placeholder="Contraseña nueva" value={clave} onChange={(e) => setClave(e.target.value)} aria-label="Contraseña nueva" />
        {error && <Aviso tono="error">{error}</Aviso>}
        <button type="submit" disabled={mandando} className="min-h-13 rounded-chico bg-primario px-4 font-semibold text-sobre-primario disabled:opacity-60">
          {mandando ? "Un momento…" : "Guardar y entrar"}
        </button>
      </form>
    </main>
  );
}
