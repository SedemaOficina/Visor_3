# 📓 Bitácora de Ideas y Futuras Implementaciones

Este documento centraliza las ideas, mejoras y deuda técnica del proyecto.

---

## 🏷️ Simbología
*   🟢 **Fácil**: Implementación rápida (< 2 horas).
*   🟡 **Medio**: Requiere diseño o cambios en varios archivos (2-5 horas).
*   🔴 **Difícil**: Requiere arquitectura nueva o dependencias externas (> 5 horas).
*   🏗️ **Requiere Validación**: Necesita más definición por parte del usuario.

---

## 🚀 Propuestas del Usuario

Aqui se listan las ideas que TÚ has mencionado o sugerido.

### 1. Botón de Búsqueda en Desktop (UI/UX)
*   **Dificultad**: 🟢 **Fácil**
*   **Descripción**: Agregar un botón explícito de "Buscar" junto a la barra de coordenadas en versión Desktop, para no depender solo de la tecla Enter.
*   **Estado**: Pendiente.

### 2. Enlace a Programas de Manejo ANP (PDF)
*   **Dificultad**: 🟢 **Fácil** (Técnicamente) / 🏗️ **Alta** (Dependencia de Archivos)
*   **Descripción**: Incluir enlace clicable en el PDF para ver el Programa de Manejo de la ANP correspondiente.
*   **Bloqueo**: Falta que el usuario proporcione las URLs o archivos PDF oficiales.

### 3. Chat con IA Normativo
*   **Dificultad**: 🔴 **Difícil** (Requiere Backend + OpenAI/Gemini API + Costos)
*   **Descripción**: Chatbot que responda preguntas sobre la ley basándose en documentos PDF.
*   **Estado**: Idea Conceptual (Fuera del alcance actual).

---

## 🤖 Sugerencias Técnicas (Aportes de la IA)

Mejoras que sugiero para elevar la calidad, rendimiento y usabilidad del Visor.

### 1. Historial de Búsquedas Recientes
*   **Dificultad**: 🟢 **Fácil**
*   **Impacto**: Alto (Mejora UX)
*   **Descripción**: Guardar las últimas 5 direcciones/coordenadas consultadas en `localStorage` para que el usuario pueda volver a ellas rápidamente sin re-escribir.

### 2. Aplicación Instalable (PWA)
*   **Dificultad**: 🟡 **Medio**
*   **Impacto**: Muy Alto
*   **Descripción**: Convertir el Visor en una Progressive Web App. Permitiría a los ciudadanos "instalar" la app en su celular (Android/iOS) y acceder a ella desde un icono en el inicio, incluso con funcionalidades offline básicas (cache).

### 3. Modo Oscuro Automático
*   **Dificultad**: 🟡 **Medio**
*   **Impacto**: Medio (Estética/Accesibilidad)
*   **Descripción**: Detectar si el dispositivo del usuario está en modo oscuro y ajustar los colores de la interfaz (mapa oscuro, tarjetas oscuras) automáticamente.

### 4. Filtros de Capas por Alcaldía
*   **Dificultad**: 🔴 **Difícil** (Requiere PostGIS o Turf.js pesado)
*   **Impacto**: Alto
*   **Descripción**: Que al seleccionar una Alcaldía, se "apague" visualmente todo lo que está fuera de ella, para limpiar el mapa. Requiere operaciones geométricas complejas en el cliente.

### 5. Botón "Compartir Ubicación" (Share URL)
*   **Dificultad**: 🟡 **Medio**
*   **Impacto**: Alto (Viralidad)
*   **Descripción**: Generar una URL única (ej. `?lat=19.4&lng=-99.1`) que al abrirla cargue el visor directamente en ese punto y con el análisis abierto. Ideal para que vecinos se pasen la info por WhatsApp.

### 6. Herramienta de Medición (Regla)
*   **Dificultad**: 🟡 **Medio**
*   **Impacto**: Medio (Utilidad Técnica)
*   **Descripción**: Un botón para medir distancias lineales (ej. "A cuántos metros estoy de la barranca"). Mapbox tiene plugins para esto (`mapbox-gl-draw` o similar), pero hay que integrarlo con cuidado en la UI móvil.

### 7. Tutorial Guiado (Onboarding)
*   **Dificultad**: 🟢 **Fácil** / 🟡 **Medio** (Depende de la librería)
*   **Impacto**: Alto (Reducción de soporte)
*   **Descripción**: Cuando un usuario entra por primera vez, mostrar 3 pasos flotantes: "1. Busca aquí", "2. Toca el mapa", "3. Descarga tu ficha PDF". Se puede usar `driver.js`.

### 8. Reporte de Errores en Datos
*   **Dificultad**: 🟢 **Fácil** (Link a Google Forms) / 🔴 **Difícil** (Formulario integrado)
*   **Impacto**: Medio (Calidad de datos)
*   **Descripción**: Si un vecino ve que su calle está mal zonificada, un botón discretito "¿Ves un error?" que abra un Google Form prellenado con la coordenada. Es la forma más barata de limpiar tus datos.

---

## 🛠️ Deuda Técnica y Mantenimiento

Cosas que "funcionan" pero podrían estar mejor estructuradas.

