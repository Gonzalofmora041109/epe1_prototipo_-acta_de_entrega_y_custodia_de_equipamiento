# Cambios Realizados

## Arquitectura

- Se creo una copia independiente del prototipo; el directorio original permanece intacto.
- Se agrego un servidor HTTP sin dependencias externas.
- Se separaron datos semilla, persistencia, reglas de negocio y adaptadores visuales.
- Se definio un estado versionado bajo la clave `adc.community.v1`.
- Se agrego un repositorio de memoria para probar la logica sin navegador.

## Funcionalidad

- Se simplifico el inicio ciudadano con un mensaje orientado a encontrar talleres.
- Se agrego menu movil con accesos a talleres, sedes, avisos, ayuda y mis inscripciones.
- Se reemplazo el CTA ciudadano por "Quiero inscribirme" y se informa la lista de espera para talleres completos.
- Se agrego inscripcion ciudadana guiada en tres pasos con resumen antes de confirmar.
- Se agrego consulta de "Mis inscripciones" mediante RUT sobre datos locales.
- Se agrego el panel "Ver inscritos" dentro de Gestion de Talleres.
- El panel lista participantes, RUT, sector, contacto, cupos y busqueda.
- Se agrego asignacion de un vecino existente desde el padron.
- Se agrego registro e inscripcion de un vecino nuevo desde el mismo panel.
- La tabla y los cupos se actualizan inmediatamente despues de cada asignacion.
- Se agregaron fecha de inicio y direccion a los talleres ficticios.
- La disponibilidad se calcula por taller y fecha seleccionada.
- La confirmacion muestra todos los datos necesarios para asistir al taller.
- Se agrego la descarga de un comprobante PDF local de demostracion.
- Se conecto el catalogo ciudadano con el formulario de inscripcion.
- Se implemento registro de vecinos, control de RUT, cupos y duplicados.
- Se implemento creacion de talleres y consulta de inscritos.
- Se implemento seleccion de participantes y guardado de asistencia.
- Se implemento actualizacion y alta de elementos de inventario.
- Se agrego un resumen de reportes calculado desde el estado local.
- Se genero una descarga TXT que se identifica como demostracion.
- Se desactivo la navegacion hacia nodos inexistentes.

## UX Y Seguridad Comunicacional

- Se mantuvieron paleta, tipografia, espaciado y composicion del prototipo.
- Se agrego un aviso persistente de prototipo y datos ficticios.
- Se reemplazaron mensajes de autenticacion, firma y sincronizacion real por textos de demostracion o pendiente de backend.
- Se agregaron mensajes de error y exito dentro de los formularios.
- Se agregaron labels y nombres accesibles en controles nuevos.
- Se adapto el layout administrativo para pantallas menores a 900 px.
- Se reutiliza el recurso de marca local cuando las imagenes remotas no estan disponibles.

## Conservacion Del Material

- No se eliminaron HTML, capturas ni exportaciones originales.
- Las paginas profundas y documentos de diseno se conservan en su ubicacion original.
