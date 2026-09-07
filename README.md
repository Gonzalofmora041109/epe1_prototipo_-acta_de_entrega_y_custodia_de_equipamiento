# Centro Comunitario Alto del Carmen - MVP

Prototipo funcional para demostrar la gestion comunitaria de vecinos, talleres, inscripciones, asistencia, inventario y reportes. Conserva la interfaz original y agrega una capa de datos simulados separada del HTML.

> Este proyecto no es un sistema productivo. No cuenta con autenticacion real, backend, base de datos institucional, firma digital ni integraciones municipales. Los datos nuevos se guardan solo en `localStorage` del navegador y todos los datos incluidos son ficticios.

## Requisitos

- Node.js 20 o superior.
- Navegador moderno con soporte para modulos ES y `localStorage`.
- Conexion a Internet para cargar Tailwind CDN, Google Fonts e imagenes externas heredadas del prototipo.

No es necesario instalar dependencias npm.

## Ejecucion

```bash
npm start
```

Abrir `http://127.0.0.1:4173`. No se recomienda abrir los HTML con `file://`, porque el comportamiento de `localStorage` entre paginas no es portable.

Para usar otro puerto:

```bash
PORT=8080 npm start
```

## Publicacion En GitHub Pages

El proyecto incluye `.github/workflows/pages.yml` para publicar automaticamente el contenido estatico desde la rama `main`.

1. Crear un repositorio vacio en GitHub, sin README, `.gitignore` ni licencia inicial.
2. Desde esta carpeta, agregar el remoto y subir la rama `main`:

```bash
git remote add origin https://github.com/USUARIO/NOMBRE-REPOSITORIO.git
git add .
git commit -m "Publicar MVP en GitHub Pages"
git push -u origin main
```

3. En GitHub, abrir `Settings > Pages` y seleccionar `GitHub Actions` como fuente si GitHub lo solicita.
4. La URL esperada es `https://USUARIO.github.io/NOMBRE-REPOSITORIO/`.

GitHub Pages solo publica archivos estaticos. El servidor local de `scripts/server.mjs` no se ejecuta alli, y los cambios guardados en `localStorage` solo existen en el navegador de cada visitante. Las fuentes, imagenes y Tailwind cargados desde CDN requieren conexion a Internet.

## Pruebas

```bash
npm test
npm run check:links
```

## Flujo Demostrable

1. Abrir el portal y consultar los talleres.
2. Seleccionar `Ver Detalle / Solicitar Inscripcion`.
3. Registrar un vecino con un RUT chileno valido.
4. Repetir la inscripcion con el mismo RUT y taller para comprobar el bloqueo de duplicados.
5. Abrir `Control Asistencia`, seleccionar el taller y guardar una sesion.
6. Abrir `Reportes y Direccion` para consultar los indicadores locales.
7. Abrir `Inventario y Equipos`, cambiar cantidad o estado y guardar.

Desde `Gestión de Talleres`, pulsa `Ver inscritos` en cualquier taller. El panel permite consultar participantes, asignar una persona existente del padrón o abrir el formulario para registrar e inscribir una persona nueva.

RUT valido sugerido para la prueba manual: `12.345.678-5`.

## Estructura Principal

```text
.
├── assets/
│   ├── css/mvp.css                 Ajustes responsive y componentes MVP
│   └── js/
│       ├── app.js                  Adaptadores de las paginas existentes
│       ├── community-service.js    Reglas de negocio
│       ├── storage.js              Repositorios local y de memoria
│       └── data/seed.js            Datos ficticios de demostracion
├── scripts/
│   ├── server.mjs                  Servidor HTTP local
│   └── check-links.mjs             Validacion de enlaces oficiales
├── tests/community-service.test.js Pruebas de reglas de negocio
├── docs/                            Evidencias y documentacion de entrega
├── *.html                           Pantallas oficiales conservadas
└── */code.html y */screen.png       Exportaciones originales conservadas
```

## Funcionalidades Implementadas

- Catalogo ciudadano con busqueda, filtros y acceso a inscripcion.
- Creacion y consulta de talleres con cupos disponibles.
- Registro de vecinos y consulta del padron local.
- Inscripcion con control de duplicado y cupo.
- Disponibilidad calculada según el taller y fecha seleccionada.
- Confirmación completa con sede, dirección, sala, horario, monitor y datos del participante.
- Descarga local de comprobante PDF de demostración.
- Seleccion de taller, participantes y estado de asistencia.
- Registro local de sesiones y calculo de porcentaje.
- Consulta y actualizacion de cantidad/estado de inventario.
- Registro de nuevos elementos de inventario.
- Resumen conectado de indicadores y descarga TXT de demostracion.
- Navegacion principal, rutas profundas existentes y fallback seguro del diagrama.
- Ajustes responsive para retirar el sidebar fijo en pantallas pequenas.
- Labels, regiones de estado y nombres accesibles en controles nuevos.

## Simulado O Pendiente

- `localStorage` reemplaza temporalmente API y base de datos.
- El acceso staff abre una demostracion; no autentica usuarios.
- Descargas PDF/XLSX se sustituyen por un TXT de demostracion.
- Firma digital, ClaveUnica, RSH, notificaciones y despacho institucional requieren backend.
- Respaldos, auditoria formal y cifrado estan pendientes.
- Los graficos historicos originales se mantienen como material visual ilustrativo.
- La arquitectura futura AWS esta documentada conceptualmente, pero no se crean recursos ni credenciales.

## Migracion Futura A API

La interfaz consume `CommunityService`, que depende de un repositorio. Para migrar a API Gateway y Lambda se debe implementar un repositorio HTTP con las mismas operaciones de `storage.js`. Esto evita acoplar las pantallas a PostgreSQL, Cognito o servicios AWS.

## Documentos De Entrega

- [Cambios realizados](docs/CAMBIOS.md)
- [Pruebas manuales](docs/PRUEBAS.md)
- [Estado funcional](docs/ESTADO_FUNCIONAL.md)
- [Capturas](docs/capturas/)