### Validación de Dirección en PDF
*   **Dificultad**: 🟡 **Medio**
*   **Descripción**: Asegurar que la dirección escrita por el usuario se pase fielmente al PDF. Actualmente a veces se pierde si el usuario navega por el mapa después de buscar.

### Simbología Incrustada en Mapa PDF
*   **Dificultad**: 🔴 **Difícil**
*   **Descripción**: Generar una leyenda dinámica DENTRO de la imagen del mapa en el PDF. Es complejo porque `html2canvas` o la API de impresión de mapas no renderizan controles HTML superpuestos fácilmente.

---

## ✅ Implementado / Resuelto

*   **Resumen Ciudadano (Versión Normativa)**: Se implementó una versión basada en reglas (sin AI costosa) que traduce las claves (RE, FC) a explicaciones claras.
*   **Diseño UI/UX (Glassmorphism)**: Se aplicaron paneles semitransparentes (`.glass-panel`) en Sidebar, Leyenda y Modales para modernizar la interfaz.
*   **Motion Design (Animaciones Orgánicas)**: Se suavizaron las entradas de modales y botones con efectos de resorte (`spring physics`) y escala.
*   **Lenguaje Humano**: Se reescribieron los mensajes de error y estado para ser más amables y menos técnicos.
*   **Paleta de Colores Natural**: Se integró un fondo con degradado suave (`--bg-soft-gradient`) y se ajustaron los tonos institucionales para reducir la fatiga visual.

---

## 🔮 Nuevas Propuestas de Innovación (Fase 2)

Ideas para llevar el Visor al siguiente nivel de **interactividad** y **utilidad**.

### 1. Búsqueda por Voz (Dictado) 🎤
*   **Dificultad**: 🟢 **Fácil** (Web Speech API nativa)
*   **Impacto**: Alto (Accesibilidad)
*   **Descripción**: Agregar un icono de micrófono en la barra de búsqueda. Al tocarlo, el usuario dicta "Calle Reforma 222" y el sistema transcribe y busca.

### 2. Guardar "Mis Puntos Favoritos" ⭐
*   **Dificultad**: 🟡 **Medio** (LocalStorage)
*   **Impacto**: Alto (Retención)
*   **Descripción**: Permitir marcar ubicaciones con una estrella. Estos puntos se guardan localmente para acceso rápido ("Casa", "Oficina").

### 3. Modo de Comparación (A/B) ⚖️
*   **Dificultad**: 🔴 **Difícil** (Lógica UI compleja)
*   **Impacto**: Muy Alto (Utilidad Profesional)
*   **Descripción**: Pantalla dividida para seleccionar dos puntos en el mapa y comparar sus fichas normativas lado a lado.

### 4. Capa de "Edificios 3D" (Visualización) 🏢
*   **Dificultad**: 🟡 **Medio** (Plugin Leaflet/OSM)
*   **Impacto**: Medio (Estética)
*   **Descripción**: Usar una capa de vector tiles para levantar volúmenes simples en el mapa al hacer zoom máximo.

### 5. Generador de "Share Card" para Redes 📱
*   **Dificultad**: 🟡 **Medio** (html2canvas)
*   **Impacto**: Alto (Viralidad)
*   **Descripción**: Generar una imagen cuadrada atractiva con el mapa y el resumen, lista para compartir en WhatsApp.

---

## 🏛️ Diseño Web Institucional 2.0 (Premium & Authority)

Mejoras visuales enfocadas específicamente en elevar la **seriedad**, **confianza** y **modernidad** institucional.

### 1. Tipografía "Serif" para Autoridad
*   **Dificultad**: 🟢 **Fácil**
*   **Descripción**: Introducir una tipografía Serif moderna (ej. *Merriweather* o *Playfair Display*) exclusivamente para Títulos y Encabezados grandes. Esto connota tradición y seriedad legal, contrastando elegantemente con la *Roboto* (sans-serif) del cuerpo técnico.

### 2. Micro-Patrones de Textura (Identidad Territorial)
*   **Dificultad**: 🟡 **Medio**
*   **Descripción**: Reemplazar fondos planos por sutiles patrones SVG de curvas de nivel (topografía) o tramas abstractas al 2% de opacidad. Refuerza que es una herramienta de *territorio* sin ensuciar la vista.

### 3. Visualización de Datos "Hero" (Dashboard)
*   **Dificultad**: 🟡 **Medio**
*   **Descripción**: Rediseñar la Ficha Técnica para que los datos clave (Zonificación, Metros Cuadrados) se vean como "KPIs" financieros grandes y limpios, en lugar de tablas aburridas. Estilo "Dashboard Ejecutivo".

### 4. Sello de Verificación Animado
*   **Dificultad**: 🟢 **Fácil**
*   **Descripción**: Al terminar el análisis, mostrar una animación sutil de un "Sello Oficial" o "Check Verificado" que se estampa. Da una sensación psicológica de validez y certeza jurídica al usuario.

### 5. Header "App-Like" (Transiciones)
*   **Dificultad**: 🟡 **Medio**
*   **Descripción**: Que el encabezado superior sea transparente al inicio (mostrando el mapa completo) y se vuelva sólido/glass al hacer scroll o interactuar. Maximiza el área visible del mapa.
