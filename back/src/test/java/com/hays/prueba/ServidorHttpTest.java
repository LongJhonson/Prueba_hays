package com.hays.prueba;

import org.junit.jupiter.api.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ServidorHttpTest {

    private static ServidorHttp servidor;

    @BeforeAll
    public static void iniciarServidor() throws Exception {
        List<Fuente> fuentes = DataLoader.cargarFuentes("data/fuentes.csv");
        List<Evento> eventos = DataLoader.cargarEventosEnParalelo(Arrays.asList(
            "data/eventos_1.csv", "data/eventos_2.csv", "data/eventos_3.csv",
            "data/eventos_4.csv", "data/eventos_5.csv", "data/eventos_6.csv"
        ));

        servidor = new ServidorHttp(fuentes, eventos);
        new Thread(() -> {
            try {
                servidor.iniciar();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        Thread.sleep(2000); // esperar que el servidor inicie
    }

    private String llamarEndpoint(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");

        assertEquals(200, con.getResponseCode(), "El endpoint debe responder con 200");

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        StringBuilder res = new StringBuilder();
        String linea;
        while ((linea = in.readLine()) != null) {
            res.append(linea);
        }
        in.close();
        return res.toString();
    }

    @Test
    public void testEndpointFuentes() throws Exception {
        String json = llamarEndpoint("http://localhost:8000/fuentes");
        assertTrue(json.contains("Fuente"), "Debe contener datos de fuentes");
    }

    @Test
    public void testEndpointEventos() throws Exception {
        String json = llamarEndpoint("http://localhost:8000/eventos");
        assertTrue(json.contains("valor"), "Debe contener eventos con campo valor");
    }
}
