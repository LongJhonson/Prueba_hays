import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Icono para fuentes (ej: azul)
const iconFuente = new L.Icon({
  // iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535188.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

// Icono para eventos (ej: rojo)
const iconEvento = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20],
});

// Componente que ajusta la vista del mapa a los puntos visibles
const AjustarVista = ({ coordenadas }) => {
  const map = useMap();

  useEffect(() => {
    if (coordenadas.length > 0) {
      const bounds = L.latLngBounds(coordenadas);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordenadas, map]);

  return null;
};

const MapaEventos = ({ eventos, fuentes }) => {
  const fuentePorId = Object.fromEntries(fuentes.map(f => [f.id, f]));

  // Coordenadas de todos los puntos visibles (fuentes + eventos)
  const coordenadas = [
    ...fuentes.map(f => [f.latitud, f.longitud]),
    ...eventos.map(e => [e.latitud, e.longitud])
  ];

  return (
    <MapContainer center={[40.0, -3.7]} zoom={6} style={{ height: '1000px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* Ajuste automático del mapa */}
      <AjustarVista coordenadas={coordenadas} />

      {/* Marcadores de fuentes */}
      {fuentes.map((f) => (
        <Marker
          key={f.id}
          position={[f.latitud, f.longitud]}
          icon={iconFuente}
        >
          <Popup>
            <b>Fuente:</b> {f.nombre}<br />
            ({f.latitud}, {f.longitud})
          </Popup>
        </Marker>
      ))}

      {/* Marcadores de eventos */}
      {eventos.map((e) => {
        const fuente = fuentePorId[e.fuenteId];
        if (!fuente) return null;

        return (
          <Marker
            key={e.id}
            position={[e.latitud, e.longitud]}
            icon={iconEvento}
          >
            <Popup>
              <b>Evento {e.id}</b><br />
              Valor: {e.valor}<br />
              {e.timestamp}
            </Popup>
          </Marker>
        );
      })}

      {/* Líneas que conectan eventos con su fuente */}
      {eventos.map((e) => {
        console.log({eventos});
        const fuente = fuentePorId[e.fuenteId];
        if (!fuente) return null;

        const puntoEvento = [e.latitud, e.longitud];
        const puntoFuente = [fuente.latitud, fuente.longitud];

        return (
          <Polyline
            key={`linea-${e.id}`}
            positions={[puntoFuente, puntoEvento]}
            pathOptions={{ color: 'blue' }}
          />
        );
      })}
    </MapContainer>
  );
};

export default MapaEventos;
