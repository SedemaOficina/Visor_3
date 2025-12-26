# Documentación Técnica del Visor de Consulta Ciudadana (V-2)

Este documento unifica la especificación técnica, lógica de negocio y sistema de diseño del Visor, reflejando el estado actual de la aplicación.

---

## 1. Arquitectura y Lógica de Análisis

El motor de análisis (`analysisEngine.js`) evalúa cada coordenada consultada siguiendo una estricta jerarquía de prioridades.

### 1.1 Jerarquía de Prioridades (Resultados y Marcadores)
El sistema clasifica cualquier punto geográfico en **uno** de los siguientes estados principales, evaluados en orden descendente. El primer estado que cumpla la condición detiene la evaluación principal, aunque pueden coexistir atributos secundarios (como ANP en zona Urbana).

| Prioridad | Estado | Condición Lógica | Marcador (Mapa) | Color |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Fuera de CDMX** | `!dentro_limite_cdmx` | **'X'** (Rojo) | `#b91c1c` |
| **2** | **Suelo de Conservación (SC)** | `en_capa_sc` | **'SC'** (Verde) | `#3B7D23` |
| **3** | **Área Natural Protegida (ANP)** | `en_capa_anp` | **'ANP'** (Morado) | `#9333ea` |
| **4** | **Suelo Urbano (SU)** | `en_cdmx` y `!en_sc` | **'SU'** (Azul) | `#3b82f6` |

> **Nota de Prioridad Visual:** Si un punto está en Suelo de Conservación (SC) y también en ANP, el marcador mostrará **'SC'** (Verde). La condición de ANP se reflejará como un atributo secundario en la ficha de resultados.

---

## 2. Sistema Visual y Capas

### 2.1 Código de Colores Semántico

| Categoría | Color Principal | Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Institucional** | Guinda | `#9d2148` | Encabezados, botones primarios, loaders. |
| **Institucional** | Dorado | `#BC955C` | Detalles, acentos, separadores. |
| **Suelo de Conservación** | Verde Bosque | `#3B7D23` | Capa base SC, Badges, Marcadores. |
| **Áreas Nat. Protegidas** | Morado | `#9333ea` | Capa base ANP, Badges, Marcadores. |
| **Suelo Urbano** | Azul Rey | `#3b82f6` | Marcadores SU, Capas PDU. |
| **Alerta / Error** | Rojo | `#b91c1c` | Fuera de CDMX, Errores. |

### 2.2 Comportamiento Dinámico de Capas
*   **Líneas de Alcaldías:**
    *   Fondo Oscuro (Satélite): Líneas **Blancas** (`#FFFFFF`).
    *   Fondo Claro (Calle): Líneas **Gris Oscuro** (`#374151`).
    *   *Objetivo:* Garantizar contraste visible en cualquier mapa base.

---

## 3. Escenarios de Resultados (Ficha Informativa)

El panel de resultados se adapta dinámicamente según la clasificación del punto.

### 3.1 Badges (Etiquetas de Clasificación)
Las fichas ahora soportan **múltiples badges** en la misma línea para reflejar intersecciones normativas importantes.

*   *Ejemplo Común:* Un punto en Suelo Urbano que cae dentro de un Parque Nacional mostrará:
    `[SUELO URBANO]` (Azul) + `[ANP]` (Morado)

### 3.2 Escenarios Detallados

#### A. Fuera de CDMX
*   **Marcador:** Rojo ('X').
*   **Contenido:** Tarjeta roja de advertencia.
*   **Bloqueos:** No muestra análisis normativo, alcaldía ni actividades.
*   **Interfaz Móvil:** Diseño limpio, sin contenedores vacíos.

#### B. Suelo de Conservación (SC)
*   **Marcador:** Verde ('SC').
*   **Header:** Badge Verde `[SUELO DE CONSERVACIÓN]`.
*   **Si es ANP:** Se añade Badge Morado `[ANP]`.
*   **Contenido:**
    *   Zonificación PGOEDF (ej. Forestal).
    *   Acordeón de Actividades (Prohibidas/Permitidas).
    *   Tarjetas de ANP (si aplica).
    *   Notas Normativas.

#### C. Suelo Urbano (SU)
*   **Marcador:** Azul ('SU').
*   **Header:** Badge Azul `[SUELO URBANO]`.
*   **Si es ANP:** Se añade Badge Morado `[ANP]`.
*   **Contenido:**
    *   Alargía.
    *   Aviso de "Consulta Específica Requerida" (Remite a SEDUVI/PDU).
    *   **No** muestra tablas de actividades rurales.

---

## 4. Interfaz Móvil (Responsive)

*   **Barra de Búsqueda:** Posicionada en la parte superior, siempre visible (`z-index` alto), con fondo blanco y sombra para contraste sobre el mapa.
*   **Header Institucional:** Oculto en móviles para maximizar el área de mapa.
*   **Bottom Sheet:** Pantalla de bienvenida con logo oficial de SEDEMA y colores institucionales (Guinda/Dorado).
*   **Leyenda de Capas:** Posicionada flotante en la parte superior derecha (`z-index: 1110`), por encima de cualquier panel inferior para evitar obstrucciones.

---

## 5. Archivos Críticos

| Funcionalidad | Archivo Principal | Descripción |
| :--- | :--- | :--- |
| **Mapa Interactivo** | `src/components/map/MapViewer.js` | Controla capas, marcadores, eventos y estilo dinámico. |
| **Resultados** | `src/components/analysis/ResultsContent.js` | Renderiza la ficha, badges y lógica visual de datos. |
| **Exportación** | `src/components/features/PdfExportController.js` | Genera el PDF replicando estilos y prioridades del mapa. |
| **Búsqueda** | `src/components/search/MobileSearchBar.js` | Componente de búsqueda optimizado para móviles. |
