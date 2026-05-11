# vper-web

Sitio web de **VPER Media** — agencia creativa, Nicaragua.  
Stack: Vite + React 18 + CSS Modules + Design Tokens (Figma → Style Dictionary).

---

## Cómo funciona el sistema completo

```
┌─────────────────────────────────────────────────────────────────┐
│  FIGMA                                                          │
│  Collections: numbers · primitivos · semanticos · componentes   │
│  Plugin: Export/Import Variables → exportar a JSON              │
└────────────────────────────┬────────────────────────────────────┘
                             │ Copiar 4 JSONs a source/raw/
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  design-system/tokens/source/raw/                               │
│  numbers.json · primitivos.json · semanticos.json · componentes │
└────────────────────────────┬────────────────────────────────────┘
                             │ python3 figma-to-sd.py
                             │ · Convierte RGBA float → hex
                             │ · Resuelve aliases entre colecciones
                             │ · Agrega unidades px donde corresponde
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  design-system/tokens/source/   (no editar manualmente)         │
└────────────────────────────┬────────────────────────────────────┘
                             │ npm run build  (dentro de tokens/)
                             │ Style Dictionary resuelve referencias
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  design-system/tokens/build/tokens.css                          │
│                                                                 │
│  :root {                                                        │
│    --brand-main: #f98516;                                       │
│    --button-primary-bg: var(--brand-main);                      │
│    --text-color-primary: #ffffff;                               │
│    --spacing-4: 16px;                                           │
│    --button-base-radius: 9999px;                                │
│    ... 312 variables                                            │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │ import '../design-system/tokens/build/tokens.css'
                             │ Una sola línea en src/main.jsx
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/ — React + CSS Modules                                     │
│                                                                 │
│  Cualquier CSS Module usa los tokens directamente:              │
│                                                                 │
│  .hero {                                                        │
│    background-color: var(--surface-subtle);                     │
│    padding: var(--spacing-16) var(--layout-header-padding-x);   │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │ npm run build  (raíz del proyecto)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  dist/   ← subir contenido a Hostinger / public_html/           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estructura del repositorio

```
vper-web/
│
├── design-system/
│   └── tokens/
│       ├── source/
│       │   ├── raw/                ← JSONs exportados de Figma (no editar)
│       │   │   ├── numbers.json
│       │   │   ├── primitivos.json
│       │   │   ├── semanticos.json
│       │   │   └── componentes.json
│       │   ├── numbers.json        ← Generado por figma-to-sd.py
│       │   ├── primitivos.json       NO editar manualmente
│       │   ├── semanticos.json
│       │   └── componentes.json
│       ├── build/
│       │   ├── tokens.css          ← OUTPUT FINAL — fuente de verdad de estilos
│       │   └── tokens.js           ← Mismo contenido como ES Module
│       ├── figma-to-sd.py          ← Transformador Figma JSON → Style Dictionary
│       ├── style-dictionary.config.js
│       └── package.json            ← Scripts: build, watch
│
├── src/
│   ├── components/
│   │   ├── Nav/
│   │   │   ├── Nav.jsx             ← Header sticky, hamburger animado
│   │   │   └── Nav.module.css
│   │   ├── Hero/
│   │   │   ├── Hero.jsx            ← Pill + heading + CTAs
│   │   │   └── Hero.module.css
│   │   ├── LogoStrip/
│   │   │   ├── LogoStrip.jsx       ← Marquee animado, reduced-motion
│   │   │   └── LogoStrip.module.css
│   │   ├── Work/
│   │   │   ├── Work.jsx            ← Grid + filtros por categoría (useState)
│   │   │   └── Work.module.css
│   │   ├── Contact/
│   │   │   ├── Contact.jsx         ← Formulario controlado (useState)
│   │   │   └── Contact.module.css
│   │   └── Footer/
│   │       ├── Footer.jsx          ← 3 columnas: logo, nav, contacto
│   │       └── Footer.module.css
│   ├── App.jsx                     ← Compone todos los componentes
│   ├── main.jsx                    ← Punto de entrada — importa tokens.css aquí
│   └── index.css                   ← Reset global + clases .btn compartidas
│
├── public/                         ← Assets estáticos (favicon, og-image, etc.)
├── dist/                           ← Build de producción (gitignored)
├── primeros pasos/
│   ├── index.html                  ← Prototipo HTML original (referencia visual)
│   ├── PROXIMOS-PASOS-VPER.md
│   └── README-DESIGN-SYSTEM.md
├── index.html                      ← Shell HTML de Vite
├── vite.config.js
└── package.json                    ← Scripts: dev, build, preview
```

---

## Comandos de desarrollo

```bash
# Levantar servidor local → http://localhost:5173
npm run dev

