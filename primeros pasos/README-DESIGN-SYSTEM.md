# Design System Pipeline — Figma → Code
## Ricardo Arce · Mayo 2026

---

## Qué es esto

Un pipeline que mantiene Figma como fuente de verdad para colores,
tipografía y spacing. Cuando algo cambia en Figma, el código se
actualiza en minutos — sin editar CSS a mano.

Funciona en cualquier proyecto: WordPress, React, HTML estático.

---

## Cómo funciona — el ciclo completo

```
┌─────────────────────────────────────────────────────────────┐
│                         FIGMA                               │
│  Collections: numbers · primitivos · semanticos · componentes│
│  Ejemplo: brand/main → color/brand/orange/500 → #f98516     │
└──────────────────────────┬──────────────────────────────────┘
                           │ Plugin: Export/Import Variables
                           │ (gratis, 81k usuarios)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              source/raw/  (JSON crudos de Figma)            │
│  numbers.json · primitivos.json                             │
│  semanticos.json · componentes.json                         │
│                                                             │
│  Formato interno de Figma:                                  │
│  { "id": "VariableID:736:358",                             │
│    "type": "COLOR",                                         │
│    "valuesByMode": { "736:4": { r:1, g:0, b:0.25 } } }    │
└──────────────────────────┬──────────────────────────────────┘
                           │ python3 figma-to-sd.py
                           │ · Convierte RGBA flotante → hex
                           │ · Resuelve VariableID → {token.path}
                           │ · Agrega unidades px donde corresponde
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              source/  (JSON en formato Style Dictionary)    │
│                                                             │
│  Formato Style Dictionary:                                  │
│  { "brand": {                                              │
│      "main": { "$type": "color",                           │
│                "$value": "{color.brand.orange.500}" } } }   │
└──────────────────────────┬──────────────────────────────────┘
                           │ npm run build (Style Dictionary)
                           │ · Resuelve todas las referencias
                           │ · Genera CSS custom properties
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         design-system/tokens/build/tokens.css               │
│                                                             │
│  :root {                                                    │
│    --color-brand-orange-500: #f98516;                      │
│    --brand-main: var(--color-brand-orange-500);            │
│    --spacing-4: 16px;                                      │
│    --radius-md: 8px;                                       │
│    --typography-size-md: 16px;                             │
│    --button-primary-bg: var(--brand-main);                 │
│    ... 300+ variables más                                   │
│  }                                                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ Integración según el proyecto
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROYECTO FINAL                           │
│                                                             │
│  WordPress:   wp_enqueue_style() en functions.php           │
│  React/Vite:  import './tokens.css' en main.jsx            │
│  HTML:        <link href="tokens.css">                      │
│                                                             │
│  CSS del proyecto usa:                                      │
│    color: var(--brand-main);          /* naranja Figma */   │
│    padding: var(--spacing-4);         /* 16px */            │
│    border-radius: var(--radius-md);   /* 8px */             │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura de archivos

```
design-system/
└── tokens/
    ├── figma-to-sd.py          ← Script de transformación Figma → SD
    ├── style-dictionary.config.js  ← Config del build
    ├── package.json
    ├── source/
    │   ├── raw/                ← SOLO aquí van los exports de Figma
    │   │   ├── numbers.json
    │   │   ├── primitivos.json
    │   │   ├── semanticos.json
    │   │   └── componentes.json
    │   ├── numbers.json        ← Generados por figma-to-sd.py
    │   ├── primitivos.json       NO editar manualmente
    │   ├── semanticos.json
    │   └── componentes.json
    └── build/
        ├── tokens.css          ← OUTPUT FINAL — solo este va al proyecto
        └── tokens.js           ← Mismo contenido en JavaScript
```

---

## Las 4 colecciones de Figma y qué contienen

### numbers
Valores numéricos sin semántica: escalas de spacing, opacidades,
breakpoints, duraciones de motion, border widths.
→ Se convierten en variables como `--spacing-4`, `--opacity-72`

### primitivos
Paleta de colores completa y escala tipográfica base.
Blue, Orange, Red, Green, Neutral en pasos de 50-950.
→ Se convierten en `--color-brand-orange-500: #f98516`

### semanticos
Tokens con significado: brand, texto, fondos, bordes, feedback.
Referencian primitivos (`brand/main → color/brand/orange/500`).
→ Se convierten en `--brand-main: var(--color-brand-orange-500)`

### componentes
Tokens de componentes específicos: button, card, input, nav, pill.
Referencian semánticos (`button/primary/bg → brand/main`).
→ Se convierten en `--button-primary-bg: var(--brand-main)`

---

## Las 3 capas del sistema

```
Capa 1 — PRIMITIVOS (valores base, no usar directo en CSS)
  --color-brand-orange-500: #f98516

Capa 2 — SEMÁNTICOS (significado, usar en componentes)
  --brand-main: var(--color-brand-orange-500)

Capa 3 — COMPONENTES (uso específico)
  --button-primary-bg: var(--brand-main)
```

**Regla de oro:** en CSS del proyecto siempre usar la capa más
específica disponible.
- MAL: `color: #f98516`
- MAL: `color: var(--color-brand-orange-500)`
- BIEN: `color: var(--brand-main)`
- MEJOR: `color: var(--button-primary-bg)` (si es un botón primario)

---

## Ciclo de actualización — paso a paso

### Cuando cambia algo en Figma:

**1. En Figma**
- Abre la colección correspondiente (generalmente `semanticos`)
- Cambia la referencia del token (ej: `brand/main` de orange a blue)
- Plugins → Export/Import Variables → Export to JSON en las 4 colecciones
- Guarda los 4 archivos en `design-system/tokens/source/raw/`

**2. En terminal**
```bash
cd ~/tu-proyecto/design-system/tokens
python3 figma-to-sd.py && npm run build
```

**3. En el browser**
- `Cmd+Shift+R` para hard refresh
- El cambio es visible de inmediato

**Tiempo total: menos de 2 minutos.**

---

## Integración por stack

### React + Vite (VPER)
```jsx
// src/main.jsx — primera línea
import '../design-system/tokens/build/tokens.css'
```

```css
/* cualquier CSS Module */
.hero__title {
  color: var(--text-color-primary);
  font-size: var(--typography-size-display);
}
```

### WordPress (Divergentes)
```php
// functions.php
wp_enqueue_style(
  'design-tokens',
  get_stylesheet_directory_uri() . '/design-system/tokens/build/tokens.css',
  array(),
  filemtime(get_stylesheet_directory() . '/design-system/tokens/build/tokens.css')
);
```

### HTML estático
```html
<link rel="stylesheet" href="design-system/tokens/build/tokens.css">
```

---

## Proyectos que usan este sistema

| Proyecto | Stack | Estado |
|---|---|---|
| Divergentes | WordPress + PHP + Bootstrap | ✓ Productivo |
| VPER | Vite + React + CSS Modules | Pipeline listo, pendiente React app |

---

## Herramientas necesarias

| Herramienta | Para qué | Costo |
|---|---|---|
| Figma | Diseño y variables | Plan existente |
| Export/Import Variables | Plugin de Figma para exportar | Gratis |
| Python 3 | Correr figma-to-sd.py | Gratis |
| Node.js + npm | Correr Style Dictionary | Gratis |
| Style Dictionary | Compilar tokens a CSS | Gratis (npm) |
