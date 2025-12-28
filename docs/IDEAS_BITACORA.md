# 📓 Bitácora de Ideas y Futuras Implementaciones

Este documento sirve como un espacio centralizado para registrar ideas, mejoras y nuevas funcionalidades que surgen durante el desarrollo pero que se programarán para una etapa posterior.

---

## 💡 Ideas Nuevas

### Enlace a Programas de Manejo ANP (PDF)
- **Descripción:** El recuadro de "Régimen ANP" en el PDF (específicamente para Suelo Urbano Estándar dentro de ANP) debe incluir un enlace clicable y visible a los Programas de Manejo.
- **Contexto:** Requisito legal/informativo.
- **Estado:** ⏳ En espera de archivos PDF (Usuario debe proporcionarlos).

### Chat con IA Normativo
- **Descripción:** Incorporar un asistente de Inteligencia Artificial (Chatbot) entrenado con los documentos normativos y jurídicos del sistema.
- **Objetivo:** Permitir al usuario realizar preguntas en lenguaje natural sobre la normatividad aplicable y recibir respuestas fundamentadas en los textos legales.
- **Estado:** ⬜ Idea Conceptual

> *Agrega tus nuevas ideas aquí...*

---

## 🛠️ Mejoras Técnicas

### [Ejemplo: Optimización de Carga de Capas]
- **Descripción:** Implementar lazy loading para las capas de GeoJSON pesadas.
- **Estado:** ⬜ Pendiente

### Revisión de Estructura de Folios
- **Descripción:** Investigar y validar cómo se están generando los folios (IDs) de las fichas.
- **Contexto:** Asegurar que sigan un formato consistente o estandarizado.
- **Estado:** ⬜ Pendiente de investigar

### Revisión de Nombres de Archivos PDF
- **Descripción:** Verificar los patrones de nombrado para los archivos PDF descargados (CDMX vs Externos vs Legacy).
- **Contexto:** Confirmar consistencia gramatical y de formato.
- **Estado:** ⬜ Pendiente de investigar

### Validación de Dirección en PDF
- **Descripción:** Verificar que cuando el usuario busca por dirección (barra de búsqueda), esta se refleje correctamente en el campo "Ubicación del Predio" del PDF.
- **Contexto:** Actualmente a veces muestra coordenadas o dirección genérica.
- **Estado:** ⬜ Pendiente de validar

### Geocodificación Inversa para Coordenadas
- **Descripción:** Al ingresar una coordenada manual, buscar y mostrar una dirección cercana aproximada ("Reverse Geocoding").
- **Alcance:** Mostrarla tanto en la tarjeta de resultados UI como en la ficha PDF.
- **Estado:** ⬜ Pendiente de análisis (requiere API de geocodificación o servicio inverso).

### Simbología en Mapa PDF
- **Descripción:** Incrustar una leyenda o simbología de las capas visibles directamente sobre la imagen del mapa generada en el PDF.
- **Contexto:** Mejorar la interpretación del mapa estático.
- **Estado:** ⬜ Pendiente de implementación gráfica.

> *Agrega tus mejoras técnicas aquí...*

---
## 3. "Resumen Ciudadano" (Generador de Explicaciones)
**El Problema:** La ficha técnica es árida y administrativa.
**La Solución AI:**
- Generar un párrafo de "lenguaje claro" al inicio de la ficha.
- **Prompt:** "Toma estos datos JSON (`status: CONSERVATION`, `zoning: RE`) y explícalos a un niño de 10 años."
- **Resultado en Visor:** *"Estás en una zona ecológica importante llamada **Rescate Ecológico**. Esto significa que la prioridad aquí es recuperar el bosque. Por eso, no está permitido construir nuevas casas ni calles, pero sí puedes plantar árboles o tener cultivos que ayuden al suelo."*



## 🎨 Mejoras de UI/UX

En desktop agregar un poton de buscar como que ahora la unica opcion es darle enter si copio y pego coordenada .



> *Agrega tus mejoras de diseño aquí...*

## 📝 Notas Rápidas
*   [Espacio para anotaciones rápidas o recordatorios sin formato específico]
