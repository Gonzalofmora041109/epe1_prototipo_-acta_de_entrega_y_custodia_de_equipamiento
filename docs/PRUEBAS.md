# Pruebas Ejecutadas

Fecha de ejecucion: 2026-09-06.

## Automaticas

| Prueba | Resultado |
|---|---|
| Normalizacion y validacion de RUT | Correcto |
| Registro e inscripcion de vecino | Correcto |
| Bloqueo de inscripcion duplicada | Correcto |
| Consulta y asignacion desde Gestion de Talleres | Correcto |
| Guardado y calculo de asistencia | Correcto |
| Actualizacion y movimiento de inventario | Correcto |
| Sintaxis de modulos JavaScript | Correcto |
| Resolucion de enlaces en 15 paginas oficiales | Correcto |

Comandos utilizados:

```bash
npm test
npm run check:links
node --check assets/js/app.js
```

## Navegador

- Servidor iniciado correctamente en `http://127.0.0.1:4173`.
- Respuesta HTTP correcta de portal, inscripciones, asistencia, inventario y reportes.
- Renderizado revisado con Firefox headless en 1440x1000.
- Renderizado revisado con Firefox headless en 390x844.
- Menu movil, CTA de inscripcion y tarjeta de talleres revisados visualmente.
- Dialogo de inscripcion guiada revisado en estructura responsive.
- Se corrigio el sidebar fijo que invadia el viewport movil.
- Se corrigio el fallback tipografico cuando Google Fonts no esta disponible.

## Evidencias

- `capturas/portal-desktop.png`
- `capturas/inscripciones-desktop.png`
- `capturas/inventario-mobile.png`
- `capturas/reportes-desktop.png`

## Limitaciones De La Prueba

- No se realizo una auditoria WCAG automatizada completa.
- Las dependencias visuales externas pueden variar segun conectividad.
- La autenticacion y servicios externos no se prueban porque no estan implementados.
