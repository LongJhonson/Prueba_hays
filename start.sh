#!/bin/bash
set -e

echo "Iniciando backend..."
cd back
mvn compile
mvn exec:java -Dexec.mainClass="com.hays.prueba.App" &
BACK_PID=$!
cd ../client

# Al salir, detener el backend
function limpiar() {
  echo -e "\n Deteniendo backend (PID $BACK_PID)..."
  kill $BACK_PID
  wait $BACK_PID 2>/dev/null
  echo "✅ Backend detenido."
  exit 0
}

trap limpiar INT TERM

echo "Instalando frontend..."
npm install

echo "Iniciando frontend..."
npm run dev

# Esperar a que termine Vite
wait
