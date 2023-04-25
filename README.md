# Proyecto-Integrador-SIRA
Backend y Frontend (Web y Móvil) de SIRA

- Backend Spring Boot
- Frontend Web React
- Frontend Móvil React Native/Expo Cli
- Modelo ER de la base de datos
- Archivo SQL para configurar la BD
- Vídeo demostrativo del funcionamiento

Funcionalidades

Como usuario (todo público):
- Reportar incidencias: se selecciona un aspecto ambiental, se describe el incidente, se guarda la ubicación GPS, se describe la ubicación, se toma con la cámara o se selecciona de la galería una fotografía del incidente (opcional) y se envía al correo electrónico del encargado del aspecto ambiental seleccionado previamente.

Como encargado de aspecto ambiental:
- Visualizar todos los reportes que le han enviado
- Visualizar de manera específica los detalles de cada reporte y marcarlo como completado en caso de que ya se le haya dado solución a la incidencia
- Descargar un archivo PDF con los detalles de cada reporte
- Descargar un archivo PDF de un resumen mensual de los reportes generados de su aspecto ambiental
- Visualizar los detalles de su perfil
- Cambiar su contraseña

Como administrador:
- Visualizar todos los reportes 
- Descargar un archivo PDF con los detalles de cada reporte
- Descargar un archivo PDF de un resumen de todos los reportes generados en un rango de fechas 
- Visualizar en forma de gráfica todos los reportes generados por aspecto en un rango de fechas
- Gestionar aspectos ambientales (visualizarlos, registrar nuevos, editar su información, editar su encargado, deshabilitarlos y habilitarlos)
- Gestionar usuarios (visualizarlos, registrar nuevos y editar su información)
- Visualizar los detalles de su perfil
- Cambiar su contraseña
