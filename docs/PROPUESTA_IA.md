# 🤖 Propuestas de IA para el Visor Ciudadano (Sin Capa de Predios)

Considerando que **NO contamos con geometría de predios** (solo coordenadas Lat/Lng y las capas de zonificación actuales), aquí tienes 4 estrategias viables para integrar Inteligencia Artificial.

El enfoque central es: **"Interpretar la Normatividad para el Ciudadano"**.

---

## 1. Buscador Semántico de Usos ("El Traductor de Intenciones")
**El Problema:** El usuario común no busca "Comercio de productos básicos". Busca *"poner una tiendita"*, *"abrir un taller"* o *"construir mi casa"*.
**La Solución AI:**
- El usuario escribe en un campo libre: *"¿Puedo poner una cafetería aquí?"*.
- **IA (Embeddings):** Compara la intención ("cafetería") contra el catálogo oficial de actividades permitidas/prohibidas que YA tienes en la ficha (`analysis.allowedActivities`).
- **Respuesta:** "Sí, 'cafetería' entra en la categoría **'Servicios de Alimentos y Bebidas'** que está **PERMITIDA** en esta zona." o "No, porque es Suelo de Conservación y solo se permiten actividades rurales."

**Viabilidad Técnica:** Alta. Solo requieres enviar la lista de actividades del punto + la pregunta del usuario a un modelo (OpenAI/Gemini).

## 2. Asistente Normativo Contextual (RAG)
**El Problema:** La ficha dice "Zonificación: FPE". El usuario no sabe qué implica legalmente ni qué artículos lo sustentan.
**La Solución AI:**
- Entrenar (o indexar) el **PGOEDF (Programa General)** y los **Programas de Manejo de ANPs** en una base de conocimientos.
- Cuando el usuario obtiene un resultado (ej. "Zonificación: PGOEDF - Forestal de Conservación"), aparece un chat.
- **Usuario:** "¿Qué requisitos necesito para cercar mi terreno aquí?"
- **IA:** Busca en el documento PDF del PGOEDF específicamente lo relativo a "cercas en suelo de conservación" y responde citando el artículo.

**Viabilidad Técnica:** Media. Requiere procesar los PDFs normativos y montar un pequeño backend de "Retrieval Augmented Generation".

## 3. "Resumen Ciudadano" (Generador de Explicaciones)
**El Problema:** La ficha técnica es árida y administrativa.
**La Solución AI:**
- Generar un párrafo de "lenguaje claro" al inicio de la ficha.
- **Prompt:** "Toma estos datos JSON (`status: CONSERVATION`, `zoning: RE`) y explícalos a un niño de 10 años."
- **Resultado en Visor:** *"Estás en una zona ecológica importante llamada **Rescate Ecológico**. Esto significa que la prioridad aquí es recuperar el bosque. Por eso, no está permitido construir nuevas casas ni calles, pero sí puedes plantar árboles o tener cultivos que ayuden al suelo."*

**Viabilidad Técnica:** Muy Alta. Es un simple prompt al API con el JSON del análisis.

## 4. Análisis de Riesgo/Recomendación (Basado en Capas)
**El Problema:** El usuario ve el mapa pero no interpreta la relación entre capas.
**La Solución AI:**
- Si el usuario cae cerca de una ANP (pero fuera de ella) o en una zona de transición.
- **IA:** Analiza la proximidad a capas sensibles.
- **Mensaje:** "Ojo: Aunque tu punto está fuera del ANP (a 50 metros), cualquier obra aquí podría requerir una **Manifestación de Impacto Ambiental (MIA)** más estricta debido a la cercanía con la zona protegida 'Cina de Santa Catarina'."

**Viabilidad Técnica:** Media. Requiere lógica geoespacial (`turf.js`) para calcular distancias a features cercanos y pasárselos a la IA para que evalúe la "sensibilidad" del contexto.

---

## 🚀 Recomendación de Inicio (MVP)

Te sugiero empezar por el **#3 (Resumen Ciudadano)** o el **#1 (Buscador Semántico)**.
Son los que añaden más valor inmediato sin necesitar una infraestructura compleja de bases de datos vectoriales.

¿Te interesa prototipar alguno de estos?
