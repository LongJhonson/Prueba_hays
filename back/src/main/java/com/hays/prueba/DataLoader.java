package com.hays.prueba;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

public class DataLoader {

    public static List<Fuente> cargarFuentes(String path) {
        List<Fuente> fuentes = new ArrayList<>();
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(path))) {
            String linea;
            reader.readLine(); // saltar cabecera
            while ((linea = reader.readLine()) != null) {
                String[] partes = linea.split(",");
                Fuente f = new Fuente(
                        partes[0],
                        partes[1],
                        Double.parseDouble(partes[2]),
                        Double.parseDouble(partes[3])
                );
                fuentes.add(f);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fuentes;
    }

    public static List<Evento> cargarEventos(String path) {
        List<Evento> eventos = new ArrayList<>();
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(path))) {
            String linea;
            reader.readLine(); // saltar cabecera
            while ((linea = reader.readLine()) != null) {
                String[] partes = linea.split(",");
                Evento ev = new Evento(
                        partes[0],
                        partes[1],
                        LocalDateTime.parse(partes[2]),
                        Double.parseDouble(partes[3]),
                        Double.parseDouble(partes[4]),
                        Double.parseDouble(partes[5])
                );
                eventos.add(ev);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return eventos;
    }

    public static List<Evento> cargarEventosEnParalelo(List<String> rutas) {
        List<Evento> todosLosEventos = new ArrayList<>();
        ExecutorService executor = Executors.newFixedThreadPool(rutas.size());
        List<Future<List<Evento>>> futuros = new ArrayList<>();

        for (String ruta : rutas) {
            futuros.add(executor.submit(() -> cargarEventos(ruta)));
        }

        for (Future<List<Evento>> futuro : futuros) {
            try {
                todosLosEventos.addAll(futuro.get());
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }

        executor.shutdown();
        return todosLosEventos;
    }
}