# Build de producción → genera dist/
npm run build

# Preview del build antes de subir → http://localhost:4173
npm run preview
```

---

## Flujo completo: actualizar tokens desde Figma

Este es el ciclo cada vez que haya cambios de diseño en Figma.

### Paso 1 — Exportar de Figma

En Figma: **Plugins → Export/Import Variables → Export to JSON**

Exportar las 4 colecciones y guardar en `design-system/tokens/source/raw/` con estos nombres exactos:

```
numbers.json
primitivos.json
semanticos.json
componentes.json
```

### Paso 2 — Transformar

```bash
cd design-system/tokens
python3 figma-to-sd.py
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

### Paso 3 — Compilar tokens a CSS

```bash
npm run build
# Regenera build/tokens.css y build/tokens.js
```

### Paso 4 — Volver a la raíz

```bash
cd ../..
# Si npm run dev está corriendo, Vite recarga automático
# Si no:
npm run dev
```

---

## Cómo usar los tokens en un CSS Module

Los tokens están disponibles en cualquier CSS Module sin imports adicionales —
ya están en `:root` gracias al import en `main.jsx`.

### Regla de oro: usar la capa más específica

```css
/* ✗ MAL — valor hardcodeado */
color: #f98516;

/* ✗ MAL — primitivo directo */
color: var(--color-brand-orange-500);

/* ✓ BIEN — token semántico */
color: var(--brand-main);

/* ✓ MEJOR — token de componente (cuando existe) */
background-color: var(--button-primary-bg);
```

### Referencia de tokens más usados

```css
/* ── Superficies ── */
--surface-subtle          /* fondo general de página */
--surface-base            /* fondo de secciones alternas */
--surface-raised          /* fondo de cards e inputs */

/* ── Texto ── */
--text-color-primary      /* texto principal */
--text-color-secondary    /* texto muted / subtítulos */
--text-color-inverse      /* texto sobre fondo oscuro */

/* ── Marca ── */
--brand-main              /* naranja #f98516 */
--brand-contrast          /* texto sobre fondo naranja */

/* ── Espaciado (escala 4px) ── */
--spacing-2   /* 8px  */     --spacing-8   /* 32px */
--spacing-4   /* 16px */     --spacing-12  /* 48px */
--spacing-6   /* 24px */     --spacing-16  /* 64px */

/* ── Tipografía ── */
--typography-size-sm              /* 14px */
--typography-size-md              /* 16px */
--typography-size-xl              /* 20px */
--typography-size-display         /* 48px */
--typography-size-display-xl      /* 80px */
--typography-weight-medium
--typography-weight-bold
--typography-letter-spacing-button

/* ── Layout ── */
--layout-header-padding-x         /* 24px */
--layout-header-padding-y         /* 16px */
--layout-header-navbar-gap-x      /* 16px */

/* ── Botones ── */
--button-primary-bg               --button-secondary-bg
--button-primary-bg-hover         --button-secondary-border
--button-primary-border           --button-secondary-text
--button-primary-text
--button-base-radius              /* 9999px (pill) */
--button-base-transitions
--button-text-size-md             /* 16px */
--button-size-xl-padding-x
--button-size-xl-padding-y

/* ── Nav ── */
--nav-bg
--nav-border
--nav-item-color
--nav-item-color-active

/* ── Pills ── */
--pill-base-radius
--pill-base-border-width
--pill-base-padding-x
--pill-base-padding-y
--pill-informative-border
--pill-informative-text

/* ── Bordes ── */
--radius-sm
--border-subtle
--border-brand
--border-inverse

/* ── Focus (accesibilidad) ── */
--focus-ring-color
--focus-ring-width
--focus-offset
```

