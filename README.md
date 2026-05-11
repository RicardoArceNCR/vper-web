# vper-web

Sitio web oficial de **VPER Media** — agencia creativa enfocada en campañas, contenido y experiencias digitales.

Stack actual:

* React 18
* Vite
* CSS Modules
* Design Tokens
* Figma Variables
* Style Dictionary

El proyecto utiliza una arquitectura moderna basada en:

```txt
Figma → JSON → Style Dictionary → tokens.css → React Components
```

---

# Estado actual

## Arquitectura

```txt
✓ Vite + React funcionando
✓ CSS Modules integrados
✓ Design Tokens funcionando
✓ Pipeline Figma → Style Dictionary estable
✓ tokens.css consumido automáticamente por React
✓ Arquitectura UI reusable creada
✓ Footer enterprise responsive
✓ Container responsive
✓ Section reusable
✓ Sistema de spacing funcional
✓ Social icons premium
✓ Responsive mobile funcional
```

## Pendiente

```txt
⏳ Formulario conectado con backend
⏳ Work cards con contenido real
⏳ Sección Services
⏳ Sección About
⏳ SEO completo
⏳ Deploy producción
```

---

# Arquitectura completa del sistema

```txt
┌─────────────────────────────────────────────────────────────────┐
│ FIGMA                                                          │
│ Collections:                                                   │
│ - numbers                                                      │
│ - primitivos                                                   │
│ - semanticos                                                   │
│ - componentes                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ Export JSON
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ design-system/tokens/source/raw/                               │
│                                                                │
│ numbers.json                                                   │
│ primitivos.json                                                │
│ semanticos.json                                                │
│ componentes.json                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ python3 figma-to-sd.py
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ design-system/tokens/source/                                   │
│                                                                │
│ Tokens transformados y normalizados                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ npm run build
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ design-system/tokens/build/                                    │
│                                                                │
│ tokens.css                                                     │
│ tokens.js                                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ import en main.jsx
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ src/ React + CSS Modules                                       │
│                                                                │
│ Los componentes consumen variables CSS directamente            │
└────────────────────────────┬────────────────────────────────────┘
                             │ npm run build
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ dist/                                                          │
│                                                                │
│ Build final para producción                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

# Estructura del repositorio

```txt
vper-web/
│
├── design-system/
│   └── tokens/
│       ├── source/
│       │   ├── raw/
│       │   │   ├── numbers.json
│       │   │   ├── primitivos.json
│       │   │   ├── semanticos.json
│       │   │   └── componentes.json
│       │   │
│       │   ├── numbers.json
│       │   ├── primitivos.json
│       │   ├── semanticos.json
│       │   └── componentes.json
│       │
│       ├── build/
│       │   ├── tokens.css
│       │   └── tokens.js
│       │
│       ├── figma-to-sd.py
│       ├── style-dictionary.config.js
│       └── package.json
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   │
│   │   │   ├── Container/
│   │   │   │   ├── Container.jsx
│   │   │   │   └── Container.module.css
│   │   │   │
│   │   │   └── Section/
│   │   │       ├── Section.jsx
│   │   │       └── Section.module.css
│   │   │
│   │   ├── Nav/
│   │   ├── Hero/
│   │   ├── LogoStrip/
│   │   ├── Work/
│   │   ├── Contact/
│   │   └── Footer/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── dist/
├── index.html
├── package.json
└── vite.config.js
```

---

# Design System

## Filosofía

El proyecto sigue una arquitectura de tokens en capas:

```txt
Primitivos
↓
Semánticos
↓
Componentes
↓
React UI
```

---

## Colecciones

### numbers

Valores numéricos reutilizables:

```txt
- opacity
- breakpoints
- helpers
```

---

### primitivos

Tokens base:

```txt
- color
- spacing
- typography
- radius
- border
```

---

### semanticos

Tokens de intención UI:

```txt
- background
- surface
- text
- interaction
- focus
- feedback
- layout
- motion
```

---

### componentes

Tokens específicos de componentes:

```txt
- button
- nav
- pill
- input
```

---

# Arquitectura UI

## UI primitives

### Container

Responsable de:

```txt
- max-width
- padding lateral
- centrado
- responsive spacing
```

Uso:

```jsx
<Container>
  <Contenido />
</Container>
```

---

### Section

Responsable de:

```txt
- spacing vertical consistente
- separación entre bloques
```

Uso:

```jsx
<Section>
  <Contenido />
</Section>
```

---

### Button

Responsable de:

```txt
- variantes
- estados
- transitions
- accesibilidad
```

Uso:

```jsx
<Button variant="primary">
  Contact us
