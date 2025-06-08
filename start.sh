#!/bin/bash

# Salir si hay cualquier error
set -e

echo "Iniciando backend..."
cd back
mvn compile
mvn exec:java -Dexec.mainClass="com.hays.prueba.App" &
BACK_PID=$!

echo "Backend iniciado (PID $BACK_PID)"
cd ../client

echo "Instalando frontend..."
npm install

echo "Iniciando frontend..."
npm run dev
