# Prueba Técnica - Desarrollador/a Fullstack (Java + React)

## Descripción

Esta aplicación permite cargar eventos y fuentes desde archivos CSV,
visualizarlos en una tabla con filtros, y mostrarlos geográficamente en un
mapa.  
Desarrollada sin usar bases de datos ni frameworks complejos, cumpliendo los
requisitos especificados.

---

## Tecnologías

### Backend

- Java 11
- - Maven
- - JUnit 5
- - Servidor HTTP nativo (`com.sun.net.httpserver`)
- - Lectura CSV multihilo con `ExecutorService`
-
- ### Frontend
- - React 18.2
- - Vite
- - React Leaflet 4.2.1 + Leaflet
- - HTML + CSS puro (sin frameworks UI)
-

---

-
- ## Estructura del proyecto
-
-
```
prueba_tecnica_hays/
├── back/
│ ├── pom.xml
│ ├── data/
│ │ ├── fuentes.csv
│ │ ├── eventos_1.csv
│ │ ├── ... eventos_6.csv
│ └── src/
│ ├── main/java/com/hays/prueba/
│ └── test/java/com/hays/prueba/
└── client/
├── index.html
├── package.json
└── src/
├── App.jsx
├── MapaEventos.jsx
└── main.jsx
```


---

## Ejecución del Backend

### Requisitos
- Java 11+
- Maven

### Instrucciones

1. Ir a la carpeta `back/`:
```bash
    cd back
    mvn compile
    mvn exec:java -Dexec.mainClass="com.hays.prueba.App"
```

### Test
```bash
    mvn test
```

## Ejecución del Frontend

### Requisitos
- Node.js 18+
- Vite

### Instrucciones

1. Ir a la carpeta `client/`:
```bash
    cd client
    npm npm install
    npm run dev
    Abrir http://localhost:5173
```

## Ejecución rápida con start.sh

1. Dar permisos de ejecución:

```bash
chmod +x start.sh
```

2. Ejecutar el script

```bash
./start.sh
```
