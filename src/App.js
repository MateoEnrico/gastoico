import './App.css';

function App() {
  return (
    <div>
      <header>
        <a href="" className='cont-logo'><img src="/Gastoico.png" alt="Logo Gastoico" className='logo' /></a>
        <a href='#productos' className='navbar'>Productos</a>
        <a href='#gastos-fijos' className='navbar'>Gastos fijos</a>
        <a href='#mano-obra' className='navbar'>Mano de obra</a>
        <a href='#materia-prima' className='navbar'>Materia prima</a>
        <a href='#impuestos' className='navbar'>Impuestos</a>
        <a href='#servicios' className='navbar'>Servicios</a>
        <a href="" className='cont-login'><img src="/Login.png" alt="" className='login'/> Iniciar Sesión </a>
      </header>
      <div className='contenido'>
        <section id="productos">
         <h1>Productos</h1>
         <div className='cont-prod'>
          <p>Hola soy un producto</p>
         </div>
        </section>
      </div>
    </div>
  );
}

export default App;