</Button>
```

---

# Tokens más usados

## Surface

```css
--surface-subtle
--surface-base
--surface-raised
--surface-hover
```

---

## Texto

```css
--text-color-primary
--text-color-secondary
--text-color-inverse
```

---

## Marca

```css
--brand-main
--brand-contrast
```

---

## Spacing

```css
--spacing-2
--spacing-4
--spacing-6
--spacing-8
--spacing-10
--spacing-12
--spacing-16
```

---

## Typography

```css
--typography-size-sm
--typography-size-md
--typography-size-xl
--typography-size-display
--typography-size-display-xl
```

---

## Motion

```css
--motion-fast
--motion-normal
--motion-slow
```

---

## Layout

```css
--layout-container-max-width
--layout-container-padding-x
--layout-section-spacing-y
```

---

# Reglas del Design System

## Nunca usar

```txt
✗ colores hardcodeados
✗ spacing manual
✗ border-radius manual
✗ transitions inline
✗ px hardcodeados cuando existe token
```

---

## Siempre usar

```txt
✓ semantic tokens
✓ component tokens
✓ spacing scale
✓ Container
✓ Section
✓ Button reusable
```

---

# Desarrollo

## Levantar proyecto

```bash
npm install
npm run dev
```

Servidor:

```txt
http://localhost:5173
```

---

## Build producción

```bash
npm run build
```

Genera:

```txt
/dist
```

---

## Preview local del build

```bash
npm run preview
```

---

# Flujo completo de tokens

## Paso 1 — Exportar desde Figma

Exportar:

```txt
numbers.json
primitivos.json
semanticos.json
componentes.json
```

Copiar a:

```txt
design-system/tokens/source/raw/
```

---

## Paso 2 — Transformar

```bash
cd design-system/tokens
python3 figma-to-sd.py
```

---

## Paso 3 — Build tokens

```bash
npm run build
```

Genera:

```txt
build/tokens.css
build/tokens.js
```

---

## Paso 4 — Volver a React

```bash
cd ../..
npm run dev
```

Vite recarga automáticamente.

---

# Cómo crear un componente nuevo

## Crear estructura

```bash
mkdir src/components/Services
```

---

## Services.jsx

```jsx
import styles from './Services.module.css'
import Section from '../ui/Section/Section'
import Container from '../ui/Container/Container'

export default function Services() {
  return (
    <Section>
      <Container>
        <section className={styles.services}>
          <h2 className={styles.title}>Services</h2>
        </section>
      </Container>
    </Section>
  )
}
```

---

## Services.module.css

```css
.services {
  width: 100%;
}

.title {
  font-size: var(--typography-size-display);
  color: var(--text-color-primary);
}
```

---

# Deploy

## Build

```bash
npm run build
```

---

## Hostinger

Subir el contenido de:

```txt
dist/
```

hacia:

```txt
public_html/
```

---

## Importante

Subir:

```txt
contenido de dist/
```

NO:

```txt
dist/
```

como carpeta.

---

# Responsive

El proyecto está optimizado para:

```txt
✓ Mobile
✓ Tablet
✓ Desktop
```

Incluye:

```txt
- spacing responsive
- typography fluid
- responsive grids
- mobile navigation
- responsive footer
```

---

# Estado actual de componentes

| Componente | Estado       | Notas                     |
| ---------- | ------------ | ------------------------- |
| Nav        | ✓            | Sticky + mobile nav       |
| Hero       | ✓            | Responsive + CTAs         |
| LogoStrip  | ✓            | Marquee accesible         |
| Work       | ⚠            | Placeholder data          |
| Contact    | ⚠            | Falta backend             |
| Footer     | ✓ Enterprise | Responsive + social icons |
| Button     | ✓            | Reusable                  |
| Container  | ✓            | Responsive                |
| Section    | ✓            | Reusable                  |
| Services   | ✗            | Pendiente                 |
| About      | ✗            | Pendiente                 |

---

# Próximas fases

## Fase 1 — Hardening UI

```txt
- consolidar typography
- limpiar legacy CSS
- revisar tablet spacing
- eliminar fallbacks viejos
- standardizar estados
```

---

## Fase 2 — Contenido real

```txt
- work cards reales
- servicios reales
- about real
- imágenes optimizadas
```

---

## Fase 3 — Producción

```txt
- Formspree
- SEO
- OG image
- deploy Hostinger
- analytics
```

---

## Fase 4 — Escalabilidad

```txt
- GitHub Actions
- automatización tokens
- CMS/headless
- WordPress integration
```

---

# Proyectos relacionados

| Proyecto    | Stack             |
| ----------- | ----------------- |
| vper-web    | React + Vite      |
| Divergentes | WordPress + PHP   |
| GOBi        | Next.js + FastAPI |

---

# Equipo

| Rol                    | Persona          |
| ---------------------- | ---------------- |
| Diseño + Design System | Ricardo Arce     |
| Desarrollo             | Heriberto Garcia |

---

# Notas importantes

## Dos node_modules

```txt
vper-web/node_modules/
design-system/tokens/node_modules/
```

Esto es correcto.

Son dos proyectos Node separados.

---

## Fuente de verdad

La fuente de verdad del sistema visual es:

```txt
Figma Variables
```

NO modificar manualmente:

```txt
design-system/tokens/source/*.json
```

porque son generados automáticamente.

---

## Regla importante

Siempre modificar:

```txt
Figma → export → transform → build
```

Nunca:

```txt
editar tokens.css manualmente
```