---

## Cómo agregar un componente nuevo

```bash
# 1. Crear archivos
mkdir src/components/Services
touch src/components/Services/Services.jsx
touch src/components/Services/Services.module.css
```

**`Services.jsx`**

```jsx
import styles from './Services.module.css'

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <h2 className={styles.title}>Services</h2>
    </section>
  )
}
```

**`Services.module.css`**

```css
.services {
  width: 100%;
  padding: var(--spacing-16) var(--layout-header-padding-x);
  background-color: var(--surface-base);
}

.title {
  font-family: 'Gotham', sans-serif;
  font-weight: 900;
  font-size: var(--typography-size-display);
  color: var(--text-color-primary);
  text-transform: uppercase;
}

.title::after {
  content: '.';
  color: var(--brand-main);
}
```

**`App.jsx`** — agregar import y JSX:

```jsx
import Services from './components/Services/Services'

// En el return, entre Work y Contact:
<Work />
<Services />
<Contact />
```

---

## Deploy en Hostinger

### Preparación antes del primer deploy

Crear `public/.htaccess` (Vite lo copia a `dist/` automáticamente en cada build):

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

Sin este archivo, las URLs directas (ej: `vpermedia.com/#contact`) pueden fallar.

### Deploy

```bash
# 1. Build de producción
npm run build

# 2. En Hostinger:
#    Panel → File Manager → public_html/
#    Subir el CONTENIDO de dist/ (no la carpeta dist/ en sí)
#    El index.html de dist/ debe quedar en public_html/index.html
```

### Actualizar el sitio después de cambios

```bash
npm run build
# Subir dist/ a Hostinger nuevamente
```

---

## Nota sobre los dos `node_modules`

```
vper-web/node_modules/              ← dependencias de Vite + React
design-system/tokens/node_modules/  ← dependencias de Style Dictionary
```

Son dos proyectos Node independientes en el mismo repo. Esto es correcto — no eliminar ninguno.

---

## Estado actual de los componentes

| Componente | Estado | Notas |
|---|---|---|
| Nav | ✓ Completo | Sticky, hamburger animado, Escape key, click outside, aria |
| Hero | ✓ Completo | Pill + heading responsive mobile → desktop |
| LogoStrip | ✓ Completo | Marquee, reduced-motion, aria-hidden en duplicado |
| Work | ⚠ Placeholder | Grid + filtros funcionan — cards con datos ficticios |
| Contact | ⚠ Sin backend | Form controlado listo — falta Formspree |
| Footer | ✓ Completo | 3 columnas responsive |
| Services | ✗ Pendiente | Link en nav sin sección |
| About | ✗ Pendiente | Link en nav sin sección |

---

## Próximos pasos

| # | Tarea | Tiempo estimado |
|---|---|---|
| 1 | Conectar Contact con Formspree | 30 min |
| 2 | Agregar meta tags SEO y og:image en `index.html` | 15 min |
| 3 | Crear `public/.htaccess` y deploy en Hostinger | 30 min |
| 4 | Work cards con proyectos reales + imágenes en `public/work/` | 2-3h |
| 5 | Crear sección Services | 2-3h |
| 6 | Crear sección About | 2-3h |

---

## Proyectos relacionados

| Proyecto | Stack | Estado |
|---|---|---|
| vper-web (este repo) | Vite + React + CSS Modules | ✓ Corriendo en localhost:5173 |
| Divergentes | WordPress + PHP + Bootstrap | ✓ Productivo |

---

## Equipo

| Rol | Persona |
|---|---|
| Diseño + Design System | Ricardo Arce |
| Desarrollo | Heriberto Garcia |