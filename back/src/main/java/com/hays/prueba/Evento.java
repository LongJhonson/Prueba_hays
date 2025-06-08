package com.hays.prueba;

import java.time.LocalDateTime;

public class Evento {
    private String id;
    private String fuenteId;
    private LocalDateTime timestamp;
    private double valor;
    private double latitud;
    private double longitud;

    public Evento() {}

    public Evento(String id, String fuenteId, LocalDateTime timestamp, double valor, double latitud, double longitud) {
        this.id = id;
        this.fuenteId = fuenteId;
        this.timestamp = timestamp;
        this.valor = valor;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFuenteId() {
        return fuenteId;
    }

    public void setFuenteId(String fuenteId) {
        this.fuenteId = fuenteId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public double getLatitud() {
        return latitud;
    }

    public void setLatitud(double latitud) {
        this.latitud = latitud;
    }

    public double getLongitud() {
        return longitud;
    }

    public void setLongitud(double longitud) {
        this.longitud = longitud;
    }

    @Override
    public String toString() {
        return "Evento{" +
                "id='" + id + '\'' +
                ", fuenteId='" + fuenteId + '\'' +
                ", timestamp=" + timestamp +
                ", valor=" + valor +
                ", latitud=" + latitud +
                ", longitud=" + longitud +
                '}';
    }
}
