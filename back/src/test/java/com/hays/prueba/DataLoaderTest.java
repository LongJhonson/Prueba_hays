package com.hays.prueba;

import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DataLoaderTest {

    @Test
    public void testCargarFuentes() {
        List<Fuente> fuentes = DataLoader.cargarFuentes("data/fuentes.csv");

        assertNotNull(fuentes);
        assertFalse(fuentes.isEmpty(), "La lista de fuentes no debería estar vacía");
    }

    @Test
    public void testCargarEventosIndividual() {
        List<Evento> eventos = DataLoader.cargarEventos("data/eventos_1.csv");

        assertNotNull(eventos);
        assertFalse(eventos.isEmpty(), "La lista de eventos no debería estar vacía");
        assertNotNull(eventos.get(0).getId(), "Cada evento debería tener un ID");
    }

    @Test
    public void testCargarEventosParalelo() {
        List<String> archivos = Arrays.asList(
            "data/eventos_1.csv", "data/eventos_2.csv", "data/eventos_3.csv",
            "data/eventos_4.csv", "data/eventos_5.csv", "data/eventos_6.csv"
        );

        List<Evento> eventos = DataLoader.cargarEventosEnParalelo(archivos);

        assertNotNull(eventos);
        assertEquals(1000, eventos.size(), "Debería haber 1000 eventos en total");
    }
}
