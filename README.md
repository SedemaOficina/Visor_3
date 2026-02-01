# Visor de Consulta Ciudadana (V-3)

Aplicación web para la consulta de normatividad urbana y ambiental de la Ciudad de México (SEDEMA).

## Arquitectura

Este proyecto utiliza una arquitectura moderna basada en **Vite** + **React**.

### Stack Tecnológico
- **Build System**: Vite
- **Framework**: React 18
- **Estilos**: Tailwind CSS
- **Mapas**: Leaflet / React-Leaflet
- **Pruebas**: Vitest + React Testing Library
- **Linting**: ESLint

### Estructura de Directorios

```
/
├── public/               # Assets estáticos
├── src/
│   ├── components/       # Componentes React
│   │   ├── analysis/     # Lógica de resultados (Atomizada)
│   │   │   ├── cards/    # Tarjetas de información
│   │   │   ├── controllers/ # Controladores lógicos (Búsquedas, Filtros)
│   │   │   └── ui/       # UI específica de análisis
│   │   ├── layout/       # Estructura principal (Sidebar, MapViewer)
│   ├── hooks/            # Custom Hooks (useVisorState)
│   ├── utils/            # Funciones de ayuda
│   │   └── domain/       # Reglas de negocio (zoningRules.js)
│   └── test/             # Configuración de pruebas
├── index.html            # Punto de entrada
└── vite.config.js        # Configuración de Vite/Vitest
```

## Desarrollo

### Instalación
```bash
npm install
```

### Ejecutar Localmente
```bash
npm run dev
```

### Pruebas Automatizadas
El proyecto cuenta con pruebas unitarias para validar las reglas de negocio.
```bash
npm test
```

### Linting
Para verificar la calidad del código:
```bash
npm run lint
```

## Despliegue
La aplicación se construye para producción en la carpeta `docs/` (configuración para GitHub Pages).
```bash
npm run build
```
