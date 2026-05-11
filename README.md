# vper Design Tokens

> Pipeline oficial de Design Tokens para **vper-web** — de Figma a código, sin fricción.

---

## ¿Qué es esto?

Este repositorio es la **fuente de verdad** de todos los tokens de diseño del sistema **vper**. Convierte las variables de Figma en artefactos listos para consumo en cualquier stack: CSS custom properties, JavaScript ESM y (próximamente) Tailwind, Android y iOS.

```
Figma Variables
     │
     ▼  (export manual o Variables API)
source/raw/{collection}.json
     │
     ▼  python figma-to-sd.py
source/{collection}.json          ← DTCG / Style Dictionary v4
     │
     ▼  npm run build
build/tokens.css                  ← CSS Custom Properties (:root)
build/tokens.js                   ← ES Module
```

---

## Estructura del repositorio

```
design-system/tokens/
├── source/
│   ├── raw/                      # JSONs exportados directamente de Figma (no editar)
│   │   ├── numbers.json
│   │   ├── primitivos.json
│   │   ├── semanticos.json
│   │   └── componentes.json
│   ├── numbers.json              # ← generado por figma-to-sd.py
│   ├── primitivos.json
│   ├── semanticos.json
│   └── componentes.json
├── build/
│   ├── tokens.css                # CSS Custom Properties (output final)
│   └── tokens.js                 # ES Module (output final)
├── figma-to-sd.py                # Script de transformación Figma → Style Dictionary
├── style-dictionary.config.js    # Configuración Style Dictionary v4
└── package.json
```

---

## Colecciones de tokens

| Colección | Descripción | Ejemplos |
|---|---|---|
| `numbers` | Escala numérica base (espaciado, breakpoints) | `scale/xs`, `breakpoint/md` |
| `primitivos` | Paleta de colores y valores concretos | `color.brand.orange.500`, `spacing.4` |
| `semanticos` | Tokens con intención de uso | `background.base`, `text.color.primary`, `focus.ring-color` |
| `componentes` | Tokens por componente UI | `button.base.radius`, `card.padding`, `input.bg` |

### Jerarquía de referencia

```
componentes → semanticos → primitivos → numbers
```

Los tokens de nivel inferior **nunca** referencian hacia arriba. Los alias se resuelven automáticamente en el build.

---

## Quickstart

### Requisitos

- Node.js ≥ 18
- Python ≥ 3.9
- npm

### Instalación

```bash
cd design-system/tokens
npm install
```

### Flujo completo (desde Figma)

**Paso 1 — Exportar variables de Figma**

Exporta cada colección como JSON y colócala en `source/raw/`:

```
source/raw/numbers.json
source/raw/primitivos.json
source/raw/semanticos.json
source/raw/componentes.json
```

Se soportan dos formatos de exportación:
- **Figma Variables API** `{ id, name, modes, variables: [...] }`
- **DTCG legacy** `{ "collection": { modes: { "Mode 1": {...} } } }`

**Paso 2 — Transformar a Style Dictionary**

```bash
python figma-to-sd.py
```

Output esperado:
```
Figma → Style Dictionary

✓ Mapa de IDs construido: 312 variables

✓ numbers.json     → source/numbers.json     (24 tokens)
✓ primitivos.json  → source/primitivos.json  (148 tokens)
✓ semanticos.json  → source/semanticos.json  (89 tokens)
✓ componentes.json → source/componentes.json (51 tokens)

✓ Total: 312 tokens procesados
  Ejecuta: npm run build
```

**Paso 3 — Compilar**

```bash
npm run build
```

Genera `build/tokens.css` y `build/tokens.js`.

### Watch mode (desarrollo activo)

```bash
npm run watch
```

Recompila automáticamente cuando cambia cualquier JSON en `source/`.

---

## Uso en código

### CSS / HTML

```html
<link rel="stylesheet" href="path/to/build/tokens.css" />
```

```css
.button {
  background-color: var(--brand-main);
  border-radius: var(--button-base-radius);
  padding: var(--button-size-md-padding-y) var(--button-size-md-padding-x);
  color: var(--text-color-inverse);
  font-size: var(--button-text-size-md);
  font-weight: var(--button-base-font-weight);
  transition: var(--button-base-transitions);
}

.button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-offset);
}
```

### JavaScript / TypeScript

```js
import tokens from './build/tokens.js';

const primaryColor = tokens.brand.main.$value;           // "#f98516"
const cardRadius   = tokens.card.radius.$value;          // "12px"
const buttonOpacity = tokens.button.disabled.opacity.$value; // 0.4
```

### Tailwind CSS

