# MONTAJE-PRO | Aplicación SPA de Gestión y Seguimiento de Obras y Proyectos de Montaje

Prototipo funcional de SPA (Single Page Application) responsiva y moderna para la planificación, ejecución y control de obras de ingeniería, piping, skids y estructuras metálicas.

---

## 🚀 Inicio Rápido

Tienes 3 opciones sencillas para probar la aplicación de inmediato:

1. **Opción A (Recomendada):** Haz doble clic en el archivo `iniciar.bat`. Se abrirá un servidor local en el puerto `8080` y se abrirá automáticamente tu navegador web en `http://localhost:8080/index.html`.
2. **Opción B (Línea de comandos):** Ejecuta `node server.js` en esta carpeta.
3. **Opción C (Directa):** Haz doble clic directamente sobre `index.html` en tu explorador de archivos.

---

## 🏗️ Características Implementadas

### 1. Arquitectura y Navegación
* **Pestaña 1 (Estimado):** Cronograma de línea de base contractual. Permite calendarizar tareas, arrastrar desde la bandeja de pendientes y dimensionar dotaciones de personal y maquinaria pesada.
* **Pestaña 2 (Real):** Ejecución efectiva en terreno. Diseñada para capataces y supervisores para registrar partes diarios, horas reales consumidas y porcentaje de avance físico (% real) para todos los oficios y equipos activos.
* **Pestaña 3 (Comparativa / Control):** Visualización combinada de doble barra por cada tarea:
  * Barra superior: Estimado contractual.
  * Barra inferior: Real ejecutado en terreno con su progreso.
  * Insignias automáticas de variación: $\Delta$ Días (`+2d Retraso`, `-1d Adelanto`) y $\Delta$ HH (`+18 HH sobrecosto`, `-5 HH ahorro`).
* **Alta de Nueva Obra (`+ Nueva Obra`):** Formulario para crear proyectos desde cero configurando cliente, inicio, plazo, monto cotizado ($ USD) y capacidades de cuadrillas.
* **Balance Consolidado de Recursos (`Balance Recursos`):** Auditoría cuantitativa y económica recurso por recurso (cotizado vs consumido, saldo, % de agotamiento y exportación a CSV).
* **Informe Ejecutivo Imprimible (`Informe PDF`):** Reporte formal listo para imprimir o guardar en PDF con cuadro de tareas y firmas de conformidad.
* **Control de Margen Contractual:** Seguimiento en tiempo real del margen bruto proyectado ($ y %) respecto al monto cotizado de venta.
* **Acceso por Enlace (Deep Linking):** Parámetros en el hash de la URL (`#obra=OBRA-PIP-2026-01&tab=comparativa&mode=supervision`). Permite compartir vistas en modo lectura/supervisión para clientes y gerentes.
* **Diseño 100% Responsivo:** Interfaz táctil adaptable con bandeja desplegable en dispositivos móviles para uso en obra.

### 2. Línea de Tiempo y Drag & Drop
* **Calendario diario continuo (Eje X superior):** Muestra días de la semana y fechas (ej. `Lun 01 Sep`, `Mar 02 Sep`).
* **Bandeja lateral de pendientes:** Tareas presupuestadas listas para ser asignadas.
* **Arrastrar y Soltar (Drag & Drop):** Arrastra tarjetas directamente desde la bandeja hacia cualquier columna de día del calendario, o muévelas entre fechas para reprogramar.
* **Comportamiento dinámico de tarjetas:**
  * Barra interna de avance porcentual físico.
  * Semáforo de estados:
    * 🟢 **Verde:** En proceso y en fecha dentro de lo estimado.
    * 🟡 **Amarillo:** Pendiente de inicio.
    * 🔴 **Rojo:** Atrasada respecto a la estimación o con conflicto operativo de recursos.
    * 🔵 **Azul:** Finalizada al 100%.

### 3. Modelo de Datos de Recursos Industriales
* **Mano de Obra (Horas-Hombre desglosadas por oficio):**
  * Supervisor / Capataz
  * Cañistas / Tuberos Especializados
  * Soldadores Calificados 6G (TIG / SMAW)
  * Montadores Mecánicos y Estructurales
  * Ayudantes de Cuadrilla
* **Maquinaria Pesada (Horas de equipo):**
  * Grúa Móvil Telescópica 50T
  * Camión Hidrogrúa (Hiab 15T)
  * Hidroelevador articulado (Manlift 16m)
* **Equipamiento y Logística:**
  * Andamios multidireccionales (m²)
  * Grupos electrógenos 100 kVA
  * Motosoldadoras 400A
  * Bomba de prueba hidrostática 100 bar

### 4. Motor de Detección de Conflictos de Recursos
* Detección automática en tiempo real de solapamientos que superan la dotación o maquinaria máxima disponible (ej.: requerimiento de 2 grúas de 50T cuando solo hay 1 disponible, o más soldadores que los contratados).
* Indicadores visuales en el encabezado de fecha del cronograma con contador de sobreasignaciones.
* Modal **Inspector de Conflictos** con opción de resolución con 1 clic ("Desplazar tarea +1 día").

### 5. Panel de Indicadores (Dashboard KPI)
* Horas-Hombre totales estimadas vs. reales y cálculo de sobrecosto/ahorro.
* Avance Físico Global Ponderado por HH.
* Costo Estimado vs. Costo Real Acumulado ($ USD).
* Indicador EVM (SPI - Schedule Performance Index) y cómputo de días de desviación acumulados.

### 6. Carga e Importación de Presupuestos
* Modal de importación con plantillas industriales listas para usar:
  1. *Spools y Válvulas en Rack de Proceso (Piping Gas)*
  2. *Montaje de Estructura Metálica y Pasarelas de Plataforma*
* Soporte para parsear texto copiado desde Excel (TSV), CSV o JSON directo.
