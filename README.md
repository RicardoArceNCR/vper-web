# vper-web

Sitio web de **VPER Media** — agencia creativa, Nicaragua.

---

## Stack

| Capa | Tecnología |
|---|---|
| Bundler | Vite |
| UI | React 18 |
| Estilos | CSS Modules + Design Tokens |
| Design Tokens | Figma → Style Dictionary v4 → `tokens.css` |
| Hosting | Hostinger |

---

## Estructura del repo

```
vper-web/
├── design-system/
│   └── tokens/                 ← Pipeline Figma → CSS (no tocar manualmente)
│       ├── source/raw/         ← JSONs exportados de Figma
│       ├── source/             ← Generado por figma-to-sd.py
│       └── build/
│           └── tokens.css      ← CSS custom properties — fuente de verdad
├── src/
│   ├── components/
│   │   ├── Nav/                ← Header sticky, hamburger, menú mobile
│   │   ├── Hero/               ← Pill + heading + CTAs
│   │   ├── LogoStrip/          ← Marquee animado con clientes
│   │   ├── Work/               ← Grid de proyectos con filtros
│   │   ├── Contact/            ← Formulario de contacto
│   │   └── Footer/             ← 3 columnas: logo, nav, contacto
│   ├── App.jsx
│   ├── main.jsx                ← Importa tokens.css aquí (una sola vez)
│   └── index.css               ← Reset global + clases .btn compartidas
├── index.html                  ← Shell HTML de Vite
├── primeros pasos/
│   ├── index.html              ← Prototipo HTML original (referencia visual)
│   ├── PROXIMOS-PASOS-VPER.md
│   └── README-DESIGN-SYSTEM.md
└── vite.config.js
```

---

## Desarrollo local

```bash
npm install
npm run dev
```

El servidor corre en `http://localhost:5173`.

---

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/`. Subir el contenido de `dist/` a Hostinger vía FTP o panel de control.

---

## Cómo actualizar los design tokens

Cuando cambia algo en Figma:

```bash
# 1. Exportar colecciones de Figma a design-system/tokens/source/raw/
# 2. Transformar y compilar:
cd design-system/tokens
python3 figma-to-sd.py
npm run build
# 3. El tokens.css actualizado ya está disponible — npm run dev recarga automático
```

---

## Estado actual de los componentes

| Componente | Estado | Notas |
|---|---|---|
| Nav | ✓ Completo | Hamburger, Escape key, click outside |
| Hero | ✓ Completo | Responsive mobile → desktop |
| LogoStrip | ✓ Completo | Marquee, reduced-motion, accesible |
| Work | ⚠ Placeholder | Grid y filtros funcionan — imágenes reales pendientes |
| Contact | ⚠ Sin backend | Form controlado listo — falta conectar Formspree |
| Footer | ✓ Completo | 3 columnas responsive |
| Services | ✗ Pendiente | Aparece en nav pero la sección no existe todavía |
| About | ✗ Pendiente | Aparece en nav pero la sección no existe todavía |

---

## Próximos pasos

1. Conectar formulario de contacto con Formspree o EmailJS
2. Crear secciones Services y About
3. Reemplazar work cards placeholder con proyectos reales
4. Agregar meta tags SEO y og:image en `index.html`
5. Deploy en Hostinger

---

## Proyectos relacionados

| Proyecto | Repo / Ubicación |
|---|---|
| Design Tokens | `design-system/tokens/` (en este mismo repo) |
| Divergentes | WordPress + PHP + Bootstrap (repo separado) |

---

## Equipo

| Rol | Persona |
|---|---|
| Diseño + Design System | Ricardo Arce |
| Desarrollo | Heriberto Garcia |
