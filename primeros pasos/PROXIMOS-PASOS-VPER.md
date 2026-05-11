# Próximos pasos — Design System VPER
## Qué construir ahora y cómo ayudar al desarrollador

---

## Estado actual

```
✓ Pipeline Figma → tokens.css funcionando
✓ Ciclo de actualización probado (cambio en Figma → visible en browser)
✓ index.html de referencia usando 100% tokens
✓ Estructura limpia en vper-web/
⏳ App Vite + React pendiente (Heriberto la está construyendo)
```

---

## Sí — puedes crear componentes que le sirvan al desarrollador

El `index.html` que ya tienes ES la referencia de componentes.
Heriberto puede ver cada componente, inspeccionar el CSS y
saber exactamente qué tokens usar cuando lo migre a React.

Pero puedes ir más lejos. Aquí están los próximos pasos en orden
de mayor a menor valor:

---

## Paso 1 — Documentar los componentes del index.html (AHORA)

El `index.html` tiene 5 componentes ya construidos y funcionando:
- Nav / Header
- Hero
- Logo Strip (marquee)
- Work Grid con filtros
- Contact Form

Para cada uno, crear un comentario de documentación en el HTML:

```html
<!--
  COMPONENTE: Button Primary
  ─────────────────────────
  Tokens usados:
    background:    var(--button-primary-bg)       → brand-main
    border:        var(--button-primary-border)    → brand-main
    color:         var(--button-primary-text)      → text-color-inverse
    border-radius: var(--button-base-radius)       → radius-full
    padding:       var(--button-size-xl-padding-y) var(--button-size-xl-padding-x)

  Variantes: btn--primary / btn--secondary
  Estados: hover, active, focus-visible
-->
<a href="#" class="btn btn--primary">View Work</a>
```

Esto le da a Heriberto toda la información para crear el componente
React sin tener que adivinar qué token va en cada propiedad.

---

## Paso 2 — Separar cada componente en su propio archivo HTML

En vez de todo en `index.html`, crear:

```
vper-web/
  components/
    button.html       ← solo botones, todas las variantes
    nav.html          ← header + hamburger + desktop
    hero.html         ← hero completo
    card.html         ← work card, todas las variantes
    pill.html         ← pill + filtros
    form.html         ← inputs, textarea, labels
    logo-strip.html   ← marquee
```

Cada archivo tiene:
1. El HTML del componente
2. Solo el CSS de ese componente (sin el resto)
3. Los tokens que usa documentados en comentarios
4. Los estados: default, hover, active, focus, disabled

---

## Paso 3 — Crear un archivo de referencia para Heriberto

Un documento `COMPONENTES-PARA-HERIBERTO.md` que diga:

```markdown
# Componentes disponibles — VPER Design System

## Button

### HTML de referencia (index.html)
<a class="btn btn--primary">Label</a>
<a class="btn btn--secondary">Label</a>

### CSS Module equivalente en React
import styles from './Button.module.css'

<button className={styles.btnPrimary}>Label</button>

### Tokens a usar en Button.module.css
.btnPrimary {
  background-color: var(--button-primary-bg);
  border: 2px solid var(--button-primary-border);
  color: var(--button-primary-text);
  border-radius: var(--button-base-radius);
  padding: var(--button-size-md-padding-y) var(--button-size-md-padding-x);
  font-weight: var(--typography-weight-bold);
  font-size: var(--button-text-size-md);
  transition: background-color 150ms ease, border-color 150ms ease;
}

.btnPrimary:hover {
  background-color: var(--button-primary-bg-hover);
  border-color: var(--button-primary-bg-hover);
}
```

---

## Paso 4 — Cuando Heriberto tenga el React listo

Único paso de integración:

**1.** Copiar `design-system/tokens/build/tokens.css` al repo de React
   o agregar el directorio `design-system/` al repo.

**2.** En `src/main.jsx`:
```jsx
import '../design-system/tokens/build/tokens.css'
// o si lo copiaron directamente:
import './tokens.css'
```

**3.** Desde ese momento todos los CSS Modules del proyecto
   pueden usar cualquier `var(--token)` del sistema.

**4.** Cuando cambies algo en Figma, el flujo para actualizar React es:
```bash
# Tu máquina (o CI en el futuro):
python3 figma-to-sd.py && npm run build
# Copiar/subir el tokens.css actualizado al repo
# Heriberto hace pull y ya
```

---

## Paso 5 — Automatizar con GitHub Actions (futuro)

Cuando el proyecto esté en producción, automatizar el ciclo:

```yaml
# .github/workflows/tokens.yml
name: Update Design Tokens
on:
  push:
    paths: ['design-system/tokens/source/raw/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pip install pathlib
      - run: python3 design-system/tokens/figma-to-sd.py
      - run: cd design-system/tokens && npm ci && npm run build
      - run: git commit -am "chore: update tokens from Figma" && git push
```

Flujo resultante: exportas de Figma, subes los raw JSON a GitHub,
el Action corre solo y el tokens.css se actualiza en el repo.

---

## Resumen de prioridades

| # | Tarea | Tiempo | Valor |
|---|---|---|---|
| 1 | Documentar tokens en index.html | 1h | Alto — Heriberto lo necesita |
| 2 | Separar componentes en archivos | 2h | Alto — referencia limpia |
| 3 | COMPONENTES-PARA-HERIBERTO.md | 1h | Alto — entrega profesional |
| 4 | Integrar en React cuando esté listo | 30min | Crítico — el objetivo final |
| 5 | GitHub Actions | 2h | Medio — optimización futura |

---

## Lo que Heriberto necesita de ti ahora

Solo esto: el `index.html` visual y funcionando para que sepa
exactamente cómo se ven y comportan los componentes.

No necesita el pipeline — ese es tuyo. Solo necesita la referencia
visual y los nombres de tokens para cada propiedad CSS.