Importa las variables CSS directamente en tu config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          main: 'var(--brand-main)',
          subtle: 'var(--brand-subtle)',
        },
        surface: {
          base: 'var(--surface-base)',
          raised: 'var(--surface-raised)',
        },
      },
      borderRadius: {
        card: 'var(--card-radius)',
        button: 'var(--button-base-radius)',
      },
      spacing: {
        // mapear escala si se requiere
      },
    },
  },
};
```

---

## Transformaciones automáticas

El script `figma-to-sd.py` aplica las siguientes correcciones al exportar:

| Colección | Transformación | Razón |
|---|---|---|
| `primitivos` | Renombra `border` → `border-width` | Evita colisión de namespace con `border` de semánticos |
| `primitivos` | Agrega `spacing.7 = 28px` | Gap faltante en la escala 4px de Figma |
| `numbers` | Agrupa escalas bajo clave `scale` | Evita contaminación del namespace global de SD |
| `semanticos` | Elimina `focus.ring.color` | Evita colisión con `focus.ring-color` (mismo CSS var) |
| Global | Convierte floats de dimensión a `"Npx"` | CSS custom properties requieren unidad explícita |

### Tokens que reciben unidad `px` automáticamente

- `spacing/*`
- `radius/*`
- `border-width/*`
- `typography/size/*`
- `button/text-size/*`
- `button/size/*/padding-x`, `padding-y`
- `card/padding`, `card/radius`
- `input/radius`, `input/padding-x`, `input/padding-y`
- `pill/*/padding-x`, `pill/*/padding-y`
- `layout/*/padding-x`, `layout/*/padding-y`, `layout/*/gap-x`

### Manejo de colores con alpha

Los colores con `alpha < 1.0` se exportan como `$type: string` en formato `rgba()` para preservar la precisión del canal alpha. Style Dictionary trata los `rgba()` como strings opacos, evitando pérdida de datos.

---

## Convenciones de nomenclatura

Los tokens siguen la convención DTCG (`$type` / `$value`) y se compilan a CSS custom properties con la siguiente transformación de path:

```
button / base / radius  →  --button-base-radius
text / color / primary  →  --text-color-primary
focus / ring-color      →  --focus-ring-color
```

Reglas:
- Separador: guión (`-`)
- Todo en minúsculas
- Los `/` de Figma se convierten en `-` en CSS

---

## Outputs generados

### `build/tokens.css`

```css
/**
 * Do not edit directly, this file was auto-generated.
 */
:root {
  --brand-main: #f98516;
  --button-base-radius: 9999px;
  --button-base-font-weight: 500;
  --button-base-transitions: background 150ms ease, border 150ms ease, transform 100ms ease;
  --card-bg: #050505;
  --card-radius: 12px;
  --card-padding: 20px;
  /* ... */
}
```

### `build/tokens.js`

```js
export default {
  brand: { main: { $type: "color", $value: "#f98516", ... } },
  button: { base: { radius: { $type: "dimension", $value: "9999px", ... } } },
  /* ... */
}
```

---

## Para el equipo de desarrollo

### ¿Cómo consumo los tokens?

Recibe los archivos del build (`tokens.css` y/o `tokens.js`) vía npm, CDN interno, o import directo en el repo. **No copies los JSON de `source/` — esos son archivos intermedios.**

### ¿Puedo agregar tokens directamente en los JSON de `source/`?

Solo en casos excepcionales y coordinados con diseño. Los archivos en `source/` son sobreescritos cada vez que se corre `figma-to-sd.py`. Los overrides permanentes deben hacerse en `figma-to-sd.py` (ver sección de Transformaciones).

### ¿Qué hago si un token no existe todavía en Figma?

Crear un token provisional directamente en el JSON de `source/` y abrir un ticket en Figma para agregarlo al sistema. El token provisional será sobreescrito cuando llegue desde Figma, así que documentar el override.

### ¿Cómo manejo el tema oscuro / light mode?

Actualmente el pipeline exporta el primer modo disponible de cada colección. La implementación de modo oscuro será mediante colecciones separadas o CSS overrides bajo clase `.dark`. Roadmap en `primeros pasos/PROXIMOS-PASOS-VPER.md`.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run build` | Compila `source/*.json` → `build/tokens.css` + `build/tokens.js` |
| `npm run watch` | Watch mode: recompila al detectar cambios en `source/` |
| `python figma-to-sd.py` | Transforma exports de Figma → JSONs listos para Style Dictionary |

---

## Preguntas frecuentes

**¿Por qué Python y no JS para la transformación?**
El script de transformación necesita lógica de parseo de colores (r/g/b floats → hex/rgba), manejo de formatos de exportación de Figma y correcciones específicas por colección. Python permite iterar rápido y es más legible para lógica de transformación de datos.

**¿Por qué Style Dictionary v4 y no Theo, Stitches u otros?**
Style Dictionary v4 es el estándar de facto para sistemas de diseño enterprise, soporta DTCG nativamente, tiene integración con todas las plataformas objetivo (CSS, JS, iOS, Android) y tiene el ecosistema más activo.

**¿Los tokens tienen versionado semántico?**
El repositorio usa versionado en `package.json`. Se recomienda seguir semver: patch para correcciones de valores, minor para tokens nuevos, major para renombramientos o eliminaciones.

---

## Contribuir

1. Cambios de diseño → editar en Figma primero
2. Exportar colecciones afectadas a `source/raw/`
3. Correr `python figma-to-sd.py` y verificar el diff en `source/`
4. Correr `npm run build` y verificar el diff en `build/`
5. Abrir PR con contexto del cambio de diseño

Los cambios directos a archivos de `source/` (sin pasar por Figma) deben ser coordinados con el equipo de diseño y documentados en el PR.

---

## Mantenido por

Equipo de Diseño · vper  
Para dudas o issues: abrir ticket en el repositorio o contactar al lead de design system.
