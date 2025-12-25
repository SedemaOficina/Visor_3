# Documentación del Visor de Consulta Ciudadana (V-2)

Este documento describe la arquitectura lógica, los escenarios de resultados posibles el sistema de diseño implementado en la aplicación.

## 1. Arquitectura y Componentes Clave

### 1.1 Motor de Análisis (`analysisEngine.js`)
Es el corazón de la aplicación. Recibe una coordenada (`lat, lng`) y la base de datos precargada (`dataCache`) para ejecutar la siguiente lógica secuencial:
1.  **Detección Frontera CDMX:** Verifica si el punto está dentro del polígono geoespacial de la Ciudad de México.
2.  **Suelo de Conservación (SC):** Determina si el punto cae dentro de la capa oficial de Suelo de Conservación.
3.  **Áreas Naturales Protegidas (ANP):** Detecta intersecciones con polígonos ANP (federales o locales).
    *   *Nota:* Las ANP tienen prioridad visual sobre cualquier otra zonificación.
4.  **Zonificación PGOEDF:** Si está en SC, identifica la categoría específica (Forestal, Agroecológico, etc.) y recupera las reglas normativas asociadas (actividades permitidas/prohibidas).

## 2. Escenarios de Resultados

### Escenario A: Fuera de la CDMX
*   **Condición:** Coordenada fuera del límite político-administrativo.
*   **Resultado Visual:** Tarjeta de advertencia roja.
*   **Acciones:** Bloqueo de análisis normativo. Solo permite ver ubicación en mapa.

### Escenario B: Suelo Urbano (Sin ANP)
*   **Condición:** Dentro de CDMX pero fuera de Suelo de Conservación.
*   **Resultado Visual:** Etiqueta azul "SUELO URBANO".
*   **Mensaje:** Informa que la regulación corresponde a SEDUVI y no muestra tabla de actividades rurales.

### Escenario C: Área Natural Protegida (ANP)
*   **Condición:** Intersección con capa ANP (ya sea en Suelo Urbano o Conservación).
*   **Prioridad:** ALTA. Sobrescribe la visualización de zonificación base.
*   **Visualización:**
    *   **Color:** Morado Institucional (`#9333ea`).
    *   **Ficha Técnica:** Muestra tarjeta con Nombre, Categoría, Decreto y Superficie (si los datos internos existen).
    *   **Actividades:** No muestra tablas de PGOEDF automáticamente.

### Escenario D: Suelo de Conservación (Zonificado)
*   **Condición:** Dentro de SC y con zonificación PGOEDF válida (ej. Forestal, Agroecológico).
*   **Visualización:**
    *   **Cabecera:** Muestra la categoría (ej. "Forestal de Conservación").
    *   **Tablas:** Despliega pestañas interactivas de **"Actividades Prohibidas"** (Rojo) y **"Permitidas"** (Verde).
    *   **Notas:** Sección colapsable con fundamentos legales.

### Escenario E: Programas Parciales y Poblados (PDU)
*   **Condición:** Zonificación marcada como "PDU", "Poblado Rural" o "Programa Parcial".
*   **Visualización:**
    *   **Alerta:** Muestra aviso de "Consulta Específica Requerida".
    *   **Tablas:** Ocultas. Se debe consultar el instrumento específico del poblado.
    *   **Colores:** Distintivos (Naranja PDU, Café Rural, Gris Urbano).


---

## 2.1 Archivos y Lógica de Datos por Escenario

Esta tabla detalla los archivos específicos (`GeoJSON`, `CSV` o `Módulos JS`) que intervienen en la decisión de cada escenario descrito arriba.

| Escenario | Condición Lógica | Archivos Involucrados (Principal) | Archivos Secundarios / Contexto |
| :--- | :--- | :--- | :--- |
| **A. Fuera CDMX** | `!findFeature(pt, cdmx)` | `cdmx.geojson` (Límites CDMX) | `edomex.geojson`, `morelos.geojson` |
| **B. Suelo Urbano** | `findFeature(pt, cdmx)` AND `!findFeature(pt, sc)` | `suelo-de-conservacion-2020.geojson` | `alcaldias.geojson` |
| **C. ANP** | `findFeature(pt, anp)` | `anp_consolidada.geojson` | `anp_internal.geojson` (si tiene zonificación interna) |
| **D. SC Zonificado** | `findFeature(pt, sc)` AND `findFeature(pt, zoning)` | `zoonificacion_pgoedf_2000_sin_anp.geojson` | `tabla_actividades_pgoedf.csv` (Reglas) |
| **E. PDU (Parciales)** | `zoning.CLAVE` in (`PDU_PP`, `PDU_PR`, `PDU_ZU`) | `Zon_*.geojson` (Archivos locales PDU) | `analysisEngine.js` (Lógica de clasificación) |

---


## 3. Paleta de Colores Institucional

Se ha rediseñado la paleta para reducir el ruido visual y garantizar accesibilidad.

### Colores Base
*   **Primario (Guinda):** `#9d2148` (Botones, encabezados principales).
*   **Secundario (Dorado):** `#BC955C` (Acentos institucionales).
*   **Texto Principal:** `#111827` (Gris casi negro).
*   **Fondos:** `#f3f4f6` (Gris claro para reducir fatiga visual).

### Colores Semánticos (Zonificación)
*   **Forestal (Naturaleza):** Gama de Verdes y Turquesas (`#15803d`, `#0e7490`).
*   **Agroecológico (Producción):** Gama de Amarillos y Limas (`#fbbf24`, `#65a30d`).
*   **Estructural (PDU/Urbano):** Gama de Morados, Azules y Grises (`#c084fc`, `#94a3b8`).
*   **Alertas:**
    *   **Error:** `#b91c1c` (Rojo oscuro).
    *   **Éxito:** `#15803d` (Verde bosque).
    *   **Info:** `#1d4ed8` (Azul rey).


