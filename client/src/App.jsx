import { useEffect, useState } from 'react';
import MapaEventos from './MapaEventos';

function App() {
  const [fuentes, setFuentes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [filtroFuente, setFiltroFuente] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [columnaOrden, setColumnaOrden] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const [filtroId, setFiltroId] = useState('');
  const [filtroNombreFuente, setFiltroNombreFuente] = useState('');
  const [filtroValor, setFiltroValor] = useState('');
  const [filtroLatitud, setFiltroLatitud] = useState('');
  const [filtroLongitud, setFiltroLongitud] = useState('');

  const [vistaActiva, setVistaActiva] = useState('tabla');

  const eventosPorPagina = 10;

  const resetearFiltros = () => {
    setFiltroFuente('');
    setFechaDesde('');
    setFechaHasta('');
    setFiltroId('');
    setFiltroNombreFuente('');
    setFiltroValor('');
    setFiltroLatitud('');
    setFiltroLongitud('');
    setPaginaActual(1);
  };

  const obtenerNombreFuente = (fuenteId) => {
    const fuente = fuentes.find(f => f.id === fuenteId);
    return fuente ? fuente.nombre : fuenteId;
  };


  const eventosFiltrados = eventos.filter(e => {
    const fechaEvento = new Date(e.timestamp);
    const fuenteNombre = obtenerNombreFuente(e.fuenteId).toLowerCase();

    let coincide = true;

    if (filtroFuente) coincide = coincide && (e.fuenteId === filtroFuente);
    if (fechaDesde) coincide = coincide && (fechaEvento >= new Date(fechaDesde));
    if (fechaHasta) coincide = coincide && (fechaEvento <= new Date(fechaHasta));
    if (filtroId) coincide = coincide && e.id.toLowerCase().includes(filtroId.toLowerCase());
    if (filtroNombreFuente) coincide = coincide && fuenteNombre.includes(filtroNombreFuente.toLowerCase());
    if (filtroValor) coincide = coincide && e.valor.toString().includes(filtroValor);
    if (filtroLatitud) coincide = coincide && e.latitud.toString().includes(filtroLatitud);
    if (filtroLongitud) coincide = coincide && e.longitud.toString().includes(filtroLongitud);

    return coincide;
  });

  // Ordenar antes de paginar
  const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
    if (!columnaOrden) return 0;

    let valorA = a[columnaOrden];
    let valorB = b[columnaOrden];

    // Comparar fechas correctamente
    if (columnaOrden === 'timestamp') {
      valorA = new Date(valorA);
      valorB = new Date(valorB);
    }

    // Comparar nombre de fuente
    if (columnaOrden === 'fuente') {
      valorA = obtenerNombreFuente(a.fuenteId);
      valorB = obtenerNombreFuente(b.fuenteId);
    }

    if (valorA < valorB) return ordenAscendente ? -1 : 1;
    if (valorA > valorB) return ordenAscendente ? 1 : -1;
    return 0;
  });


  const totalPaginas = Math.ceil(eventosOrdenados.length / eventosPorPagina);
  const indiceInicio = (paginaActual - 1) * eventosPorPagina;
  const eventosPagina = eventosOrdenados.slice(indiceInicio, indiceInicio + eventosPorPagina);

  useEffect(() => {
    fetch('http://localhost:8000/fuentes')
      .then(res => res.json())
      .then(setFuentes);

    fetch('http://localhost:8000/eventos')
      .then(res => res.json())
      .then(setEventos);
  }, []);

  const formatearFecha = (timestamp) => {
    const fecha = new Date(timestamp);

    if (isNaN(fecha.getTime())) return 'Fecha inválida';

    const pad = (num) => num.toString().padStart(2, '0');

    const dia = pad(fecha.getDate());
    const mes = pad(fecha.getMonth() + 1); // los meses van de 0 a 11
    const anio = fecha.getFullYear();
    const horas = pad(fecha.getHours());
    const minutos = pad(fecha.getMinutes());
    const segundos = pad(fecha.getSeconds());

    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  };

  const manejarOrden = (col) => {
    if (columnaOrden === col) {
      setOrdenAscendente(!ordenAscendente); // alternar
    } else {
      setColumnaOrden(col);
      setOrdenAscendente(true); // nuevo orden
    }
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroFuente, fechaDesde, fechaHasta]);

  return (
    <div style={{ padding: '2rem' }}>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setVistaActiva('tabla')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: vistaActiva === 'tabla' ? '#ddd' : '#fff',
            border: '1px solid #ccc',
            cursor: 'pointer',
            color: 'black'
          }}
        >
          Tabla
        </button>
        <button
          onClick={() => setVistaActiva('mapa')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: vistaActiva === 'mapa' ? '#ddd' : '#fff',
            border: '1px solid #ccc',
            cursor: 'pointer',
            color: 'black'
          }}
        >
          Mapa
        </button>
      </div>

      {vistaActiva === 'tabla' && (
        <>

          <h1>Eventos</h1>

          <div style={{ marginBottom: '1rem' }}>
            <label>Filtrar por fuente: </label>
            <select onChange={e => setFiltroFuente(e.target.value)} value={filtroFuente}>
              <option value="">Todas</option>
              {fuentes.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Desde: </label>
            <input type="datetime-local" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
            <label style={{ marginLeft: '1rem' }}>Hasta: </label>
            <input type="datetime-local" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
          </div>

          <button onClick={resetearFiltros} style={{ marginBottom: '1rem' }}>
            Resetear filtros
          </button>


          <table border="1" cellPadding="8" style={{ marginTop: '1rem', width: '100%' }}>
            <thead>
              <tr>
                <th onClick={() => manejarOrden('id')}>ID</th>
                <th onClick={() => manejarOrden('fuente')}>Fuente</th>
                <th onClick={() => manejarOrden('timestamp')}>Timestamp</th>
                <th onClick={() => manejarOrden('valor')}>Valor</th>
                <th onClick={() => manejarOrden('latitud')}>Latitud</th>
                <th onClick={() => manejarOrden('longitud')}>Longitud</th>
              </tr>
              <tr>
                <th><input value={filtroId} onChange={e => setFiltroId(e.target.value)} placeholder="Buscar ID" /></th>
                <th><input value={filtroNombreFuente} onChange={e => setFiltroNombreFuente(e.target.value)} placeholder="Buscar fuente" /></th>
                <th></th> {/* No se filtra por fecha aquí, ya tienes inputs aparte */}
                <th><input value={filtroValor} onChange={e => setFiltroValor(e.target.value)} placeholder="Buscar valor" /></th>
                <th><input value={filtroLatitud} onChange={e => setFiltroLatitud(e.target.value)} placeholder="Buscar latitud" /></th>
                <th><input value={filtroLongitud} onChange={e => setFiltroLongitud(e.target.value)} placeholder="Buscar longitud" /></th>
              </tr>
            </thead>
            <tbody>
              {eventosPagina.map(e => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{obtenerNombreFuente(e.fuenteId)}</td>
                  <td>{formatearFecha(e.timestamp)}</td>
                  <td>{e.valor}</td>
                  <td>{e.latitud}</td>
                  <td>{e.longitud}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1}>Anterior</button>
            <span style={{ margin: '0 1rem' }}>Página {paginaActual} de {totalPaginas}</span>
            <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>Siguiente</button>
          </div>

        </>
      )}
      {vistaActiva === 'mapa' && (
        <>
          <h2>Mapa de eventos y fuentes</h2>
          <MapaEventos eventos={eventosFiltrados} fuentes={fuentes} />
        </>
      )}
    </div>
  );
}

export default App;
