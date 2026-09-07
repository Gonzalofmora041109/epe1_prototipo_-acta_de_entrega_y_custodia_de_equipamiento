# Estado Funcional

| Funcionalidad | Estado | Observacion |
|---|---|---|
| Portal ciudadano | Implementada | Catalogo, filtros, sedes, avisos y acceso a inscripcion |
| Inscripcion ciudadana en tres pasos | Implementada con datos simulados | Identificacion, contacto y confirmacion local |
| Consulta Mis inscripciones | Implementada con datos simulados | Consulta por RUT en el navegador actual |
| Crear y consultar talleres | Implementada con datos simulados | Persistencia local reemplazable por API |
| Ver cupos e inscritos desde Gestion de Talleres | Implementada con datos simulados | Panel con busqueda y listado actualizado |
| Asignar vecino existente desde un taller | Implementada con datos simulados | Excluye personas ya inscritas |
| Registrar vecino nuevo desde un taller | Implementada con datos simulados | Registra e inscribe en una sola accion |
| Registrar vecino | Implementada con datos simulados | Incluye validacion de RUT y campos obligatorios |
| Inscribir en taller | Implementada con datos simulados | Valida cupo y duplicado por RUT+taller |
| Cupos por fecha seleccionada | Implementada con datos simulados | Se calcula en el formulario ciudadano |
| Comprobante PDF de inscripción | Implementada con datos simulados | PDF local sin validez oficial |
| Registrar asistencia | Implementada con datos simulados | Guarda una sesion por taller y fecha |
| Historial detallado de asistencia | Pendiente de backend | El estado conserva sesiones, falta una vista historica completa |
| Gestionar inventario | Implementada con datos simulados | Alta, cantidad, estado y movimientos locales |
| Resumen de reportes | Implementada con datos simulados | Indicadores calculados desde el estado local |
| Exportacion oficial PDF/XLSX | Pendiente de backend | Solo descarga TXT identificado como demostracion |
| Autenticacion y roles | Pendiente de backend | Pantalla disponible como acceso de demostracion |
| ClaveUnica y RSH | Pendiente de backend | Sin integraciones ni credenciales reales |
| Firma digital y despacho | Pendiente de backend | Acciones informativas, sin envio externo |
| Usabilidad con funcionarios y vecinos | Pendiente de validacion con usuarios | Requiere pruebas en terreno |
| Accesibilidad WCAG completa | Pendiente de validacion con usuarios | Se aplicaron mejoras basicas, falta auditoria formal |
| Infraestructura AWS | Pendiente de backend | No se crearon recursos AWS |
