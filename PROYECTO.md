# Sistema de Gestión del Centro Comunitario Alto del Carmen

Plataforma de administración municipal (DIDECO) para la Ilustre Municipalidad de Alto del Carmen, Región de Atacama. Permite gestionar talleres comunales, padrón de vecinos, asistencia, inventario de equipos, reportes (GORE Atacama), sedes y configuración del sistema.

---

## 1. Cómo navegar este documento

- [2. Estructura de archivos](#2-estructura-de-archivos)
- [3. Mapa de navegación entre páginas](#3-mapa-de-navegación-entre-páginas)
- [4. Descripción de cada página](#4-descripción-de-cada-página)
- [5. Diseño y sistema de estilos (cómo respetarlos)](#5-diseño-y-sistema-de-estilos-cómo-respetarlos)
- [6. Componentes y patrones](#6-componentes-y-patrones)
- [7. Convenciones de enrutamiento y enlaces](#7-convenciones-de-enrutamiento-y-enlaces)
- [8. Reglas para seguir implementando](#8-reglas-para-seguir-implementando)

---

## 2. Estructura de archivos

El sitio está en **estáticas HTML** (sin framework, Vanilla JS + Tailwind CDN). Las páginas navegables son archivos `.html` en la raíz y en subdirectorios, TODO en la raíz del proyecto:

```
portal-vecino.html               Acceso público / catálogo ciudadano
login-staff.html                 Login staff + ClaveÚnica

dashboard.html                   Panel administrador (inicio)
talleres.html                    Gestión de talleres (catálogo)
talleres/ficha-alfareria.html    Ficha detallada de taller
inscripciones.html               Padrón e inscripción de vecinos
vecinos/ficha-maria-carmona.html Expediente ciudadano
asistencia.html                  Control y visación de asistencia
inventario.html                  Inventario y equipos
inventario/acta-custodia.html    Acta de custodia
reportes.html                    Reportes y dirección (rendición GORE)
configuracion.html               Configuración y administración

mapa-sitio.html                  Mapa del sitio / arquitectura de info
diagrama-nodos.html              Diagrama de navegación (nodos)
```

> Las carpetas `*/code.html` (ej. `p_gina_principal.../code.html`, `gesti_n_de_talleres.../code.html`) son los **prototipos fuente originales**, únicamente de referencia. **No editar**: el sitio vive en los archivos `.html` de la raíz/subdirectorios listados arriba.

Cada página es de **una sola pieza**: su `<style>`, configuración de Tailwind, HTML y JavaScript están **inline** en ese mismo archivo. No hay CSS/JS externos propios.

---

## 3. Mapa de navegación entre páginas

```
                    ┌────────────────────┐
                    │   portal-vecino   │   (Inicio público)
                    └─────────┬──────────┘
                              │ "Acceso Funcionarios / ClaveÚnica"
                              ▼
                    ┌────────────────────┐
                    │    login-staff     │
                    └─────────┬──────────┘
                              │ login OK → dashboard
                              ▼
     ┌────────────────────────┴─────────────────────────┐
     │                   dashboard                        │
     └──┬────────┬─────────┬──────────┬────────┬─────────┘
        ▼        ▼         ▼          ▼        ▼
   talleres   inscripciones  asistencia  inventario  reportes
        │        │             │           │           │
        │        │             │     ┌─────┴─────┐      │
        ▼        ▼             │     ▼           ▼      │
 ficha-alfareria ficha-maria  │  inventario  acta-      │
   (taller)      (vecino)     │  (back:")    custodia   │
                               │                         │
   └─── también: talleres → ficha-alfareria ─────────────┘
        inscripciones → ficha-maria-carmona
        ficha-maria → ficha-alfareria (taller en curso)
```

**Flujos principales:**

| Desde | Acción | Destino |
|---|---|---|
| `portal-vecino.html` | "Iniciar Sesión / Acceso Staff" | `login-staff.html` |
| `login-staff.html` | "Volver al Portal Público" | `portal-vecino.html` |
| `login-staff.html` | Login exitoso | `dashboard.html` (redirect JS) |
| `dashboard.html` | Sidebar / accesos rápidos | cualquier módulo |
| `talleres.html` | "Alfarería Diaguita" / "Ver Ficha" | `talleres/ficha-alfareria.html` |
| `talleres/ficha-alfareria.html` | Breadcrumb "Volver" | `../talleres.html` |
| `inscripciones.html` | Nombre / "Ver Ficha Social" de María Carmona | `vecinos/ficha-maria-carmona.html` |
| `vecinos/ficha-maria-carmona.html` | Breadcrumb "Volver" | `../inscripciones.html` |
| `vecinos/ficha-maria-carmona.html` | "Inscribir a Nuevo Taller" / taller en curso | `../talleres/ficha-alfareria.html` |
| `inventario.html` | "Generar Acta de Entrega" / protocolo | `inventario/acta-custodia.html` |
| `inventario/acta-custodia.html` | Breadcrumb "Volver" | `../inventario.html` |
| `dashboard.html` | "Cerrar Sesión" | `portal-vecino.html` |
| `diagrama-nodos.html` | Botón "Navegar a este Módulo" | según nodo seleccionado |

Todo el **sidebar lateral** comparte las mismas 7 rutas en todas las vistas administrativas.

---

## 4. Descripción de cada página

### Acceso público y autenticación

#### `portal-vecino.html` — Portal Vecinal Ciudadano
- **Ruta**: `/portal-vecino`
- **Audiencia**: ciudadanía (vecinos, familias, adultos mayores)
- **Contenido**: hero institucional, métricas (2 sedes), sección "Nuestras Sedes" (San Félix y El Tránsito), catálogo de talleres abiertos, avisos/operativos, oficina de apoyo postulante, footer.
- **Nav superior**: Inicio (`#inicio`), Nuestros Talleres (`#talleres-section`), Sectores (`#sectores`), Noticias (`#noticias`).
- **Anclas existentes**: `#inicio`, `#sectores`, `#talleres-section`, `#noticias`.

#### `login-staff.html` — Portal de Acceso Staff / ClaveÚnica
- **Ruta**: `/login-staff`
- **Contenido**: formulario con RUT + contraseña + selector de rol; enlace "¿Olvidó su contraseña?" → `configuracion.html`.
- **Comportamiento**: `handleLogin()` valida y, tras 1.2s, redirige a `dashboard.html`.

### Suite administrativa DIDECO (sidebar persistente)

#### `dashboard.html` — Dashboard General
- **Ruta**: `/dashboard`
- **Contenido**: métricas comunales, selector de sector, accesos rápidos, agenda. Header con "Cerrar Sesión" → `portal-vecino.html`.

#### `talleres.html` — Gestión de Talleres
- **Ruta**: `/talleres`
- **Contenido**: tabla administrativa de talleres (COD TLL-SF-01 "Alfarería Diaguita y Esmaltado") y cards de "Próximos Inicios de Ciclo".
- **Enlaces profundos**: nombre del taller y botón "Ver Ficha Convocatoria" → `talleres/ficha-alfareria.html`.

#### `talleres/ficha-alfareria.html` — Ficha Detallada del Taller
- **Ruta**: `/talleres/ficha-alfareria`
- **Contenido**: nómina de inscritos, bitácora de materiales, control de horas, asistencia.
- **Breadcrumb**: "Volver a Gestión de Talleres" → `../talleres.html`.

#### `inscripciones.html` — Padrón e Inscripción de Vecinos
- **Ruta**: `/inscripciones`
- **Contenido**: padrón con RUT, filtro RSH, estado de inscripción.
- **Enlaces profundos**: nombre "María Luisa Carmona Rivera" y botón "Ver Ficha Social" → `vecinos/ficha-maria-carmona.html`.

#### `vecinos/ficha-maria-carmona.html` — Expediente Ciudadano
- **Ruta**: `/vecinos/ficha-maria-carmona`
- **Contenido**: datos sociales, taller en curso (alfarería), teléfonos de contacto, próximo taller matriculado.
- **Breadcrumb**: "Volver a Inscripción de Vecinos" → `../inscripciones.html`.
- **Enlaces**: "Inscribir a Nuevo Taller" y nombre del taller en curso → `../talleres/ficha-alfareria.html`.

#### `asistencia.html` — Control y Visación de Asistencia
- **Ruta**: `/asistencia`
- **Contenido**: malla de asistencia mensual, libro de firmas, porcentajes de concurrencia.

#### `inventario.html` — Inventario y Equipos
- **Ruta**: `/inventario`
- **Contenido**: kárdex de bienes, custodia de activos, protocolo de entrega.
- **Enlaces profundos**: botón "Generar Acta de Entrega" → `inventario/acta-custodia.html`.

#### `inventario/acta-custodia.html` — Acta de Custodia
- **Ruta**: `/inventario/acta-custodia`
- **Contenido**: acta legal foliada ACT-2024-089, firma, QR.
- **Breadcrumb**: "Inventario y Equipos" / "Actas de Custodia" → `../inventario.html`.

#### `reportes.html` — Reportes y Dirección
- **Ruta**: `/reportes`
- **Contenido**: paneles FNDR, métricas de deserción, cobertura, informes descargables.

#### `configuracion.html` — Configuración del Sistema
- **Ruta**: `/configuracion`
- **Contenido**: gestión de sedes, estado Starlink, roles y permisos.

### Diagramas

#### `mapa-sitio.html` — Mapa del Sitio
- **Ruta**: `/mapa-sitio`
- **Contenido**: arquitectura de información con enlaces reales a todos los módulos.

#### `diagrama-nodos.html` — Diagrama de Navegación
- **Ruta**: `/diagrama-nodos`
- **Contenido**: red de nodos interactiva con inspector lateral y zoom.
- **Comportamiento**: el botón "Navegar a este Módulo" (`inspector-action-btn`) navega al `.html` real. El mapeo `routeMap` traduce las rutas abstractas `data-route` (ej. `/talleres/tll-sf-01`) a archivos reales.

---

## 5. Diseño y sistema de estilos (cómo respetarlos)

Toda la paleta, tipografía, espaciado y redondeo se definen en el **bloque `tailwind.config`** inline de cada archivo (idéntico en todos). NO se usan clases de color de Tailwind por defecto para el brand; se usan los tokens semánticos. **La fuente de verdad es `alto_del_carmen_civic_system/DESIGN.md`.**

### 5.1 Colores (tokens semánticos de Tailwind)

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#154212` | verde bosque oscuro, branding |
| `primary-container` | `#2D5A27` | **item activo de sidebar**, acciones confirmativas |
| `on-primary-container` | `#9DD090` | texto sobre primary-container |
| `secondary` | `#4059AA` | azul pizarra, enlaces, acciones secundarias |
| `surface` | `#f8f9fa` | fondo de viewport |
| `surface-container-lowest` | `#ffffff` | tarjetas, tablas interiores |
| `on-surface` | `#191c1d` | texto principal |
| `on-surface-variant` | `#42493e` | texto secundario |
| `error` / `error-container` | `#ba1a1a` / `#ffdad6` | errores, logout |

**Estados semánticos** (badges "Activo/Inactivo/Pendiente"):
- Activo/Presente: fondo `#ECFDF5`, texto `#065F46`, dot `#059669`
- Inactivo/Ausente: fondo `#FEF2F2`, texto `#991B1B`, dot `#DC2626`
- Pendiente/Mantención: fondo `#FFFBEB`, texto `#92400E`, dot `#D97706`

### 5.2 Tipografía
- **Familia**: Plus Jakarta Sans (`fontFamily` tokens `body-*`, `label-*`, `headline-*`).
- **Tamaños clave**: `display-lg` 36px, `headline-xl` 28px, `body-md` 14px, `label-lg` 14px, `label-sm` 11px (uppercase en chips/encabezados).
- En cada etiqueta se usa el patrón doble: `<span class="font-label-lg text-label-lg">` (clase de fuente + clase de tamaño).
- Datos numéricos/RUT/timestamps usan estilo mono (clase `font-mono`).

### 5.3 Espaciado y layout
- Tokens: `space-2xs` 4px, `space-xs` 8px, `space-sm` 12px, `space-md` 16px, `space-lg` 24px, `space-xl` 32px.
- Sidebar fija a la izquierda (`w-sidebar-width` 260px), header fijo de 64px (`h-16`), contenido con `pl-[16.25rem]`.
- Contenido con tope `max-content-width` 90rem (1440px) y márgenes `margin-desktop` 32px.

### 5.4 Redondeo
- `rounded-md`/`rounded-lg` (4–8px) en tarjetas y botones; `rounded-xl` (12px) en contenedores estructurales; `rounded-full` solo en badges/presencia.

### 5.5 Elevación
- Evitar sombras fuertes y gradientes decorativos. Usar contornos `1px solid #E2E8F0` en tarjetas y sombras suaves `0 1px 8px rgba(0,0,0,0.04)` en contenedores flotantes.

---

## 6. Componentes y patrones

### 6.1 Sidebar administrativo (patrón obligatorio)
Todos los `.html` admin (excepto `portal-vecino` y `login-staff`) llevan un `<nav>` lateral con 7 items:

```
Dashboard, Gestión de Talleres, Inscripción Vecinos,
Control Asistencia, Inventario y Equipos, Reportes y Dirección, Configuración
```

Cada item es un `<a>` con `data-path` + `href` al archivo correspondiente. **El item correspondiente a la página actual debe llevar:**
```html
<a aria-current="page" class="... bg-primary-container text-on-primary-container font-bold" data-path="..." href="...">
```
**Los demás items** usan la clase inactiva:
```html
<a class="... text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="..." href="...">
```

> Para sub-páginas (`talleres/`, `vecinos/`, `inventario/`) los `href` del sidebar usan prefijo `../` (ej. `../dashboard.html`).

### 6.2 Breadcrumbs (migas de pan)
Cada sub-pantalla (ficha de taller, expediente, acta) incluye un breadcrumb con **enlaces funcionales** para volver al padre:
- Ficha de taller → `../talleres.html`
- Expediente vecino → `../inscripciones.html`
- Acta custodia → `../inventario.html`

### 6.3 Botones y CTAs
- **Primario**: `bg-primary text-on-primary` (verde) — acción principal.
- **Secundario**: `bg-secondary text-on-secondary` (azul) — acción operativa.
- **Neutral/outline**: `bg-surface-container-lowest text-on-surface border`.
- Para convertir un `<button>` en enlace navegable, reemplázalo por `<a class="...misma clase..." href="destino.html">`.

### 6.4 Tablas de datos
- Header `label-md` sobre `#F8F9FA`, filas de 48px con `border-bottom 1px solid #E2E8F0`, hover `#F8FAFC`.

### 6.5 Cabecera de usuario
- En las vistas admin: usuario "Juan Pérez / Administrador". El menú "Cerrar Sesión" → `portal-vecino.html`; perfil/ajustes → `configuracion.html`.
- Selector comunal (dropdown): opciones "Todo el Comunal / Sede San Félix / Sede El Tránsito".

---

## 7. Convenciones de enrutamiento y enlaces

1. **Rutas base** se mantienen fieles al mapa definido (`/dashboard`, `/talleres`, `/inscripciones`, `/asistencia`, `/inventario`, `/reportes`, `/configuracion`, `/portal-vecino`, `/login-staff`, `/mapa-sitio`, `/diagrama-nodos`), implementadas como archivos `.html`.
2. **Sub-rutas anidadas** viven en carpetas: `talleres/ficha-alfareria.html`, `vecinos/ficha-maria-carmona.html`, `inventario/acta-custodia.html`.
3. **Rutas relativas**: páginas en subdirectorios usan `../` para volver a la raíz.
4. **Nunca dejar `href="#"` vacíos** en navegación principal, pestañas o tarjetas de expediente. Siempre apuntar a un archivo real o a un ancla existente (`#seccion-id`).

### Mapa de rutas abstractas ↔ archivos (usado en diagrama-nodos)
```
/dashboard                 → dashboard.html
/talleres                  → talleres.html
/talleres/tll-sf-01        → talleres/ficha-alfareria.html
/inscripciones             → inscripciones.html
/vecinos/ficha-14238490-k  → vecinos/ficha-maria-carmona.html
/asistencia                → asistencia.html
/inventario                → inventario.html
/inventario/acta-2024-089  → inventario/acta-custodia.html
/reportes                  → reportes.html
/configuracion             → configuracion.html
/portal-vecino             → portal-vecino.html
```

---

## 8. Reglas para seguir implementando

1. **Editar los `.html` de la raíz/subdirectorios, nunca los `*/code.html`** (son prototipos fuente).
2. **Preservar el `tailwind.config` inline**: no cambiar tokens de color/tipografía existentes; úsarlos tal cual.
3. **Respetar el patrón de sidebar**: `data-path` + `href`, con el item activo marcado con `aria-current="page"` y la clase `bg-primary-container text-on-primary-container font-bold`.
4. **Breadcrumbs funcionales** en cada sub-pantalla: siempre con `href` real hacia el padre.
5. **Enlaces relativos correctos**: raíz sin prefijo; subdirectorio con `../`.
6. **Sin `href="#"` huérfanos**: todo botón de navegación/tarjeta debe apuntar a un destino real o ancla existente.
7. **Consistencia de usuario**: mantener "Juan Pérez / Administrador Municipal"; logout → `portal-vecino.html`; ajustes → `configuracion.html`.
8. **Validación**: tras cambios, comprobar que todos los `href` locales resuelvan a archivos existentes (se puede correr el script de verificación de enlaces).
9. **Nuevos módulos**: para agregar una página, crear el `.html` siguiendo la plantilla de un archivo existente (mismo `tailwind.config` inline, mismo sidebar, mismo header) y enlazarla desde el sidebar correspondiente con `data-path` + `href`.
10. **Móvil/terreno (PWA `/m/*`)**: NO está incluido en este scope (solo desktop). No crear ni enlazar páginas `/m/` en esta iteración.
