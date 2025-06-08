package com.hays.prueba;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ServidorHttp {

    private final List<Fuente> fuentes;
    private final List<Evento> eventos;
    private final ObjectMapper mapper;

    public ServidorHttp(List<Fuente> fuentes, List<Evento> eventos) {
        this.fuentes = fuentes;
        this.eventos = eventos;
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public void iniciar() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        // Endpoint /fuentes
        server.createContext("/fuentes", exchange -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                enviarJson(exchange, fuentes);
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        });

        // Endpoint /eventos
        // server.createContext("/eventos", exchange -> {
        // if ("GET".equals(exchange.getRequestMethod())) {
        // try {
        // enviarJson(exchange, eventos);
        // } catch (Exception e) {
        // e.printStackTrace(); // imprime en consola
        // String msg = "{\"error\":\"Error al procesar eventos\"}";
        // exchange.sendResponseHeaders(500, msg.length());
        // try (OutputStream os = exchange.getResponseBody()) {
        // os.write(msg.getBytes());
        // }
        // }
        // } else {
        // exchange.sendResponseHeaders(405, -1);
        // }
        // });

        server.createContext("/eventos", exchange -> {
            if (!"GET".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                List<Evento> filtrados = eventos;

                if (query != null) {
                    Map<String, String> params = parsearParametros(query);
                    filtrados = eventos.stream()
                            .filter(e -> {
                                boolean coincide = true;

                                if (params.containsKey("fuenteId")) {
                                    coincide &= e.getFuenteId().equals(params.get("fuenteId"));
                                }

                                if (params.containsKey("desde")) {
                                    coincide &= e.getTimestamp().isAfter(LocalDateTime.parse(params.get("desde")));
                                }

                                if (params.containsKey("hasta")) {
                                    coincide &= e.getTimestamp().isBefore(LocalDateTime.parse(params.get("hasta")));
                                }

                                return coincide;
                            })
                            .collect(Collectors.toList());
                }

                enviarJson(exchange, filtrados);

            } catch (Exception e) {
                e.printStackTrace();
                String msg = "{\"error\":\"Error al procesar eventos con filtros\"}";
                exchange.sendResponseHeaders(500, msg.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(msg.getBytes());
                }
            }
        });

        server.setExecutor(null); // Usa el default executor
        server.start();
        System.out.println("Servidor iniciado en http://localhost:8000/");
    }

    private Map<String, String> parsearParametros(String query) {
        Map<String, String> map = new HashMap<>();
        for (String par : query.split("&")) {
            String[] partes = par.split("=");
            if (partes.length == 2) {
                map.put(partes[0], partes[1]);
            }
        }
        return map;
    }

    private void enviarJson(HttpExchange exchange, Object data) throws IOException {
        String response = mapper.writeValueAsString(data);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(200, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
