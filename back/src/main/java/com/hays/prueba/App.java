package com.hays.prueba;

import java.util.Arrays;
import java.util.List;

public class App {
    public static void main(String[] args) {
        List<Fuente> fuentes = DataLoader.cargarFuentes("data/fuentes.csv");
        List<String> archivosEventos = Arrays.asList(
                "data/eventos_1.csv",
                "data/eventos_2.csv",
                "data/eventos_3.csv",
                "data/eventos_4.csv",
                "data/eventos_5.csv",
                "data/eventos_6.csv");
        List<Evento> eventos = DataLoader.cargarEventosEnParalelo(archivosEventos);

        try {
            ServidorHttp servidor = new ServidorHttp(fuentes, eventos);
            servidor.iniciar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
