(() => {

// ===== mockData.js =====
// ==========================================================================
// MOCK DATA: CATÁLOGO DE RECURSOS, PROYECTOS INDUSTRIALES Y PLANTILLAS
// ==========================================================================
const RESOURCE_CATALOG = {
    labor: [
        { id: 'supervisor', name: 'Supervisor / Capataz', unit: 'HH', hourlyRate: 38, defaultLimit: 2, icon: 'hard-hat' },
        { id: 'canista', name: 'Cañista / Tubero Especializado', unit: 'HH', hourlyRate: 32, defaultLimit: 6, icon: 'wrench' },
        { id: 'soldador', name: 'Soldador Calificado 6G (TIG/SMAW)', unit: 'HH', hourlyRate: 35, defaultLimit: 4, icon: 'flame' },
        { id: 'montador', name: 'Montador Mecánico / Estructuras', unit: 'HH', hourlyRate: 28, defaultLimit: 6, icon: 'hammer' },
        { id: 'ayudante', name: 'Ayudante de Cuadrilla', unit: 'HH', hourlyRate: 20, defaultLimit: 8, icon: 'users' }
    ],
    machinery: [
        { id: 'grua_50t', name: 'Grúa Móvil Telescópica 50T', unit: 'Horas', hourlyRate: 185, defaultLimit: 1, icon: 'truck' },
        { id: 'hidrogrua', name: 'Camión Hidrogrúa (Hiab 15T)', unit: 'Horas', hourlyRate: 95, defaultLimit: 1, icon: 'truck' },
        { id: 'hidroelevador', name: 'Hidroelevador Manlift 16m', unit: 'Horas', hourlyRate: 65, defaultLimit: 2, icon: 'navigation' }
    ],
    equipment: [
        { id: 'andamios', name: 'Andamio Multidireccional Certificado', unit: 'm²', dailyRate: 12, defaultLimit: 250, icon: 'layers' },
        { id: 'generador', name: 'Grupo Electrógeno 100 kVA', unit: 'Días', dailyRate: 110, defaultLimit: 2, icon: 'zap' },
        { id: 'motosoldadora', name: 'Motosoldadora Lincoln 400A', unit: 'Días', dailyRate: 85, defaultLimit: 4, icon: 'battery-charging' },
        { id: 'bomba_hidro', name: 'Bomba de Prueba Hidrostática 100 bar', unit: 'Días', dailyRate: 140, defaultLimit: 1, icon: 'droplet' }
    ]
};
const DISCIPLINES = [
    { id: 'piping', name: 'Cañería (Piping)', color: 'blue', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 'estructura', name: 'Estructuras Metálicas', color: 'amber', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'equipos', name: 'Montaje de Equipos', color: 'purple', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'soldadura', name: 'Soldadura Especial', color: 'orange', badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    { id: 'end', name: 'Ensayos No Destructivos (END)', color: 'emerald', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'pruebas', name: 'Pruebas y Comisionado', color: 'cyan', badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' }
];
const INITIAL_PROJECTS = [
    {
        id: 'OBRA-PIP-2026-01',
        code: 'REVAMP-PCG-01',
        name: 'Ampliación Planta Compresora Gas - Racks y Batería de Proceso',
        client: 'Transportadora de Gas Austral',
        location: 'Comodoro Rivadavia, Chubut',
        startDate: '2026-09-01',
        durationDays: 28,
        currency: 'USD',
        contractBudget: 165000,
        resourceLimits: {
            soldador: 4,
            canista: 6,
            montador: 5,
            ayudante: 8,
            supervisor: 2,
            grua_50t: 1,
            hidrogrua: 1,
            hidroelevador: 2,
            andamios: 200,
            generador: 2,
            motosoldadora: 3,
            bomba_hidro: 1
        },
        tasks: [
            {
                id: 'TSK-101',
                tag: 'EST-01',
                name: 'Montaje de Columnas y Vigas Rack Principal Tramo A',
                discipline: 'estructura',
                durationDays: 4,
                estimatedStart: '2026-09-01',
                estimatedEnd: '2026-09-04',
                realStart: '2026-09-01',
                realEnd: '2026-09-04',
                progress: 100,
                status: 'completed',
                notes: 'Montaje completado con torqueado de bulonería ASTM A325 verificado.',
                labor: { supervisor: 32, canista: 0, montador: 96, soldador: 0, ayudante: 64 },
                machinery: { grua_50t: 24, hidrogrua: 16, hidroelevador: 32 },
                equipment: { andamios: 80, generador: 4, motosoldadora: 0, bomba_hidro: 0 },
                realLabor: { supervisor: 34, canista: 0, montador: 102, soldador: 0, ayudante: 68 },
                realMachinery: { grua_50t: 26, hidrogrua: 16, hidroelevador: 34 }
            },
            {
                id: 'TSK-102',
                tag: 'PIP-01',
                name: 'Tendido e Izaje de Spools Cañería 10" Sch 40 - Rack A',
                discipline: 'piping',
                durationDays: 5,
                estimatedStart: '2026-09-03',
                estimatedEnd: '2026-09-07',
                realStart: '2026-09-04',
                realEnd: '2026-09-09',
                progress: 85,
                status: 'in_progress',
                notes: 'Retraso de 1 día por viento de más de 45 km/h que imposibilitó izajes.',
                labor: { supervisor: 40, canista: 80, montador: 40, soldador: 20, ayudante: 60 },
                machinery: { grua_50t: 25, hidrogrua: 20, hidroelevador: 30 },
                equipment: { andamios: 120, generador: 5, motosoldadora: 2, bomba_hidro: 0 },
                realLabor: { supervisor: 45, canista: 92, montador: 44, soldador: 22, ayudante: 70 },
                realMachinery: { grua_50t: 28, hidrogrua: 24, hidroelevador: 35 }
            },
            {
                id: 'TSK-103',
                tag: 'SOL-01',
                name: 'Soldadura TIG Raíz + Arco Juntas a Tope 10" ASTM A106 Gr.B',
                discipline: 'soldadura',
                durationDays: 4,
                estimatedStart: '2026-09-06',
                estimatedEnd: '2026-09-09',
                realStart: '2026-09-07',
                realEnd: '2026-09-11',
                progress: 60,
                status: 'delayed',
                notes: 'Se requiere completar 22 juntas. Hay 13 completadas aprobadas visualmente.',
                labor: { supervisor: 32, canista: 32, montador: 0, soldador: 96, ayudante: 32 },
                machinery: { grua_50t: 0, hidrogrua: 8, hidroelevador: 24 },
                equipment: { andamios: 100, generador: 4, motosoldadora: 4, bomba_hidro: 0 },
                realLabor: { supervisor: 28, canista: 26, montador: 0, soldador: 74, ayudante: 25 },
                realMachinery: { grua_50t: 0, hidrogrua: 8, hidroelevador: 20 }
            },
            {
                id: 'TSK-104',
                tag: 'EQP-01',
                name: 'Izaje y Emplazamiento de Intercambiador de Calor E-102 (42 Ton)',
                discipline: 'equipos',
                durationDays: 3,
                estimatedStart: '2026-09-07',
                estimatedEnd: '2026-09-09',
                realStart: '2026-09-07',
                realEnd: '2026-09-09',
                progress: 70,
                status: 'conflict',
                notes: '¡Alerta de Operación! Coincide con uso de Grúa 50T requerida en TSK-102.',
                labor: { supervisor: 24, canista: 16, montador: 48, soldador: 8, ayudante: 32 },
                machinery: { grua_50t: 24, hidrogrua: 12, hidroelevador: 16 },
                equipment: { andamios: 60, generador: 3, motosoldadora: 1, bomba_hidro: 0 },
                realLabor: { supervisor: 20, canista: 12, montador: 38, soldador: 6, ayudante: 24 },
                realMachinery: { grua_50t: 18, hidrogrua: 10, hidroelevador: 12 }
            },
            {
                id: 'TSK-105',
                tag: 'END-01',
                name: 'Control No Destructivo: Radiografía Industrial (Gammagrafía 100%)',
                discipline: 'end',
                durationDays: 2,
                estimatedStart: '2026-09-10',
                estimatedEnd: '2026-09-11',
                realStart: null,
                realEnd: null,
                progress: 0,
                status: 'pending',
                notes: 'Trabajo en turno nocturno por radioprotección y despeje de zona 50m.',
                labor: { supervisor: 16, canista: 8, montador: 0, soldador: 8, ayudante: 16 },
                machinery: { grua_50t: 0, hidrogrua: 0, hidroelevador: 8 },
                equipment: { andamios: 50, generador: 2, motosoldadora: 0, bomba_hidro: 0 },
                realLabor: {},
                realMachinery: {}
            },
            {
                id: 'TSK-106',
                tag: 'PRU-01',
                name: 'Prueba Hidrostática Circuito Gas 10" a 72 bar (ASME B31.3)',
                discipline: 'pruebas',
                durationDays: 3,
                estimatedStart: '2026-09-12',
                estimatedEnd: '2026-09-14',
                realStart: null,
                realEnd: null,
                progress: 0,
                status: 'pending',
                notes: 'Llenado con agua tratada e inhibidor de corrosión. Mantener presión 4 horas.',
                labor: { supervisor: 24, canista: 48, montador: 24, soldador: 12, ayudante: 36 },
                machinery: { grua_50t: 0, hidrogrua: 12, hidroelevador: 0 },
                equipment: { andamios: 60, generador: 3, motosoldadora: 1, bomba_hidro: 3 },
                realLabor: {},
                realMachinery: {}
            }
        ],
        backlog: [
            {
                id: 'TSK-107',
                tag: 'PIP-02',
                name: 'Montaje de Válvulas de Seguridad y Alivio (PSV-101/102)',
                discipline: 'piping',
                durationDays: 2,
                estimatedStart: null,
                estimatedEnd: null,
                realStart: null,
                realEnd: null,
                progress: 0,
                status: 'pending',
                notes: 'Válvulas calibradas con certificado de banco de pruebas INTI.',
                labor: { supervisor: 16, canista: 32, montador: 16, soldador: 8, ayudante: 16 },
                machinery: { grua_50t: 0, hidrogrua: 8, hidroelevador: 12 },
                equipment: { andamios: 40, generador: 2, motosoldadora: 0, bomba_hidro: 0 },
                realLabor: {},
                realMachinery: {}
            },
            {
                id: 'TSK-108',
                tag: 'EST-02',
                name: 'Montaje de Escalera Helicoidal y Pasarela Skid B',
                discipline: 'estructura',
                durationDays: 3,
                estimatedStart: null,
                estimatedEnd: null,
                realStart: null,
                realEnd: null,
                progress: 0,
                status: 'pending',
                notes: 'Instalación de grating galvanizado y guardapiés de seguridad según OSHA.',
                labor: { supervisor: 24, canista: 0, montador: 48, soldador: 16, ayudante: 32 },
                machinery: { grua_50t: 8, hidrogrua: 16, hidroelevador: 24 },
                equipment: { andamios: 60, generador: 3, motosoldadora: 2, bomba_hidro: 0 },
                realLabor: {},
                realMachinery: {}
            },
            {
                id: 'TSK-109',
                tag: 'PRU-02',
                name: 'Deshidratado, Barrido con Nitrógeno y Golden Weld Final',
                discipline: 'pruebas',
                durationDays: 2,
                estimatedStart: null,
                estimatedEnd: null,
                realStart: null,
                realEnd: null,
                progress: 0,
                status: 'pending',
                notes: 'Punto de rocío de -40°C garantizado antes de introducción de gas natural.',
                labor: { supervisor: 16, canista: 24, montador: 8, soldador: 16, ayudante: 16 },
                machinery: { grua_50t: 0, hidrogrua: 8, hidroelevador: 0 },
                equipment: { andamios: 20, generador: 2, motosoldadora: 2, bomba_hidro: 0 },
                realLabor: {},
                realMachinery: {}
            }
        ]
    },
    {
        id: 'OBRA-SKID-2026-02',
        code: 'SKID-SEP-02',
        name: 'Montaje Mecánico y Piping de Skid Separador Trifásico 1440 PSI',
        client: 'YPF S.A. - Cuenca Neuquina',
        location: 'Añelo, Neuquén',
        startDate: '2026-09-01',
        durationDays: 21,
        currency: 'USD',
        contractBudget: 95000,
        resourceLimits: {
            soldador: 3,
            canista: 5,
            montador: 4,
            ayudante: 6,
            supervisor: 1,
            grua_50t: 1,
            hidrogrua: 1,
            hidroelevador: 1,
            andamios: 150,
            generador: 2,
            motosoldadora: 2,
            bomba_hidro: 1
        },
        tasks: [
            {
                id: 'TSK-201',
                tag: 'EST-SK1',
                name: 'Nivelación y Anclaje de Bastidor Estructural Skid (Vigas W12)',
                discipline: 'estructura',
                durationDays: 3,
                estimatedStart: '2026-09-01',
                estimatedEnd: '2026-09-03',
                realStart: '2026-09-01',
                realEnd: '2026-09-03',
                progress: 100,
                status: 'completed',
                notes: 'Grouting epoxídico fraguado y ensayado con esclerómetro.',
                labor: { supervisor: 24, canista: 0, montador: 48, soldador: 0, ayudante: 24 },
                machinery: { grua_50t: 16, hidrogrua: 8, hidroelevador: 0 },
                equipment: { andamios: 40, generador: 3, motosoldadora: 0, bomba_hidro: 0 },
                realLabor: { supervisor: 24, canista: 0, montador: 50, soldador: 0, ayudante: 26 },
                realMachinery: { grua_50t: 16, hidrogrua: 8, hidroelevador: 0 }
            },
            {
                id: 'TSK-202',
                tag: 'EQP-SK1',
                name: 'Montaje y Asentamiento de Vasija Separadora V-101 en Sillas',
                discipline: 'equipos',
                durationDays: 2,
                estimatedStart: '2026-09-04',
                estimatedEnd: '2026-09-05',
                realStart: '2026-09-04',
                realEnd: '2026-09-05',
                progress: 100,
                status: 'completed',
                notes: 'Izaje en tándem ejecutado con estrobos certificados y maniobristas calificados.',
                labor: { supervisor: 16, canista: 8, montador: 32, soldador: 0, ayudante: 24 },
                machinery: { grua_50t: 16, hidrogrua: 12, hidroelevador: 8 },
                equipment: { andamios: 40, generador: 2, motosoldadora: 0, bomba_hidro: 0 },
                realLabor: { supervisor: 16, canista: 8, montador: 30, soldador: 0, ayudante: 22 },
                realMachinery: { grua_50t: 15, hidrogrua: 12, hidroelevador: 8 }
            },
            {
                id: 'TSK-203',
                tag: 'PIP-SK1',
                name: 'Fabricación y Montaje de Manifold de Entrada 6" ANSI 600#',
                discipline: 'piping',
                durationDays: 4,
                estimatedStart: '2026-09-06',
                estimatedEnd: '2026-09-09',
                realStart: '2026-09-06',
                realEnd: null,
                progress: 75,
                status: 'in_progress',
                notes: 'Alineación de bridas Weld Neck completada.',
                labor: { supervisor: 32, canista: 64, montador: 24, soldador: 48, ayudante: 40 },
                machinery: { grua_50t: 0, hidrogrua: 16, hidroelevador: 16 },
                equipment: { andamios: 60, generador: 4, motosoldadora: 2, bomba_hidro: 0 },
                realLabor: { supervisor: 24, canista: 52, montador: 18, soldador: 38, ayudante: 30 },
                realMachinery: { grua_50t: 0, hidrogrua: 12, hidroelevador: 14 }
            }
        ],
        backlog: [
            {
                id: 'TSK-204',
                tag: 'SOL-SK2',
                name: 'Soldadura de Conexiones de Drenaje y Venteo 2" Socket Weld',
                discipline: 'soldadura',
                durationDays: 2,
                estimatedStart: null,
                estimatedEnd: null,
                realStart: null,
                realEnd: null,
                progress: 0,
                status: 'pending',
                notes: 'Soldadura con electrodo E7018 3/32" de bajo hidrógeno.',
                labor: { supervisor: 16, canista: 16, montador: 0, soldador: 32, ayudante: 16 },
                machinery: { grua_50t: 0, hidrogrua: 4, hidroelevador: 0 },
                equipment: { andamios: 20, generador: 2, motosoldadora: 2, bomba_hidro: 0 },
                realLabor: {},
                realMachinery: {}
            }
        ]
    }
];
const PRESET_IMPORT_TEMPLATES = [
    {
        name: 'Spools y Válvulas en Rack de Proceso (Piping Gas)',
        description: 'Plantilla de prefabricado, izaje, soldadura y pruebas de cañería industrial.',
        tasks: [
            { name: 'Corte, biselado y prefabricado de spools 8" Sch 80', discipline: 'piping', durationDays: 3, canista: 48, soldador: 24, montador: 0, ayudante: 32, grua_50t: 0, hidrogrua: 12 },
            { name: 'Montaje e izaje de spools en ménsulas de Rack elevado', discipline: 'piping', durationDays: 4, canista: 64, soldador: 0, montador: 48, ayudante: 48, grua_50t: 20, hidrogrua: 16 },
            { name: 'Soldadura de uniones en posición 5G/6G (TIG + Arco)', discipline: 'soldadura', durationDays: 5, canista: 24, soldador: 80, montador: 0, ayudante: 32, grua_50t: 0, hidrogrua: 8 },
            { name: 'Ensayos No Destructivos (100% Rx + Líquidos Penetrantes)', discipline: 'end', durationDays: 2, canista: 8, soldador: 8, montador: 0, ayudante: 16, grua_50t: 0, hidrogrua: 0 },
            { name: 'Prueba hidrostática y secado con compresor exento de aceite', discipline: 'pruebas', durationDays: 2, canista: 32, soldador: 0, montador: 16, ayudante: 24, grua_50t: 0, hidrogrua: 8, bomba_hidro: 2 }
        ]
    },
    {
        name: 'Montaje de Estructura Metálica y Pasarelas de Plataforma',
        description: 'Montaje de pórticos pesados, cruces de San Andrés, barandas y piso de rejilla.',
        tasks: [
            { name: 'Topografía, replanteo y colocación de placas base', discipline: 'estructura', durationDays: 2, supervisor: 16, montador: 32, ayudante: 16, grua_50t: 0, hidrogrua: 8 },
            { name: 'Izaje y presentación de columnas principales HEB 300 con Grúa', discipline: 'estructura', durationDays: 3, supervisor: 24, montador: 48, ayudante: 32, grua_50t: 24, hidrogrua: 16 },
            { name: 'Torqueado de bulonería estructural A325 y soldaduras de campo', discipline: 'soldadura', durationDays: 3, supervisor: 24, montador: 24, soldador: 48, ayudante: 24, grua_50t: 0, hidrogrua: 8 },
            { name: 'Instalación de grating galvanizado y pasamanos de seguridad', discipline: 'estructura', durationDays: 2, supervisor: 16, montador: 32, ayudante: 32, grua_50t: 0, hidrogrua: 8 }
        ]
    }
];


// ===== conflictEngine.js =====
// ==========================================================================
// CONFLICT ENGINE: DETECCIÓN Y ANÁLISIS DE CONFLICTOS DE RECURSOS
// ==========================================================================

/**
 * Genera un array de fechas (YYYY-MM-DD) entre startDate y endDate inclusive
 */
function getDatesRange(startDateStr, endDateStr) {
    const dates = [];
    if (!startDateStr || !endDateStr) return dates;
    
    let curr = new Date(startDateStr + 'T00:00:00');
    const end = new Date(endDateStr + 'T00:00:00');
    
    while (curr <= end) {
        dates.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
    }
    return dates;
}

/**
 * Calcula la fecha de fin a partir de una fecha de inicio y una duración en días (mínimo 1 día)
 */
function calculateEndDate(startDateStr, durationDays) {
    if (!startDateStr) return null;
    const dur = Math.max(1, parseInt(durationDays) || 1);
    const start = new Date(startDateStr + 'T00:00:00');
    start.setDate(start.getDate() + (dur - 1));
    return start.toISOString().split('T')[0];
}

/**
 * Busca metadatos de un recurso en el catálogo (labor, machinery, equipment)
 */
function getResourceMeta(resourceId) {
    for (const group of ['labor', 'machinery', 'equipment']) {
        const found = RESOURCE_CATALOG[group].find(r => r.id === resourceId);
        if (found) return { ...found, category: group };
    }
    return { id: resourceId, name: resourceId, unit: 'u', hourlyRate: 25, defaultLimit: 5, category: 'labor' };
}

/**
 * Motor central de detección de conflictos de recursos por día.
 * Analiza las tareas programadas activas (ya sea en pestaña Estimado o Real).
 * 
 * @param {Array} tasks - Lista de tareas del proyecto
 * @param {Object} resourceLimits - Límites diarios definidos para el proyecto
 * @param {'estimated'|'real'} mode - Modo de análisis ('estimated' o 'real')
 * @returns {Object} { conflictsByDate, taskConflicts, dailyLoad, totalConflictsCount }
 */
function analyzeResourceConflicts(tasks, resourceLimits = {}, mode = 'estimated') {
    const dailyLoad = {}; // date -> { resourceId: { total: number, tasks: [taskId] } }
    const conflictsByDate = {}; // date -> [ { resourceId, name, unit, required, limit, excess, taskIds } ]
    const taskConflicts = {}; // taskId -> [ { date, resourceId, resourceName, required, limit, conflictingWithTaskIds } ]

    // 1. Filtrar tareas programadas según el modo
    const scheduledTasks = (tasks || []).filter(t => {
        if (mode === 'real') {
            return t.realStart && (t.realEnd || t.estimatedEnd);
        }
        return t.estimatedStart && t.estimatedEnd;
    });

    // 2. Distribuir recursos por cada día de ejecución de la tarea
    scheduledTasks.forEach(task => {
        const start = mode === 'real' ? (task.realStart || task.estimatedStart) : task.estimatedStart;
        const end = mode === 'real' ? (task.realEnd || task.estimatedEnd) : task.estimatedEnd;
        const dur = Math.max(1, task.durationDays || 1);
        const dates = getDatesRange(start, end);

        if (dates.length === 0) return;

        // Combinar recursos asignados
        const labor = (mode === 'real' && task.realLabor && Object.keys(task.realLabor).length > 0) 
            ? task.realLabor 
            : (task.labor || {});
        
        const machinery = (mode === 'real' && task.realMachinery && Object.keys(task.realMachinery).length > 0)
            ? task.realMachinery
            : (task.machinery || {});
        
        const equipment = task.equipment || {};

        // Por cada día de la tarea, computar consumo diario (asumiendo jornada de 8h o prorrateo)
        dates.forEach(date => {
            if (!dailyLoad[date]) dailyLoad[date] = {};

            // Mano de obra (HH distribuidas en días -> dotación estimada = HH / (dur * 8h))
            Object.entries(labor).forEach(([resId, totalHH]) => {
                if (!totalHH || totalHH <= 0) return;
                const dailyWorkers = Math.ceil(totalHH / (dur * 8)); // Personas necesarias por día
                if (!dailyLoad[date][resId]) dailyLoad[date][resId] = { total: 0, taskIds: [] };
                dailyLoad[date][resId].total += dailyWorkers;
                if (!dailyLoad[date][resId].taskIds.includes(task.id)) {
                    dailyLoad[date][resId].taskIds.push(task.id);
                }
            });

            // Maquinaria (Horas de equipo distribuidas -> unidades de equipo = Horas / (dur * 8h))
            Object.entries(machinery).forEach(([resId, totalHours]) => {
                if (!totalHours || totalHours <= 0) return;
                const dailyUnits = Math.ceil(totalHours / (dur * 8));
                if (!dailyLoad[date][resId]) dailyLoad[date][resId] = { total: 0, taskIds: [] };
                dailyLoad[date][resId].total += Math.max(1, dailyUnits);
                if (!dailyLoad[date][resId].taskIds.includes(task.id)) {
                    dailyLoad[date][resId].taskIds.push(task.id);
                }
            });

            // Equipamiento logístico
            Object.entries(equipment).forEach(([resId, qty]) => {
                if (!qty || qty <= 0) return;
                if (!dailyLoad[date][resId]) dailyLoad[date][resId] = { total: 0, taskIds: [] };
                // Para andamios se toma la superficie m² continua; para máquinas en días de uso se prorratea por la duración
                const dailyQty = (resId === 'andamios') ? qty : Math.max(1, Math.ceil(qty / dur));
                dailyLoad[date][resId].total += dailyQty;
                if (!dailyLoad[date][resId].taskIds.includes(task.id)) {
                    dailyLoad[date][resId].taskIds.push(task.id);
                }
            });
        });
    });

    // 3. Evaluar límites y detectar sobrecargas
    let totalConflictsCount = 0;

    Object.entries(dailyLoad).forEach(([date, resources]) => {
        Object.entries(resources).forEach(([resId, data]) => {
            const meta = getResourceMeta(resId);
            const limit = (resourceLimits && resourceLimits[resId] !== undefined) 
                ? resourceLimits[resId] 
                : (meta.defaultLimit || 5);

            if (data.total > limit && data.taskIds.length > 1) {
                // Hay sobreasignación
                if (!conflictsByDate[date]) conflictsByDate[date] = [];

                const conflictItem = {
                    resourceId: resId,
                    resourceName: meta.name,
                    unit: meta.unit,
                    category: meta.category,
                    required: data.total,
                    limit: limit,
                    excess: data.total - limit,
                    taskIds: [...data.taskIds]
                };

                conflictsByDate[date].push(conflictItem);
                totalConflictsCount++;

                // Mapear el conflicto a cada tarea involucrada
                data.taskIds.forEach(tId => {
                    if (!taskConflicts[tId]) taskConflicts[tId] = [];
                    const others = data.taskIds.filter(id => id !== tId);
                    taskConflicts[tId].push({
                        date,
                        resourceId: resId,
                        resourceName: meta.name,
                        required: data.total,
                        limit,
                        conflictingWithTaskIds: others
                    });
                });
            }
        });
    });

    return {
        dailyLoad,
        conflictsByDate,
        taskConflicts,
        totalConflictsCount
    };
}


// ===== parser.js =====
// ==========================================================================
// PARSER: IMPORTACIÓN DE PRESUPUESTOS Y LISTAS DE TAREAS (EXCEL, CSV, TEXTO)
// ==========================================================================

/**
 * Detecta la disciplina a partir del texto de la tarea
 */
function inferDiscipline(text) {
    const lower = text.toLowerCase();
    if (lower.includes('cañer') || lower.includes('piping') || lower.includes('spool') || lower.includes('valv') || lower.includes('brida')) {
        return 'piping';
    }
    if (lower.includes('soldad') || lower.includes('tig') || lower.includes('electrodo') || lower.includes('raiz') || lower.includes('weld')) {
        return 'soldadura';
    }
    if (lower.includes('estruct') || lower.includes('viga') || lower.includes('columna') || lower.includes('perfil') || lower.includes('grating') || lower.includes('escalera')) {
        return 'estructura';
    }
    if (lower.includes('radiograf') || lower.includes('end') || lower.includes('liquidos') || lower.includes('gammagraf') || lower.includes('rx')) {
        return 'end';
    }
    if (lower.includes('hidro') || lower.includes('presion') || lower.includes('estanqueidad') || lower.includes('barrido') || lower.includes('comision')) {
        return 'pruebas';
    }
    if (lower.includes('bomba') || lower.includes('compresor') || lower.includes('vasija') || lower.includes('tanque') || lower.includes('separador') || lower.includes('motor')) {
        return 'equipos';
    }
    return 'piping';
}

/**
 * Parsea contenido de texto plano copiado desde Excel (TSV), CSV o listas de presupuesto
 */
function parseBudgetText(rawText) {
    if (!rawText || !rawText.trim()) return [];

    const lines = rawText.trim().split(/\r?\n/);
    const parsedTasks = [];

    lines.forEach((line, index) => {
        const clean = line.trim();
        if (!clean || clean.startsWith('#') || clean.toLowerCase().startsWith('item') || clean.toLowerCase().startsWith('nombre')) {
            return; // Saltear cabeceras
        }

        // 1. Detección si es CSV / TSV (separado por tabuladores, punto y coma o coma)
        let parts = [];
        if (clean.includes('\t')) {
            parts = clean.split('\t');
        } else if (clean.includes(';')) {
            parts = clean.split(';');
        } else if (clean.includes('|')) {
            parts = clean.split('|');
        } else if (clean.includes(',')) {
            parts = clean.split(',');
        } else {
            // Línea simple de texto tipo lista de tareas
            parts = [clean];
        }

        parts = parts.map(p => p.trim());

        const name = parts[0] || `Tarea Importada #${index + 1}`;
        let durationDays = 3;
        let discipline = inferDiscipline(name);

        // Si hay una columna explícita de disciplina
        if (parts[1] && DISCIPLINES.some(d => d.id === parts[1].toLowerCase() || d.name.toLowerCase().includes(parts[1].toLowerCase()))) {
            const matched = DISCIPLINES.find(d => d.id === parts[1].toLowerCase() || d.name.toLowerCase().includes(parts[1].toLowerCase()));
            if (matched) discipline = matched.id;
        }

        // Si hay columna de duración
        for (let i = 1; i < parts.length; i++) {
            const numMatch = parts[i].match(/(\d+)\s*(d|dia|días|day|days)?/i);
            if (numMatch && parseInt(numMatch[1]) > 0 && parseInt(numMatch[1]) <= 60) {
                durationDays = parseInt(numMatch[1]);
                break;
            }
        }

        // Cuantificación estándar basada en disciplina y duración
        const labor = {
            supervisor: Math.round(durationDays * 4),
            canista: discipline === 'piping' ? durationDays * 16 : (discipline === 'soldadura' ? durationDays * 8 : 0),
            soldador: discipline === 'soldadura' ? durationDays * 16 : (discipline === 'piping' ? durationDays * 8 : 0),
            montador: discipline === 'estructura' ? durationDays * 16 : (discipline === 'equipos' ? durationDays * 12 : 0),
            ayudante: durationDays * 8
        };

        const machinery = {};
        if (discipline === 'equipos' || name.toLowerCase().includes('izaje') || name.toLowerCase().includes('pesado')) {
            machinery.grua_50t = durationDays * 6;
            machinery.hidrogrua = durationDays * 4;
        } else if (discipline === 'piping' || discipline === 'estructura') {
            machinery.hidrogrua = durationDays * 4;
            machinery.hidroelevador = durationDays * 4;
        }

        const equipment = {};
        if (discipline === 'soldadura') {
            equipment.motosoldadora = Math.min(2, Math.ceil(durationDays / 2));
            equipment.generador = 1;
        }
        if (discipline === 'pruebas') {
            equipment.bomba_hidro = 1;
            equipment.generador = 1;
        }

        parsedTasks.push({
            name,
            tag: `IMP-${100 + index}`,
            discipline,
            durationDays,
            notes: `Importado de presupuesto: "${name}"`,
            labor,
            machinery,
            equipment
        });
    });

    return parsedTasks;
}

/**
 * Parsea formato JSON directo de exportaciones
 */
function parseJSONBudget(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data)) {
            return data.map((item, idx) => ({
                name: item.name || `Tarea ${idx + 1}`,
                tag: item.tag || `IMP-${100 + idx}`,
                discipline: item.discipline || inferDiscipline(item.name || ''),
                durationDays: parseInt(item.durationDays) || 3,
                notes: item.notes || 'Importado vía JSON',
                labor: item.labor || {},
                machinery: item.machinery || {},
                equipment: item.equipment || {}
            }));
        }
        return [];
    } catch (e) {
        console.error('Error parseando JSON:', e);
        return [];
    }
}

/**
 * Retorna las plantillas predefinidas de la industria
 */
function getAvailablePresets() {
    return PRESET_IMPORT_TEMPLATES;
}


// ===== store.js =====
// ==========================================================================
// STORE: GESTIÓN DE ESTADO REACTIVO, PERSISTENCIA Y CÁLCULOS KPI
// ==========================================================================


const STORAGE_KEY = 'MONTAJE_PRO_STATE_V1';

class ProjectStore {
    constructor() {
        this.state = {
            projects: [],
            currentProjectId: null,
            currentTab: 'estimated', // 'estimated' | 'real' | 'comparativa'
            isSupervisionMode: false,
            timelineStartDate: '2026-09-01',
            timelineDaysCount: 21,
            filters: {
                search: '',
                discipline: 'all',
                status: 'all',
                showHeatmap: true
            },
            selectedTaskId: null
        };

        this.listeners = [];
        this.init();
    }

    init() {
        this.loadState();
        if (typeof window !== 'undefined') {
            this.syncFromUrl();
            window.addEventListener('hashchange', () => this.syncFromUrl());
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.saveState();
        this.syncToUrl();
        this.listeners.forEach(l => l(this.state));
    }

    // Persistencia LocalStorage
    saveState() {
        if (typeof localStorage === 'undefined') return;
        try {
            const dataToSave = {
                projects: this.state.projects,
                currentProjectId: this.state.currentProjectId
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (e) {
            console.error('Error al guardar estado en localStorage:', e);
        }
    }

    loadState() {
        if (typeof localStorage === 'undefined') {
            this.state.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
            this.state.currentProjectId = this.state.projects[0].id;
            return;
        }
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.projects && parsed.projects.length > 0) {
                    this.state.projects = parsed.projects;
                    this.state.currentProjectId = parsed.currentProjectId || parsed.projects[0].id;
                    return;
                }
            }
        } catch (e) {
            console.warn('Cargando proyectos por defecto tras error en localStorage:', e);
        }
        // Si no hay datos guardados, cargar los mock iniciales
        this.state.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
        this.state.currentProjectId = this.state.projects[0].id;
    }

    // Sincronización con Hash de la URL para compartir enlaces y modo supervisión
    syncFromUrl() {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash.replace('#', '');
        if (!hash) return;

        const params = new URLSearchParams(hash);
        let hasChanges = false;

        const urlObra = params.get('obra') || params.get('project');
        if (urlObra && this.state.projects.some(p => p.id === urlObra)) {
            if (this.state.currentProjectId !== urlObra) {
                this.state.currentProjectId = urlObra;
                hasChanges = true;
            }
        }

        const urlTab = params.get('tab');
        if (urlTab && ['estimated', 'real', 'comparativa'].includes(urlTab)) {
            if (this.state.currentTab !== urlTab) {
                this.state.currentTab = urlTab;
                hasChanges = true;
            }
        }

        const urlMode = params.get('mode');
        const isSupervision = urlMode === 'supervision' || urlMode === 'readonly';
        if (this.state.isSupervisionMode !== isSupervision) {
            this.state.isSupervisionMode = isSupervision;
            hasChanges = true;
        }

        if (hasChanges) {
            this.listeners.forEach(l => l(this.state));
        }
    }

    syncToUrl() {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams();
        if (this.state.currentProjectId) params.set('obra', this.state.currentProjectId);
        if (this.state.currentTab) params.set('tab', this.state.currentTab);
        if (this.state.isSupervisionMode) params.set('mode', 'supervision');

        const newHash = '#' + params.toString();
        if (window.location.hash !== newHash) {
            if (typeof history !== 'undefined' && history.replaceState) {
                history.replaceState(null, '', newHash);
            } else {
                window.location.hash = newHash;
            }
        }
    }

    // ======================================================================
    // GETTERS & CONSULTAS
    // ======================================================================

    getActiveProject() {
        return this.state.projects.find(p => p.id === this.state.currentProjectId) || this.state.projects[0];
    }

    getAllProjects() {
        return this.state.projects;
    }

    getTaskById(taskId) {
        const p = this.getActiveProject();
        if (!p) return null;
        return (p.tasks || []).find(t => t.id === taskId) || (p.backlog || []).find(t => t.id === taskId);
    }

    getConflicts() {
        const project = this.getActiveProject();
        if (!project) return { conflictsByDate: {}, taskConflicts: {}, dailyLoad: {}, totalConflictsCount: 0 };
        return analyzeResourceConflicts(project.tasks, project.resourceLimits, this.state.currentTab === 'real' ? 'real' : 'estimated');
    }

    // Cálculo exhaustivo de KPIs (HH, Costo, Avance Ponderado, EVM)
    getProjectKPIs() {
        const project = this.getActiveProject();
        if (!project) return null;

        const tasks = project.tasks || [];
        let totalEstimatedHH = 0;
        let totalRealHH = 0;
        let totalEstimatedCost = 0;
        let totalRealCost = 0;
        let weightedProgressAccum = 0;
        let earnedValueHH = 0;

        // Horas y Costos de maquinaria
        let totalEstimatedMachineryCost = 0;
        let totalRealMachineryCost = 0;

        tasks.forEach(t => {
            // HH Estimadas
            let taskEstHH = 0;
            if (t.labor) {
                Object.entries(t.labor).forEach(([resId, hh]) => {
                    const h = parseFloat(hh) || 0;
                    taskEstHH += h;
                    const meta = getResourceMeta(resId);
                    totalEstimatedCost += h * (meta.hourlyRate || 30);
                });
            }
            totalEstimatedHH += taskEstHH;

            // HH Reales
            let taskRealHH = 0;
            const laborToUse = (t.realLabor && Object.keys(t.realLabor).length > 0) ? t.realLabor : t.labor;
            if (laborToUse) {
                Object.entries(laborToUse).forEach(([resId, hh]) => {
                    const h = parseFloat(hh) || 0;
                    taskRealHH += h;
                    const meta = getResourceMeta(resId);
                    totalRealCost += h * (meta.hourlyRate || 30);
                });
            }
            totalRealHH += taskRealHH;

            // Costos Maquinaria
            if (t.machinery) {
                Object.entries(t.machinery).forEach(([mId, hrs]) => {
                    const h = parseFloat(hrs) || 0;
                    const meta = getResourceMeta(mId);
                    totalEstimatedMachineryCost += h * (meta.hourlyRate || 100);
                });
            }
            const machToUse = (t.realMachinery && Object.keys(t.realMachinery).length > 0) ? t.realMachinery : t.machinery;
            if (machToUse) {
                Object.entries(machToUse).forEach(([mId, hrs]) => {
                    const h = parseFloat(hrs) || 0;
                    const meta = getResourceMeta(mId);
                    totalRealMachineryCost += h * (meta.hourlyRate || 100);
                });
            }

            // Avance Ponderado por HH (o equitativo si HH = 0)
            const weight = taskEstHH > 0 ? taskEstHH : 40;
            weightedProgressAccum += (t.progress || 0) * weight;
            earnedValueHH += ((t.progress || 0) / 100) * weight;
        });

        const totalWeight = tasks.reduce((sum, t) => {
            const h = t.labor ? Object.values(t.labor).reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
            return sum + (h > 0 ? h : 40);
        }, 0);

        const globalProgress = totalWeight > 0 ? Math.round(weightedProgressAccum / totalWeight) : 0;
        const totalEstimatedProjectCost = totalEstimatedCost + totalEstimatedMachineryCost;
        const totalRealProjectCost = totalRealCost + totalRealMachineryCost;

        // Desviación en días (Comparativa)
        let totalDaysDeviation = 0;
        let delayedTasksCount = 0;

        tasks.forEach(t => {
            if (t.estimatedEnd && t.realEnd) {
                const est = new Date(t.estimatedEnd).getTime();
                const real = new Date(t.realEnd).getTime();
                const diffDays = Math.round((real - est) / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    totalDaysDeviation += diffDays;
                    delayedTasksCount++;
                }
            } else if (t.estimatedEnd && (t.progress < 100)) {
                // Si la fecha actual superó el estimado
                const est = new Date(t.estimatedEnd).getTime();
                const today = new Date('2026-09-08').getTime(); // Simulación de fecha actual de obra
                if (today > est) {
                    const overdue = Math.round((today - est) / (1000 * 60 * 60 * 24));
                    totalDaysDeviation += overdue;
                    delayedTasksCount++;
                }
            }
        });

        // Índice SPI (Earned Value / Planned Value)
        const plannedValueHH = totalEstimatedHH * 0.75; // 75% previsto al corte
        const spi = plannedValueHH > 0 ? (earnedValueHH / plannedValueHH).toFixed(2) : 1.00;

        // Conteo de conflictos activos
        const conflicts = this.getConflicts();

        // Monto contractual cotizado (Venta) vs Costo Proyectado
        const contractBudget = project.contractBudget || Math.round(totalEstimatedProjectCost * 1.28);
        const projectedGrossMargin = contractBudget - totalRealProjectCost;
        const projectedGrossMarginPct = contractBudget > 0 ? Math.round((projectedGrossMargin / contractBudget) * 100) : 0;

        return {
            totalEstimatedHH: Math.round(totalEstimatedHH),
            totalRealHH: Math.round(totalRealHH),
            hhDeviation: Math.round(totalRealHH - totalEstimatedHH),
            globalProgress,
            totalEstimatedCost: Math.round(totalEstimatedProjectCost),
            totalRealCost: Math.round(totalRealProjectCost),
            costDeviation: Math.round(totalRealProjectCost - totalEstimatedProjectCost),
            contractBudget: Math.round(contractBudget),
            projectedGrossMargin: Math.round(projectedGrossMargin),
            projectedGrossMarginPct,
            totalDaysDeviation,
            delayedTasksCount,
            spi: parseFloat(spi),
            activeConflicts: conflicts.totalConflictsCount,
            totalTasksCount: tasks.length + (project.backlog ? project.backlog.length : 0),
            backlogCount: project.backlog ? project.backlog.length : 0
        };
    }

    // ======================================================================
    // BALANCE CONSOLIDADO DE RECURSOS (COTIZADO VS CONSUMIDO EN TERRENO)
    // ======================================================================
    getResourceBalance() {
        const project = this.getActiveProject();
        if (!project) return { items: [], summary: {} };

        const allTasks = [...(project.tasks || []), ...(project.backlog || [])];
        const resourceMap = {};

        // Inicializar catálogo completo
        ['labor', 'machinery', 'equipment'].forEach(category => {
            RESOURCE_CATALOG[category].forEach(res => {
                resourceMap[res.id] = {
                    id: res.id,
                    name: res.name,
                    category,
                    unit: res.unit,
                    hourlyRate: res.hourlyRate || res.dailyRate || 25,
                    estimated: 0,
                    real: 0
                };
            });
        });

        // Acumular de las tareas
        allTasks.forEach(task => {
            // Mano de obra
            if (task.labor) {
                Object.entries(task.labor).forEach(([rId, qty]) => {
                    if (resourceMap[rId]) resourceMap[rId].estimated += parseFloat(qty) || 0;
                });
            }
            if (task.realLabor && Object.keys(task.realLabor).length > 0) {
                Object.entries(task.realLabor).forEach(([rId, qty]) => {
                    if (resourceMap[rId]) resourceMap[rId].real += parseFloat(qty) || 0;
                });
            } else if (task.progress > 0 && task.labor) {
                // Si tiene avance pero no desglose fino, computar proporcional
                Object.entries(task.labor).forEach(([rId, qty]) => {
                    if (resourceMap[rId]) resourceMap[rId].real += ((parseFloat(qty) || 0) * (task.progress / 100));
                });
            }

            // Maquinaria
            if (task.machinery) {
                Object.entries(task.machinery).forEach(([mId, qty]) => {
                    if (resourceMap[mId]) resourceMap[mId].estimated += parseFloat(qty) || 0;
                });
            }
            if (task.realMachinery && Object.keys(task.realMachinery).length > 0) {
                Object.entries(task.realMachinery).forEach(([mId, qty]) => {
                    if (resourceMap[mId]) resourceMap[mId].real += parseFloat(qty) || 0;
                });
            }

            // Equipamiento
            if (task.equipment) {
                Object.entries(task.equipment).forEach(([eId, qty]) => {
                    if (resourceMap[eId]) resourceMap[eId].estimated += parseFloat(qty) || 0;
                });
            }
        });

        const items = Object.values(resourceMap)
            .filter(item => item.estimated > 0 || item.real > 0)
            .map(item => {
                const est = Math.round(item.estimated);
                const real = Math.round(item.real);
                const delta = real - est; // Positivo = sobrecosto / exceso
                const balance = est - real; // Saldo remanente
                const costDelta = delta * item.hourlyRate;
                const percentUsed = est > 0 ? Math.round((real / est) * 100) : (real > 0 ? 100 : 0);

                return {
                    ...item,
                    estimated: est,
                    real,
                    delta,
                    balance,
                    costDelta,
                    percentUsed
                };
            });

        return { items };
    }

    // Crear una obra nueva completa desde cero
    createProject(projectData) {
        const id = 'OBRA-' + (projectData.code || ('NUEVA-' + Math.floor(1000 + Math.random() * 9000)));
        const newProject = {
            id,
            code: projectData.code || 'OBRA-NEW',
            name: projectData.name || 'Nueva Obra de Montaje',
            client: projectData.client || 'Cliente Principal',
            location: projectData.location || 'Frente de Obra',
            startDate: projectData.startDate || '2026-09-01',
            durationDays: parseInt(projectData.durationDays) || 30,
            currency: projectData.currency || 'USD',
            contractBudget: parseFloat(projectData.contractBudget) || 100000,
            resourceLimits: projectData.resourceLimits || {
                soldador: 4,
                canista: 6,
                montador: 5,
                ayudante: 8,
                supervisor: 2,
                grua_50t: 1,
                hidrogrua: 1,
                hidroelevador: 2,
                andamios: 200,
                generador: 2,
                motosoldadora: 3,
                bomba_hidro: 1
            },
            tasks: [],
            backlog: []
        };

        this.state.projects.push(newProject);
        this.state.currentProjectId = id;
        this.notify();
        return newProject;
    }

    // ======================================================================
    // ACCIONES Y MUTACIONES
    // ======================================================================

    switchProject(projectId) {
        if (this.state.projects.some(p => p.id === projectId)) {
            this.state.currentProjectId = projectId;
            this.notify();
        }
    }

    switchTab(tab) {
        if (['estimated', 'real', 'comparativa'].includes(tab)) {
            this.state.currentTab = tab;
            this.notify();
        }
    }

    toggleSupervisionMode() {
        this.state.isSupervisionMode = !this.state.isSupervisionMode;
        this.notify();
    }

    setFilters(partialFilters) {
        this.state.filters = { ...this.state.filters, ...partialFilters };
        this.notify();
    }

    // Drag & Drop: Mover tarea a un día específico del calendario
    scheduleTask(taskId, targetDate, currentTab = this.state.currentTab) {
        if (this.state.isSupervisionMode) return;
        const project = this.getActiveProject();
        if (!project) return;

        // Buscar en backlog o en tareas existentes
        let taskIndex = (project.backlog || []).findIndex(t => t.id === taskId);
        let task = null;

        if (taskIndex !== -1) {
            // Estaba en pendientes -> mover a tareas del cronograma
            task = project.backlog.splice(taskIndex, 1)[0];
            project.tasks.push(task);
        } else {
            task = project.tasks.find(t => t.id === taskId);
        }

        if (!task) return;

        const dur = Math.max(1, task.durationDays || 1);
        const newEndDate = calculateEndDate(targetDate, dur);

        if (currentTab === 'real') {
            task.realStart = targetDate;
            task.realEnd = newEndDate;
            if (task.status === 'pending') task.status = 'in_progress';
        } else {
            task.estimatedStart = targetDate;
            task.estimatedEnd = newEndDate;
            if (!task.realStart) {
                task.realStart = targetDate;
                task.realEnd = newEndDate;
            }
        }

        this.notify();
    }

    // Mover de vuelta a la bandeja de pendientes
    unassignTaskToBacklog(taskId) {
        if (this.state.isSupervisionMode) return;
        const project = this.getActiveProject();
        if (!project) return;

        const index = project.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const [task] = project.tasks.splice(index, 1);
            task.estimatedStart = null;
            task.estimatedEnd = null;
            task.realStart = null;
            task.realEnd = null;
            task.progress = 0;
            task.status = 'pending';
            if (!project.backlog) project.backlog = [];
            project.backlog.push(task);
            this.notify();
        }
    }

    // Actualizar tarea existente
    updateTask(taskId, updatedFields) {
        if (this.state.isSupervisionMode) return;
        const project = this.getActiveProject();
        if (!project) return;

        let task = project.tasks.find(t => t.id === taskId);
        if (!task && project.backlog) {
            task = project.backlog.find(t => t.id === taskId);
        }
        if (!task) return;

        Object.assign(task, updatedFields);

        // Recalcular fin si cambió duración o inicio
        if (updatedFields.durationDays || updatedFields.estimatedStart) {
            if (task.estimatedStart) {
                task.estimatedEnd = calculateEndDate(task.estimatedStart, task.durationDays);
            }
        }
        if (updatedFields.realStart || updatedFields.durationDays) {
            if (task.realStart && !task.realEnd) {
                task.realEnd = calculateEndDate(task.realStart, task.durationDays);
            }
        }

        // Actualizar estado automático según progreso
        if (task.progress >= 100) {
            task.status = 'completed';
        } else if (task.progress > 0 && task.status === 'pending') {
            task.status = 'in_progress';
        }

        this.notify();
    }

    // Crear nueva tarea manual
    createTask(taskData, addToBacklog = true) {
        if (this.state.isSupervisionMode) return;
        const project = this.getActiveProject();
        if (!project) return;

        const newId = 'TSK-' + Math.floor(100 + Math.random() * 900);
        const newTask = {
            id: newId,
            tag: taskData.tag || ('TSK-' + newId.split('-')[1]),
            name: taskData.name || 'Nueva Tarea de Montaje',
            discipline: taskData.discipline || 'piping',
            durationDays: parseInt(taskData.durationDays) || 3,
            estimatedStart: addToBacklog ? null : (taskData.estimatedStart || '2026-09-01'),
            estimatedEnd: addToBacklog ? null : calculateEndDate(taskData.estimatedStart || '2026-09-01', taskData.durationDays || 3),
            realStart: null,
            realEnd: null,
            progress: 0,
            status: 'pending',
            notes: taskData.notes || '',
            labor: taskData.labor || { supervisor: 8, canista: 16, soldador: 8, montador: 8, ayudante: 16 },
            machinery: taskData.machinery || {},
            equipment: taskData.equipment || {},
            realLabor: {},
            realMachinery: {}
        };

        if (addToBacklog) {
            if (!project.backlog) project.backlog = [];
            project.backlog.push(newTask);
        } else {
            project.tasks.push(newTask);
        }

        this.notify();
        return newTask;
    }

    // Eliminar tarea
    deleteTask(taskId) {
        if (this.state.isSupervisionMode) return;
        const project = this.getActiveProject();
        if (!project) return;

        project.tasks = project.tasks.filter(t => t.id !== taskId);
        if (project.backlog) {
            project.backlog = project.backlog.filter(t => t.id !== taskId);
        }
        this.notify();
    }

    // Importación masiva de tareas desde presupuestos externos
    importTasksBatch(newTasks, target = 'backlog') {
        if (this.state.isSupervisionMode) return;
        const project = this.getActiveProject();
        if (!project) return;

        newTasks.forEach(t => {
            this.createTask(t, target === 'backlog');
        });

        this.notify();
    }

    // Resetear a datos iniciales de fábrica
    resetToDefault() {
        localStorage.removeItem(STORAGE_KEY);
        this.state.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
        this.state.currentProjectId = this.state.projects[0].id;
        this.notify();
    }
}
const store = new ProjectStore();


// ===== timeline.js =====
// ==========================================================================
// TIMELINE: RENDERIZADO DE CRONOGRAMA GANTT, COMPARATIVA Y DRAG & DROP
// ==========================================================================
class TimelineRenderer {
    constructor(store, containerId, backlogContainerId) {
        this.store = store;
        this.container = document.getElementById(containerId);
        this.backlogContainer = document.getElementById(backlogContainerId);
        this.columnWidth = 90; // Ancho en px de cada columna diaria en desktop
        this.todayStr = '2026-09-08'; // Fecha simulada de corte de obra
        this.draggedTaskId = null;

        this.initEvents();
    }

    initEvents() {
        // Escuchar eventos globales de Drag & Drop para soltar en pendientes
        if (this.backlogContainer) {
            this.backlogContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.backlogContainer.classList.add('bg-slate-800/80', 'border-amber-500/50');
            });

            this.backlogContainer.addEventListener('dragleave', () => {
                this.backlogContainer.classList.remove('bg-slate-800/80', 'border-amber-500/50');
            });

            this.backlogContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                this.backlogContainer.classList.remove('bg-slate-800/80', 'border-amber-500/50');
                const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;
                if (taskId) {
                    this.store.unassignTaskToBacklog(taskId);
                }
            });
        }
    }

    /**
     * Formatea fecha YYYY-MM-DD a formato amigable: "Lun 01 Sep"
     */
    formatDateLabel(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const dayName = days[d.getDay()];
        const dayNum = String(d.getDate()).padStart(2, '0');
        const monthName = months[d.getMonth()];
        return { dayName, dayNum, monthName, full: `${dayName} ${dayNum} ${monthName}` };
    }

    /**
     * Render principal del Timeline y Backlog
     */
    render() {
        const project = this.store.getActiveProject();
        if (!project) return;

        const state = this.store.state;
        const conflicts = this.store.getConflicts();
        const currentTab = state.currentTab;

        // 1. Determinar rango de fechas del timeline (21 a 28 días desde project.startDate)
        const startDateStr = project.startDate || '2026-09-01';
        const timelineDays = project.durationDays || 28;
        const endDateStr = calculateEndDate(startDateStr, timelineDays);
        const calendarDates = getDatesRange(startDateStr, endDateStr);

        // 2. Renderizar la Bandeja de Pendientes
        this.renderBacklog(project.backlog || [], conflicts);

        // 3. Renderizar el Timeline Principal
        this.renderTimelineGrid(calendarDates, project.tasks || [], conflicts, currentTab);
    }

    /**
     * Renderiza las tarjetas en la bandeja de pendientes
     */
    renderBacklog(backlogTasks, conflicts) {
        if (!this.backlogContainer) return;

        const isSupervision = this.store.state.isSupervisionMode;
        const filtered = this.filterTasks(backlogTasks);

        if (filtered.length === 0) {
            this.backlogContainer.innerHTML = `
                <div class="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-700/60 rounded-xl my-2">
                    <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60"></i>
                    No hay tareas pendientes en la bandeja.
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        let html = '';
        filtered.forEach(task => {
            const discipline = DISCIPLINES.find(d => d.id === task.discipline) || DISCIPLINES[0];
            const totalHH = task.labor ? Object.values(task.labor).reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
            const hasHeavyMach = task.machinery && (task.machinery.grua_50t || task.machinery.hidrogrua);

            html += `
                <div class="backlog-card group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 rounded-xl p-3 shadow-md transition-all cursor-grab active:cursor-grabbing select-none"
                     draggable="${!isSupervision}"
                     data-task-id="${task.id}">
                    
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded ${discipline.badgeClass} border font-semibold">
                            ${task.tag || 'TSK'} • ${discipline.name.split(' ')[0]}
                        </span>
                        <div class="flex items-center gap-1.5 text-xs text-slate-400">
                            <span class="flex items-center gap-1 bg-slate-700/50 px-1.5 py-0.5 rounded text-[11px]">
                                <i data-lucide="clock" class="w-3 h-3 text-amber-400"></i> ${task.durationDays}d
                            </span>
                        </div>
                    </div>

                    <h4 class="text-xs font-semibold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        ${task.name}
                    </h4>

                    <div class="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                        <div class="flex items-center gap-2">
                            <span title="Total Horas-Hombre" class="flex items-center gap-1">
                                <i data-lucide="users" class="w-3 h-3 text-cyan-400"></i> ${totalHH} HH
                            </span>
                            ${hasHeavyMach ? `
                                <span title="Requiere Grúa / Izaje pesado" class="flex items-center gap-0.5 text-orange-400">
                                    <i data-lucide="truck" class="w-3 h-3"></i> Grúa
                                </span>
                            ` : ''}
                        </div>
                        
                        <div class="flex items-center gap-1">
                            <button class="btn-quick-schedule p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-amber-400" title="Programar en primer día libre" data-task-id="${task.id}">
                                <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i>
                            </button>
                            <button class="btn-edit-task p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white" title="Editar detalles" data-task-id="${task.id}">
                                <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>

                    ${!isSupervision ? `
                        <div class="mt-1.5 flex items-center gap-1 text-[10px] text-amber-400/70 font-medium">
                            <i data-lucide="move" class="w-3 h-3"></i> Arrastra hacia el calendario
                        </div>
                    ` : ''}
                </div>
            `;
        });

        this.backlogContainer.innerHTML = html;

        // Añadir listeners de arrastre
        this.backlogContainer.querySelectorAll('.backlog-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                const taskId = card.dataset.taskId;
                this.draggedTaskId = taskId;
                e.dataTransfer.setData('text/plain', taskId);
                e.dataTransfer.effectAllowed = 'move';
                card.classList.add('opacity-50', 'ring-2', 'ring-amber-500');
            });

            card.addEventListener('dragend', () => {
                this.draggedTaskId = null;
                card.classList.remove('opacity-50', 'ring-2', 'ring-amber-500');
            });
        });

        // Botones rápidos de programación y edición
        this.backlogContainer.querySelectorAll('.btn-quick-schedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                const project = this.store.getActiveProject();
                const startDate = project.startDate || '2026-09-01';
                this.store.scheduleTask(taskId, startDate);
            });
        });

        this.backlogContainer.querySelectorAll('.btn-edit-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                if (window.appModals) window.appModals.openTaskEditor(taskId);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Renderiza el cuerpo completo del cronograma Gantt y la cuadrícula de días
     */
    renderTimelineGrid(calendarDates, tasks, conflicts, currentTab) {
        if (!this.container) return;

        const isSupervision = this.store.state.isSupervisionMode;
        const filteredTasks = this.filterTasks(tasks);

        // 1. Cabecera horizontal de días
        let headerColsHtml = '';
        calendarDates.forEach((dateStr, idx) => {
            const { dayName, dayNum, monthName } = this.formatDateLabel(dateStr);
            const isToday = dateStr === this.todayStr;
            const hasConflict = conflicts.conflictsByDate && conflicts.conflictsByDate[dateStr] && conflicts.conflictsByDate[dateStr].length > 0;
            const conflictInfo = hasConflict ? conflicts.conflictsByDate[dateStr] : null;

            headerColsHtml += `
                <div class="timeline-day-header flex-shrink-0 flex flex-col items-center justify-between py-2 border-r border-slate-700/60 transition-colors ${isToday ? 'bg-amber-500/10 border-amber-500/40' : 'hover:bg-slate-800/40'}"
                     style="width: ${this.columnWidth}px;"
                     data-date="${dateStr}">
                    
                    <span class="text-[10px] uppercase font-bold tracking-wider ${isToday ? 'text-amber-400' : 'text-slate-400'}">
                        ${dayName}
                    </span>
                    
                    <div class="my-0.5 flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${isToday ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-200'}">
                        ${dayNum}
                    </div>

                    <span class="text-[9px] text-slate-400 font-medium">${monthName}</span>

                    ${hasConflict ? `
                        <button class="btn-inspect-conflict mt-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[9px] font-bold flex items-center gap-1 hover:bg-red-500 hover:text-white transition-all shadow-sm animate-pulse"
                                title="Sobreasignación de recursos en esta fecha. Clic para inspeccionar."
                                data-date="${dateStr}">
                            <i data-lucide="alert-triangle" class="w-2.5 h-2.5"></i> ${conflictInfo.length}
                        </button>
                    ` : `
                        <span class="text-[9px] text-transparent select-none mt-1">•</span>
                    `}
                </div>
            `;
        });

        // 2. Construcción de los carriles de tareas (Swimlanes)
        let lanesHtml = '';
        filteredTasks.forEach((task, index) => {
            const laneHtml = this.renderTaskLane(task, calendarDates, conflicts, currentTab, isSupervision, index);
            lanesHtml += laneHtml;
        });

        // 3. Fila de carga de recursos (Resource Workload Heatmap)
        let heatmapHtml = '';
        if (this.store.state.filters.showHeatmap) {
            heatmapHtml = this.renderResourceHeatmap(calendarDates, conflicts);
        }

        // Ensamblado final
        const totalTimelineWidth = calendarDates.length * this.columnWidth;

        this.container.innerHTML = `
            <div class="timeline-wrapper select-none overflow-x-auto overflow-y-visible custom-scrollbar relative pb-4" style="min-width: 100%;">
                
                <!-- Barra superior de calendario -->
                <div class="sticky top-0 z-20 flex bg-slate-900/95 backdrop-blur border-b border-slate-700/80 shadow-md" style="width: ${totalTimelineWidth}px;">
                    <!-- Espacio alineador izquierdo para información de tarea -->
                    <div class="w-72 flex-shrink-0 p-3 flex items-center justify-between border-r border-slate-700/80 bg-slate-900/95 sticky left-0 z-30 shadow-r">
                        <div class="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                            <i data-lucide="layers" class="w-4 h-4 text-amber-400"></i> Tareas de Montaje (${filteredTasks.length})
                        </div>
                        <span class="text-[10px] text-slate-400 font-mono">Día / Duración</span>
                    </div>
                    <!-- Columnas de días -->
                    <div class="flex">${headerColsHtml}</div>
                </div>

                <!-- Cuerpo de Carriles de Tareas -->
                <div class="relative divide-y divide-slate-800/80" style="width: ${totalTimelineWidth + 288}px;">
                    ${lanesHtml.length > 0 ? lanesHtml : `
                        <div class="p-12 text-center text-slate-400 text-sm">
                            <i data-lucide="clipboard-x" class="w-10 h-10 mx-auto mb-2 text-slate-500 opacity-60"></i>
                            No hay tareas programadas que coincidan con los filtros.
                        </div>
                    `}
                </div>

                <!-- Histograma / Heatmap de Recursos Diario -->
                ${heatmapHtml}

            </div>
        `;

        // 4. Activar Drag & Drop en las columnas de la cuadrícula
        this.attachDropZones();

        // 5. Botones de inspección de conflictos
        this.container.querySelectorAll('.btn-inspect-conflict').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const date = btn.dataset.date;
                if (window.appModals) window.appModals.openConflictInspector(date);
            });
        });

        // 6. Botones de edición y reporte rápido
        this.container.querySelectorAll('.btn-open-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                if (window.appModals) window.appModals.openTaskEditor(taskId);
            });
        });

        this.container.querySelectorAll('.btn-quick-progress').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                if (window.appModals) window.appModals.openDailyLog(taskId);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Renderiza el carril de una tarea con su barra o doble barra (en Comparativa)
     */
    renderTaskLane(task, calendarDates, conflicts, currentTab, isSupervision, rowIndex) {
        const discipline = DISCIPLINES.find(d => d.id === task.discipline) || DISCIPLINES[0];
        const taskConflictList = conflicts.taskConflicts ? conflicts.taskConflicts[task.id] : null;
        const hasConflict = taskConflictList && taskConflictList.length > 0;

        // Calcular posición en el timeline
        const startDayStr = currentTab === 'real' 
            ? (task.realStart || task.estimatedStart) 
            : task.estimatedStart;
        
        const endDayStr = currentTab === 'real'
            ? (task.realEnd || task.estimatedEnd)
            : task.estimatedEnd;

        const dur = Math.max(1, task.durationDays || 1);
        const startIndex = calendarDates.indexOf(startDayStr);

        // Si la tarea no tiene fecha en este rango
        const isPlaced = startIndex !== -1;
        const leftOffset = isPlaced ? (startIndex * this.columnWidth) : 0;
        const barWidth = Math.max(this.columnWidth * 0.9, dur * this.columnWidth);

        // Desviación en días para Pestaña Comparativa
        let deltaDays = 0;
        let deltaHH = 0;
        if (task.estimatedEnd && task.realEnd) {
            const estTime = new Date(task.estimatedEnd).getTime();
            const realTime = new Date(task.realEnd).getTime();
            deltaDays = Math.round((realTime - estTime) / (1000 * 60 * 60 * 24));
        }
        const estHH = task.labor ? Object.values(task.labor).reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
        const realHH = task.realLabor && Object.keys(task.realLabor).length > 0
            ? Object.values(task.realLabor).reduce((a, b) => a + (parseFloat(b) || 0), 0)
            : estHH;
        deltaHH = Math.round(realHH - estHH);

        // Código de color de estado
        let statusBadge = { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400', label: 'En fecha' };
        if (task.status === 'completed') {
            statusBadge = { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-400', label: 'Finalizada' };
        } else if (hasConflict || task.status === 'conflict') {
            statusBadge = { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400', label: 'Conflicto' };
        } else if (deltaDays > 0 || task.status === 'delayed') {
            statusBadge = { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-400', label: `+${deltaDays}d Atraso` };
        } else if (task.progress === 0) {
            statusBadge = { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', label: 'Pendiente' };
        }

        return `
            <div class="task-lane flex items-stretch hover:bg-slate-800/30 transition-colors relative group" data-task-id="${task.id}">
                
                <!-- Columna Izquierda Fija: Metadatos de la Tarea -->
                <div class="w-72 flex-shrink-0 p-3 border-r border-slate-700/80 bg-slate-900/90 sticky left-0 z-10 flex flex-col justify-between shadow-r backdrop-blur">
                    <div>
                        <div class="flex items-center justify-between gap-1 mb-1">
                            <span class="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${discipline.badgeClass} border">
                                ${task.tag || 'TSK'}
                            </span>
                            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge.bg}/20 ${statusBadge.text} border ${statusBadge.border}/30">
                                ${statusBadge.label}
                            </span>
                        </div>
                        <h4 class="text-xs font-semibold text-slate-100 hover:text-amber-400 cursor-pointer line-clamp-1 btn-open-task" data-task-id="${task.id}" title="${task.name}">
                            ${task.name}
                        </h4>
                    </div>

                    <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
                        <div class="flex items-center gap-2">
                            <span>${task.durationDays}d</span>
                            <span>•</span>
                            <span class="text-cyan-400 font-mono">${realHH} HH</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button class="btn-quick-progress p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded" title="Cargar avance rápido (Parte Diario)" data-task-id="${task.id}">
                                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                            </button>
                            <button class="btn-open-task p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded" title="Editar tarea" data-task-id="${task.id}">
                                <i data-lucide="settings-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Área de la Línea de Tiempo (Carril de Días) -->
                <div class="relative flex-grow flex items-center py-2 h-20">
                    
                    <!-- Columnas interactivas receptoras de Drag & Drop en el carril -->
                    <div class="absolute inset-0 flex">
                        ${calendarDates.map(d => `
                            <div class="timeline-grid-cell border-r border-slate-800/60 h-full transition-colors" 
                                 style="width: ${this.columnWidth}px;" 
                                 data-date="${d}"></div>
                        `).join('')}
                    </div>

                    ${isPlaced ? `
                        <!-- BARRA(S) DE TAREA INTERACTIVA(S) -->
                        <div class="timeline-bar-container absolute top-2 bottom-2 rounded-xl transition-all select-none"
                             style="left: ${leftOffset}px; width: ${barWidth}px;"
                             draggable="${!isSupervision}"
                             data-task-id="${task.id}">

                            ${currentTab === 'comparativa' ? `
                                <!-- MODO COMPARATIVA: DOBLE BARRA (Línea Base vs Real) -->
                                <div class="h-full flex flex-col justify-between p-1 bg-slate-900/90 border-2 ${hasConflict ? 'border-red-500 shadow-red-500/20' : 'border-slate-700'} rounded-xl shadow-lg relative overflow-hidden">
                                    
                                    <!-- Barra Superior: Estimado (Línea Base) -->
                                    <div class="h-[42%] bg-slate-700/60 rounded border border-dashed border-slate-500/50 flex items-center justify-between px-2 text-[10px] text-slate-300">
                                        <span class="flex items-center gap-1 font-mono font-bold text-slate-400">
                                            <i data-lucide="flag" class="w-2.5 h-2.5 text-blue-400"></i> Plan: ${task.durationDays}d
                                        </span>
                                        <span class="font-mono text-[9px] text-slate-400">${estHH} HH</span>
                                    </div>

                                    <!-- Barra Inferior: Real en Terreno -->
                                    <div class="h-[52%] relative bg-slate-800 rounded flex items-center overflow-hidden border border-slate-600/80">
                                        <!-- Progreso real llenado -->
                                        <div class="absolute inset-y-0 left-0 ${hasConflict ? 'bg-gradient-to-r from-red-600 to-rose-500' : (task.progress >= 100 ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gradient-to-r from-emerald-600 to-teal-500')} opacity-90 transition-all"
                                             style="width: ${task.progress || 0}%;"></div>
                                        
                                        <!-- Texto superpuesto -->
                                        <div class="relative z-10 w-full px-2 flex items-center justify-between text-[10px] font-bold text-white">
                                            <span>Real: ${task.progress || 0}%</span>
                                            <div class="flex items-center gap-1 font-mono text-[9px]">
                                                ${deltaDays !== 0 ? `
                                                    <span class="px-1 rounded ${deltaDays > 0 ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'}">
                                                        ${deltaDays > 0 ? `+${deltaDays}d` : `${deltaDays}d`}
                                                    </span>
                                                ` : ''}
                                                ${deltaHH !== 0 ? `
                                                    <span class="px-1 rounded ${deltaHH > 0 ? 'bg-red-900/80 text-red-200' : 'bg-emerald-900/80 text-emerald-200'}">
                                                        ${deltaHH > 0 ? `+${deltaHH} HH` : `${deltaHH} HH`}
                                                    </span>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ` : `
                                <!-- MODO NORMAL (ESTIMADO O REAL): TARJETA GANTT -->
                                <div class="h-full bg-slate-800/95 hover:bg-slate-800 border-2 ${hasConflict ? 'border-red-500 ring-2 ring-red-500/20' : (task.progress >= 100 ? 'border-blue-500/80' : 'border-slate-700/80')} rounded-xl p-2 shadow-lg flex flex-col justify-between relative overflow-hidden group/bar cursor-grab active:cursor-grabbing">
                                    
                                    <!-- Relleno de barra de progreso interna -->
                                    <div class="absolute inset-y-0 left-0 ${hasConflict ? 'bg-red-500/20' : (task.progress >= 100 ? 'bg-blue-500/20' : 'bg-emerald-500/20')} pointer-events-none transition-all"
                                         style="width: ${task.progress || 0}%;"></div>

                                    <!-- Cabecera de la tarjeta dentro de la barra -->
                                    <div class="relative z-10 flex items-center justify-between gap-2">
                                        <span class="text-[10px] font-bold text-slate-200 truncate">
                                            ${task.name}
                                        </span>
                                        <span class="text-[10px] font-mono font-extrabold ${task.progress >= 100 ? 'text-blue-400' : 'text-emerald-400'}">
                                            ${task.progress || 0}%
                                        </span>
                                    </div>

                                    <!-- Footer de la barra con recursos -->
                                    <div class="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                        <div class="flex items-center gap-1.5">
                                            <span class="flex items-center gap-0.5 text-cyan-300 font-mono">
                                                <i data-lucide="users" class="w-3 h-3"></i> ${realHH} HH
                                            </span>
                                            ${hasConflict ? `
                                                <span class="flex items-center gap-0.5 text-red-400 font-bold animate-pulse" title="Conflicto de recursos en esta fecha">
                                                    <i data-lucide="alert-circle" class="w-3 h-3"></i> Conflicto
                                                </span>
                                            ` : ''}
                                        </div>
                                        <span class="text-[9px] bg-slate-900/60 px-1 rounded border border-slate-700/50">
                                            ${task.durationDays} días
                                        </span>
                                    </div>

                                </div>
                            `}

                        </div>
                    ` : `
                        <div class="text-xs text-slate-500 italic pl-4">No asignada al calendario</div>
                    `}

                </div>

            </div>
        `;
    }

    /**
     * Renderiza el Heatmap / Histograma de recursos diario
     */
    renderResourceHeatmap(calendarDates, conflicts) {
        const daily = conflicts.dailyLoad || {};
        const limits = this.store.getActiveProject().resourceLimits || {};

        // Recursos clave para vigilar
        const keyResources = [
            { id: 'soldador', label: 'Soldadores 6G', icon: 'flame', color: 'orange' },
            { id: 'canista', label: 'Cañistas', icon: 'wrench', color: 'blue' },
            { id: 'montador', label: 'Montadores', icon: 'hammer', color: 'amber' },
            { id: 'grua_50t', label: 'Grúa 50T', icon: 'truck', color: 'purple' },
            { id: 'hidroelevador', label: 'Manlift 16m', icon: 'navigation', color: 'emerald' }
        ];

        let rowsHtml = '';
        keyResources.forEach(res => {
            const limit = limits[res.id] || 4;

            let cellsHtml = '';
            calendarDates.forEach(dateStr => {
                const dayUsage = (daily[dateStr] && daily[dateStr][res.id]) ? daily[dateStr][res.id].total : 0;
                const isOverloaded = dayUsage > limit;

                cellsHtml += `
                    <div class="flex-shrink-0 flex items-center justify-center border-r border-slate-800 py-1.5 text-xs font-mono transition-colors ${isOverloaded ? 'bg-red-500/20 text-red-300 font-black ring-1 ring-inset ring-red-500/50' : (dayUsage > 0 ? 'text-slate-300' : 'text-slate-600')}"
                         style="width: ${this.columnWidth}px;"
                         title="${res.label} el ${dateStr}: ${dayUsage} asignados (Capacidad máx: ${limit})">
                        ${dayUsage > 0 ? `${dayUsage}/${limit}` : '-'}
                    </div>
                `;
            });

            rowsHtml += `
                <div class="flex items-center border-b border-slate-800/80 hover:bg-slate-800/20 transition-colors">
                    <div class="w-72 flex-shrink-0 p-2.5 pl-3 border-r border-slate-700/80 bg-slate-900/95 sticky left-0 z-10 flex items-center justify-between text-xs text-slate-300 shadow-r">
                        <span class="flex items-center gap-1.5 font-medium">
                            <i data-lucide="${res.icon}" class="w-3.5 h-3.5 text-${res.color}-400"></i> ${res.label}
                        </span>
                        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Máx: ${limit}</span>
                    </div>
                    <div class="flex">${cellsHtml}</div>
                </div>
            `;
        });

        return `
            <div class="mt-6 pt-3 border-t-2 border-slate-700/80 bg-slate-900/80 rounded-xl overflow-hidden shadow-inner">
                <div class="p-3 bg-slate-900 flex items-center justify-between border-b border-slate-800">
                    <div class="flex items-center gap-2">
                        <i data-lucide="bar-chart-3" class="w-4 h-4 text-amber-400"></i>
                        <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Histograma de Carga y Capacidad Diaria de Recursos</h4>
                    </div>
                    <span class="text-[11px] text-slate-400">Valores en rojo indican sobreasignación / conflicto operativo</span>
                </div>
                ${rowsHtml}
            </div>
        `;
    }

    /**
     * Vincula listeners de Drag and Drop en las columnas de la cuadrícula
     */
    attachDropZones() {
        const isSupervision = this.store.state.isSupervisionMode;
        if (isSupervision) return;

        // Columnas receptoras de Drop en la cabecera y en todas las celdas de los carriles
        const dropTargets = this.container.querySelectorAll('.timeline-day-header, .timeline-grid-cell');
        dropTargets.forEach(col => {
            col.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                col.classList.add('bg-amber-500/20');
            });

            col.addEventListener('dragleave', () => {
                col.classList.remove('bg-amber-500/20');
            });

            col.addEventListener('drop', (e) => {
                e.preventDefault();
                col.classList.remove('bg-amber-500/20');
                const targetDate = col.dataset.date;
                const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;
                if (taskId && targetDate) {
                    this.store.scheduleTask(taskId, targetDate);
                }
            });
        });

        // Barras existentes en el timeline para arrastrar y cambiar fecha
        this.container.querySelectorAll('.timeline-bar-container').forEach(bar => {
            bar.addEventListener('dragstart', (e) => {
                const taskId = bar.dataset.taskId;
                this.draggedTaskId = taskId;
                e.dataTransfer.setData('text/plain', taskId);
                e.dataTransfer.effectAllowed = 'move';
                bar.classList.add('opacity-40');
            });

            bar.addEventListener('dragend', () => {
                this.draggedTaskId = null;
                bar.classList.remove('opacity-40');
            });
        });
    }

    /**
     * Aplica filtros de búsqueda, disciplina y estado
     */
    filterTasks(tasks) {
        const { search, discipline, status } = this.store.state.filters;
        return (tasks || []).filter(t => {
            if (search) {
                const s = search.toLowerCase();
                const matchesName = t.name.toLowerCase().includes(s);
                const matchesTag = (t.tag || '').toLowerCase().includes(s);
                if (!matchesName && !matchesTag) return false;
            }
            if (discipline && discipline !== 'all' && t.discipline !== discipline) {
                return false;
            }
            if (status && status !== 'all' && t.status !== status) {
                return false;
            }
            return true;
        });
    }
}


// ===== modals.js =====
// ==========================================================================
// MODALS: MODALES DE EDICIÓN, PARTE DIARIO, CONFLICTOS E IMPORTADOR
// ==========================================================================
class ModalManager {
    constructor(store) {
        this.store = store;
        this.activeModal = null;
        this.initDOM();
    }

    initDOM() {
        // Contenedor dinámico de modales
        let modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'modal-root';
            document.body.appendChild(modalRoot);
        }
        this.modalRoot = modalRoot;
    }

    closeModal() {
        this.modalRoot.innerHTML = '';
        this.activeModal = null;
        document.body.classList.remove('overflow-hidden');
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const colors = type === 'error' 
            ? 'bg-red-600 text-white border-red-400' 
            : (type === 'warning' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-emerald-400 border-emerald-500/50');
        
        toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl transition-all transform translate-y-0 opacity-100 ${colors} text-sm font-semibold`;
        toast.innerHTML = `
            <i data-lucide="${type === 'error' ? 'alert-octagon' : (type === 'warning' ? 'alert-triangle' : 'check-circle')}" class="w-4 h-4"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ======================================================================
    // 1. MODAL: EDITOR DE TAREA Y RECURSOS INDUSTRIALES
    // ======================================================================
    openTaskEditor(taskId) {
        const task = this.store.getTaskById(taskId);
        if (!task) return;

        const isSupervision = this.store.state.isSupervisionMode;
        const currentTab = this.store.state.currentTab;

        const labor = task.labor || {};
        const machinery = task.machinery || {};
        const equipment = task.equipment || {};

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <!-- Header -->
                    <div class="p-4 sm:p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                            <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                <i data-lucide="edit-3" class="w-5 h-5 text-amber-400"></i> ${task.tag ? `[${task.tag}] ` : ''}${task.name}
                            </h3>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Contenido con scroll -->
                    <form id="form-edit-task" class="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar flex-grow text-xs sm:text-sm">
                        
                        <!-- Datos Principales -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="sm:col-span-2">
                                <label class="block text-slate-300 font-semibold mb-1">Nombre de la Tarea</label>
                                <input type="text" name="name" value="${task.name}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" required ${isSupervision ? 'disabled' : ''}>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Tag / Código</label>
                                <input type="text" name="tag" value="${task.tag || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                            </div>
                        </div>

                        <!-- Disciplina y Fechas -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Disciplina</label>
                                <select name="discipline" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                                    ${DISCIPLINES.map(d => `<option value="${d.id}" ${d.id === task.discipline ? 'selected' : ''}>${d.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Duración (Días)</label>
                                <input type="number" name="durationDays" min="1" max="60" value="${task.durationDays || 3}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" required ${isSupervision ? 'disabled' : ''}>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Fecha Inicio (Estimada)</label>
                                <input type="date" name="estimatedStart" value="${task.estimatedStart || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                            </div>
                        </div>

                        <!-- Avance Real y Estado -->
                        <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-bold text-slate-200 flex items-center gap-1.5">
                                    <i data-lucide="percent" class="w-4 h-4 text-emerald-400"></i> Avance Físico de Obra
                                </label>
                                <span id="progress-display" class="font-mono font-extrabold text-base text-emerald-400">${task.progress || 0}%</span>
                            </div>
                            <input type="range" id="progress-slider" name="progress" min="0" max="100" step="5" value="${task.progress || 0}" class="w-full accent-emerald-500 cursor-pointer" ${isSupervision ? 'disabled' : ''}>
                            <div class="flex justify-between gap-1 mt-2">
                                <button type="button" class="btn-quick-pct px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300" data-pct="0">0%</button>
                                <button type="button" class="btn-quick-pct px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300" data-pct="25">25%</button>
                                <button type="button" class="btn-quick-pct px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300" data-pct="50">50%</button>
                                <button type="button" class="btn-quick-pct px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300" data-pct="75">75%</button>
                                <button type="button" class="btn-quick-pct px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300" data-pct="100">100%</button>
                            </div>
                        </div>

                        <!-- Recursos: Mano de Obra (Horas-Hombre) -->
                        <div>
                            <h4 class="font-bold text-slate-200 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                                <i data-lucide="users" class="w-4 h-4"></i> Mano de Obra (Horas-Hombre totales)
                            </h4>
                            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                ${RESOURCE_CATALOG.labor.map(res => `
                                    <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                                        <label class="block text-[11px] text-slate-400 truncate" title="${res.name}">${res.name.split(' ')[0]}</label>
                                        <input type="number" min="0" step="4" name="labor_${res.id}" value="${labor[res.id] || 0}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 mt-1 text-white font-mono text-center focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Recursos: Maquinaria y Equipos Pesados -->
                        <div>
                            <h4 class="font-bold text-slate-200 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-orange-400">
                                <i data-lucide="truck" class="w-4 h-4"></i> Maquinaria Pesada (Horas de uso)
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                ${RESOURCE_CATALOG.machinery.map(res => `
                                    <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                                        <label class="block text-[11px] text-slate-400 truncate" title="${res.name}">${res.name}</label>
                                        <input type="number" min="0" step="2" name="machinery_${res.id}" value="${machinery[res.id] || 0}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 mt-1 text-white font-mono text-center focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Observaciones / Bitácora de Campo -->
                        <div>
                            <label class="block text-slate-300 font-semibold mb-1">Notas Técnicas / Observaciones de Montaje</label>
                            <textarea name="notes" rows="2" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" placeholder="Condiciones climáticas, torqueado, interferencias..." ${isSupervision ? 'disabled' : ''}>${task.notes || ''}</textarea>
                        </div>

                    </form>

                    <!-- Footer con acciones -->
                    <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between gap-2">
                        <div>
                            ${!isSupervision ? `
                                <button type="button" id="btn-delete-task" class="px-3 py-2 text-xs font-semibold rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors flex items-center gap-1">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Eliminar
                                </button>
                            ` : ''}
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-close-modal px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                                Cancelar
                            </button>
                            ${!isSupervision ? `
                                <button type="button" id="btn-save-task" class="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5">
                                    <i data-lucide="save" class="w-4 h-4"></i> Guardar Cambios
                                </button>
                            ` : ''}
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;
        document.body.classList.add('overflow-hidden');

        // Handlers
        const slider = document.getElementById('progress-slider');
        const display = document.getElementById('progress-display');
        slider.addEventListener('input', (e) => {
            display.textContent = `${e.target.value}%`;
        });

        this.modalRoot.querySelectorAll('.btn-quick-pct').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.pct;
                slider.value = val;
                display.textContent = `${val}%`;
            });
        });

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        const saveBtn = document.getElementById('btn-save-task');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const form = document.getElementById('form-edit-task');
                const formData = new FormData(form);

                const laborUpdates = {};
                RESOURCE_CATALOG.labor.forEach(r => {
                    laborUpdates[r.id] = parseFloat(formData.get(`labor_${r.id}`)) || 0;
                });

                const machUpdates = {};
                RESOURCE_CATALOG.machinery.forEach(r => {
                    machUpdates[r.id] = parseFloat(formData.get(`machinery_${r.id}`)) || 0;
                });

                const updated = {
                    name: formData.get('name'),
                    tag: formData.get('tag'),
                    discipline: formData.get('discipline'),
                    durationDays: parseInt(formData.get('durationDays')) || 3,
                    estimatedStart: formData.get('estimatedStart') || null,
                    progress: parseInt(formData.get('progress')) || 0,
                    notes: formData.get('notes') || '',
                    labor: laborUpdates,
                    machinery: machUpdates
                };

                this.store.updateTask(taskId, updated);
                this.showToast('Tarea de montaje actualizada con éxito');
                this.closeModal();
            });
        }

        const deleteBtn = document.getElementById('btn-delete-task');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de eliminar esta tarea de la obra?')) {
                    this.store.deleteTask(taskId);
                    this.showToast('Tarea eliminada', 'warning');
                    this.closeModal();
                }
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 2. MODAL: PARTE DIARIO DE CAMPO (CAPATACES / TERRENO) - DINÁMICO & EXACTO
    // ======================================================================
    openDailyLog(taskId) {
        const task = this.store.getTaskById(taskId);
        if (!task) return;

        const currentLabor = task.realLabor || {};
        const currentMachinery = task.realMachinery || {};

        // Identificar recursos relevantes para esta tarea
        const activeLabor = RESOURCE_CATALOG.labor.filter(res => {
            return (task.labor && task.labor[res.id] > 0) || (currentLabor[res.id] > 0);
        });
        const laborToShow = activeLabor.length > 0 ? activeLabor : RESOURCE_CATALOG.labor;

        const activeMachinery = RESOURCE_CATALOG.machinery.filter(res => {
            return (task.machinery && task.machinery[res.id] > 0) || (currentMachinery[res.id] > 0);
        });

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <div class="p-4 bg-gradient-to-r from-emerald-600/30 to-teal-600/20 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="clipboard-check" class="w-5 h-5 text-emerald-400"></i>
                            <div>
                                <h3 class="text-sm font-bold text-white">Parte Diario de Terreno</h3>
                                <p class="text-[11px] text-slate-400 truncate max-w-[280px]">${task.tag ? `[${task.tag}] ` : ''}${task.name}</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-4 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-grow">
                        
                        <!-- Avance Rápido -->
                        <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-bold text-slate-200">Avance Físico Actual:</span>
                                <span id="quick-pct-label" class="font-mono font-bold text-emerald-400 text-sm">${task.progress || 0}%</span>
                            </div>
                            <div class="grid grid-cols-4 gap-1.5">
                                <button type="button" class="btn-add-pct py-2 bg-slate-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors" data-add="10">+10%</button>
                                <button type="button" class="btn-add-pct py-2 bg-slate-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors" data-add="25">+25%</button>
                                <button type="button" class="btn-add-pct py-2 bg-slate-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors" data-add="50">+50%</button>
                                <button type="button" class="btn-set-100 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors">100% ✔</button>
                            </div>
                        </div>

                        <!-- Cargar Horas-Hombre de Jornada -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="font-bold text-slate-300 flex items-center gap-1">
                                    <i data-lucide="users" class="w-3.5 h-3.5 text-cyan-400"></i> Horas-Hombre Trabajadas Hoy
                                </label>
                                <span class="text-[10px] text-slate-400">Se suman al acumulado real</span>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                ${laborToShow.map(res => {
                                    const accum = currentLabor[res.id] || 0;
                                    const est = (task.labor && task.labor[res.id]) || 0;
                                    return `
                                        <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                                            <div class="flex items-center justify-between text-[10px] mb-1">
                                                <span class="text-slate-300 font-semibold truncate" title="${res.name}">${res.name.split(' ')[0]}</span>
                                                <span class="text-slate-500 font-mono">${accum}/${est}h</span>
                                            </div>
                                            <input type="number" min="0" step="1" id="daily-hh-${res.id}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-emerald-500 focus:outline-none" placeholder="+0 HH">
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Cargar Maquinaria Pesada si aplica -->
                        ${activeMachinery.length > 0 ? `
                            <div>
                                <label class="block font-bold text-slate-300 mb-1.5 flex items-center gap-1 text-orange-400">
                                    <i data-lucide="truck" class="w-3.5 h-3.5"></i> Horas de Equipos Pesados Hoy
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    ${activeMachinery.map(res => {
                                        const accum = currentMachinery[res.id] || 0;
                                        return `
                                            <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                                                <span class="text-[11px] text-slate-300 truncate" title="${res.name}">${res.name.split('(')[0]}</span>
                                                <input type="number" min="0" step="1" id="daily-mach-${res.id}" class="w-20 bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-orange-500 focus:outline-none" placeholder="+0 hs">
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Novedades de Campo -->
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Novedad / Observaciones de Jornada</label>
                            <input type="text" id="daily-note" placeholder="Ej: Soldadura de 4 juntas completadas con éxito; viento normal" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-emerald-500 text-xs">
                        </div>

                    </div>

                    <div class="p-3 bg-slate-800/80 border-t border-slate-700 flex justify-end gap-2">
                        <button type="button" class="btn-close-modal px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-xs font-semibold">Cerrar</button>
                        <button type="button" id="btn-submit-daily" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20">
                            <i data-lucide="check" class="w-4 h-4"></i> Registrar Parte Diario
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;
        let currentProgress = task.progress || 0;

        this.modalRoot.querySelectorAll('.btn-add-pct').forEach(b => {
            b.addEventListener('click', () => {
                const add = parseInt(b.dataset.add);
                currentProgress = Math.min(100, currentProgress + add);
                document.getElementById('quick-pct-label').textContent = `${currentProgress}%`;
            });
        });

        const btn100 = this.modalRoot.querySelector('.btn-set-100');
        if (btn100) {
            btn100.addEventListener('click', () => {
                currentProgress = 100;
                document.getElementById('quick-pct-label').textContent = '100%';
            });
        }

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const submitBtn = document.getElementById('btn-submit-daily');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const note = document.getElementById('daily-note').value;
                
                // Actualizar mano de obra acumulando únicamente lo reportado hoy
                const updatedLabor = { ...(task.realLabor || {}) };
                laborToShow.forEach(res => {
                    const input = document.getElementById(`daily-hh-${res.id}`);
                    const val = input ? parseFloat(input.value) : 0;
                    if (val > 0) {
                        updatedLabor[res.id] = (updatedLabor[res.id] || 0) + val;
                    }
                });

                // Actualizar maquinaria acumulando hoy
                const updatedMach = { ...(task.realMachinery || {}) };
                activeMachinery.forEach(res => {
                    const input = document.getElementById(`daily-mach-${res.id}`);
                    const val = input ? parseFloat(input.value) : 0;
                    if (val > 0) {
                        updatedMach[res.id] = (updatedMach[res.id] || 0) + val;
                    }
                });

                const todayStr = '2026-09-08';
                const fullNotes = task.notes 
                    ? `${task.notes}\n[${todayStr} Parte Diario]: ${note || 'Avance reportado'}` 
                    : `[${todayStr} Parte Diario]: ${note || 'Avance reportado'}`;

                const updates = {
                    progress: currentProgress,
                    realLabor: updatedLabor,
                    realMachinery: updatedMach,
                    notes: fullNotes,
                    status: currentProgress >= 100 ? 'completed' : 'in_progress'
                };

                if (!task.realStart) {
                    updates.realStart = task.estimatedStart || todayStr;
                }
                if (currentProgress >= 100 && !task.realEnd) {
                    updates.realEnd = todayStr;
                }

                this.store.updateTask(taskId, updates);
                this.showToast(`Parte diario asentado: Avance al ${currentProgress}%`);
                this.closeModal();
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 3. MODAL: INSPECTOR DE CONFLICTOS DE RECURSOS
    // ======================================================================
    openConflictInspector(dateStr) {
        const conflicts = this.store.getConflicts();
        const dateConflicts = (conflicts.conflictsByDate && conflicts.conflictsByDate[dateStr]) || [];

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
                <div class="bg-slate-900 border border-red-500/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                    
                    <div class="p-4 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="alert-triangle" class="w-5 h-5 text-red-400"></i>
                            <div>
                                <h3 class="text-sm font-bold text-white">Alerta de Sobreasignación de Recursos</h3>
                                <p class="text-[11px] text-red-300 font-mono">Fecha: ${dateStr}</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar text-xs">
                        ${dateConflicts.map(c => {
                            const taskNames = c.taskIds.map(id => {
                                const t = this.store.getTaskById(id);
                                return t ? `<li class="text-slate-300 font-medium py-1 flex items-center justify-between">
                                    <span>• ${t.name}</span>
                                    <button class="btn-shift-task px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px]" data-task-id="${t.id}" data-current-date="${dateStr}">
                                        Desplazar +1 día
                                    </button>
                                </li>` : '';
                            }).join('');

                            return `
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-red-500/40">
                                    <div class="flex items-center justify-between font-bold text-red-400 mb-1">
                                        <span class="flex items-center gap-1"><i data-lucide="flame" class="w-4 h-4"></i> ${c.resourceName}</span>
                                        <span class="font-mono bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-800">
                                            Asignado: ${c.required} / Capacidad: ${c.limit} ${c.unit}
                                        </span>
                                    </div>
                                    <p class="text-[11px] text-slate-400 mt-1 mb-2">Exceso de ${c.excess} ${c.unit}. Tareas en conflicto simultáneo:</p>
                                    <ul class="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                                        ${taskNames}
                                    </ul>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="p-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
                        <button class="btn-close-modal px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs">
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        this.modalRoot.querySelectorAll('.btn-shift-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.dataset.taskId;
                const task = this.store.getTaskById(taskId);
                if (task && task.estimatedStart) {
                    const curr = new Date(task.estimatedStart + 'T00:00:00');
                    curr.setDate(curr.getDate() + 1);
                    const newStart = curr.toISOString().split('T')[0];
                    this.store.scheduleTask(taskId, newStart);
                    this.showToast(`Tarea ${task.name} reprogramada para ${newStart}`);
                    this.closeModal();
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 4. MODAL: IMPORTADOR DE PRESUPUESTOS Y LISTAS DE TAREAS
    // ======================================================================
    openImportModal() {
        const presets = getAvailablePresets();

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="file-up" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <h3 class="text-base font-bold text-white">Importar Presupuesto o Lista de Tareas</h3>
                                <p class="text-xs text-slate-400">Genera automáticamente tarjetas de montaje y recursos</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-grow text-xs">
                        
                        <!-- Plantillas Rápidas -->
                        <div>
                            <label class="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2 text-amber-400">
                                1. Cargar Plantillas Estándar de la Industria (1 Clic)
                            </label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${presets.map((preset, idx) => `
                                    <div class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 p-3 rounded-xl transition-all cursor-pointer btn-load-preset" data-preset-index="${idx}">
                                        <h5 class="font-bold text-slate-100 flex items-center justify-between">
                                            <span>${preset.name}</span>
                                            <span class="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">${preset.tasks.length} tareas</span>
                                        </h5>
                                        <p class="text-slate-400 text-[11px] mt-1">${preset.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Carga o Pegado de Texto -->
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-cyan-400">
                                    2. O Pegar Presupuesto (Texto de Excel / CSV / JSON)
                                </label>
                                <span class="text-[10px] text-slate-400">Formatos: CSV, TSV, JSON</span>
                            </div>
                            <textarea id="import-raw-input" rows="6" placeholder="Pega aquí líneas desde Excel o formato CSV, por ejemplo:
Montaje de Cañería 6'' Sch 40	Piping	4 días
Soldadura de Juntas en Rack	Soldadura	5 días
Izaje de Aeroenfriador 30 Ton	Equipos	3 días" class="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500"></textarea>
                        </div>

                        <div class="flex items-center justify-between pt-2">
                            <label class="flex items-center gap-2 text-slate-300">
                                <input type="checkbox" id="import-to-backlog" checked class="rounded accent-amber-500 w-4 h-4">
                                <span>Agregar tareas directamente a la <strong>Bandeja de Pendientes</strong></span>
                            </label>
                            <button id="btn-parse-preview" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
                                Previsualizar
                            </button>
                        </div>

                        <div id="import-preview-area" class="hidden bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-slate-300 mb-2">Tareas detectadas para importar:</h5>
                            <div id="preview-list" class="space-y-1.5 max-h-40 overflow-y-auto"></div>
                        </div>

                    </div>

                    <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-2">
                        <button class="btn-close-modal px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-semibold">Cancelar</button>
                        <button id="btn-execute-import" class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                            <i data-lucide="check" class="w-4 h-4"></i> Importar al Proyecto
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        // Cargar preset rápido al hacer clic
        this.modalRoot.querySelectorAll('.btn-load-preset').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.presetIndex);
                const preset = presets[idx];
                const rawInput = document.getElementById('import-raw-input');
                rawInput.value = preset.tasks.map(t => `${t.name}\t${t.discipline}\t${t.durationDays} días`).join('\n');
                document.getElementById('btn-parse-preview').click();
            });
        });

        // Previsualizar
        let parsedTasksCache = [];
        const btnPreview = document.getElementById('btn-parse-preview');
        btnPreview.addEventListener('click', () => {
            const raw = document.getElementById('import-raw-input').value;
            if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
                parsedTasksCache = parseJSONBudget(raw);
            } else {
                parsedTasksCache = parseBudgetText(raw);
            }

            const previewArea = document.getElementById('import-preview-area');
            const previewList = document.getElementById('preview-list');

            if (parsedTasksCache.length > 0) {
                previewArea.classList.remove('hidden');
                previewList.innerHTML = parsedTasksCache.map(t => `
                    <div class="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <span class="font-semibold text-slate-200 truncate">• ${t.name}</span>
                        <div class="flex items-center gap-2 font-mono text-slate-400">
                            <span class="text-amber-400">${t.discipline}</span>
                            <span>${t.durationDays}d</span>
                        </div>
                    </div>
                `).join('');
            } else {
                previewArea.classList.remove('hidden');
                previewList.innerHTML = '<p class="text-red-400">No se pudieron reconocer tareas válidas en el texto.</p>';
            }
        });

        // Ejecutar importación
        document.getElementById('btn-execute-import').addEventListener('click', () => {
            if (parsedTasksCache.length === 0) {
                btnPreview.click();
            }
            if (parsedTasksCache.length === 0) {
                this.showToast('No hay tareas para importar', 'error');
                return;
            }

            const toBacklog = document.getElementById('import-to-backlog').checked;
            this.store.importTasksBatch(parsedTasksCache, toBacklog ? 'backlog' : 'timeline');
            this.showToast(`Se importaron ${parsedTasksCache.length} tareas al proyecto con éxito`);
            this.closeModal();
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 5. MODAL: COMPARTIR ENLACE DE ACCESO DIRECTO
    // ======================================================================
    openShareModal() {
        const p = this.store.getActiveProject();
        const tab = this.store.state.currentTab;
        const baseHref = window.location.href.split('#')[0];
        
        const fullEditUrl = `${baseHref}#obra=${p.id}&tab=${tab}`;
        const supervisionUrl = `${baseHref}#obra=${p.id}&tab=${tab}&mode=supervision`;

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
                <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="share-2" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <h3 class="text-base font-bold text-white">Compartir Acceso a la Obra</h3>
                                <p class="text-xs text-slate-400">${p.name}</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-5 space-y-4 text-xs">
                        
                        <!-- Enlace Modo Supervisión / Lectura -->
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-cyan-500/40">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="font-bold text-cyan-400 flex items-center gap-1">
                                    <i data-lucide="shield-check" class="w-4 h-4"></i> Enlace de Supervisión / Terreno (Sin Datos Económicos)
                                </span>
                                <span class="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">Solo Lectura • Oculta Costos</span>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-1 mb-2">Ideal para clientes, inspectores y capataces en obra. Oculta automáticamente presupuestos en USD, tarifas y costos internos.</p>
                            <div class="flex items-center gap-2 mt-2">
                                <input type="text" readonly value="${supervisionUrl}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono text-[11px]">
                                <button class="btn-copy-url px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold whitespace-nowrap" data-url="${supervisionUrl}">
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <!-- Enlace Modo Edición / Planificación -->
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="font-bold text-slate-300 flex items-center gap-1">
                                    <i data-lucide="edit-3" class="w-4 h-4"></i> Enlace Completo de Planificación (Con Edición)
                                </span>
                            </div>
                            <div class="flex items-center gap-2 mt-2">
                                <input type="text" readonly value="${fullEditUrl}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono text-[11px]">
                                <button class="btn-copy-url px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold whitespace-nowrap" data-url="${fullEditUrl}">
                                    Copiar
                                </button>
                            </div>
                        </div>

                    </div>

                    <div class="p-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
                        <button class="btn-close-modal px-4 py-2 rounded-xl bg-slate-700 text-slate-200 text-xs font-semibold">Cerrar</button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        this.modalRoot.querySelectorAll('.btn-copy-url').forEach(b => {
            b.addEventListener('click', () => {
                const url = b.dataset.url;
                navigator.clipboard.writeText(url).then(() => {
                    this.showToast('Enlace copiado al portapapeles');
                }).catch(() => {
                    this.showToast('URL copiada', 'success');
                });
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 6. MODAL: CREAR OBRA NUEVA DESDE CERO
    // ======================================================================
    openCreateProjectModal() {
        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="folder-plus" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <h3 class="text-base font-bold text-white">Alta de Nueva Obra / Proyecto de Montaje</h3>
                                <p class="text-xs text-slate-400">Configura los parámetros contractuales y límites de recursos</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form id="form-create-project" class="p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-grow">
                        
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="sm:col-span-2">
                                <label class="block font-semibold text-slate-300 mb-1">Nombre de la Obra</label>
                                <input type="text" name="name" placeholder="Ej: Montaje Skid Separador de Gas Batería 3" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Código / ID Obra</label>
                                <input type="text" name="code" placeholder="Ej: SKID-2026-03" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Cliente / Comitente</label>
                                <input type="text" name="client" placeholder="Ej: Pan American Energy / YPF" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Ubicación / Yacimiento</label>
                                <input type="text" name="location" placeholder="Ej: Cuenca del Golfo San Jorge" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Fecha de Inicio Contractual</label>
                                <input type="date" name="startDate" value="2026-09-15" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Plazo Total (Días corridos)</label>
                                <input type="number" name="durationDays" min="7" max="180" value="30" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Presupuesto Cotizado ($ USD)</label>
                                <input type="number" name="contractBudget" min="1000" step="5000" value="125000" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-amber-400">
                            </div>
                        </div>

                        <!-- Límites de Cuadrillas Máximas Diarias para Conflictos -->
                        <div class="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                            <h5 class="font-bold text-slate-200 mb-2 flex items-center gap-1.5 text-cyan-400">
                                <i data-lucide="shield-alert" class="w-4 h-4"></i> Capacidad Máxima Disponible Diaria (Control de Sobreasignación)
                            </h5>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                                    <span class="text-[10px] text-slate-400 block">Soldadores 6G</span>
                                    <input type="number" name="limit_soldador" value="4" min="1" class="w-full bg-slate-800 rounded p-1 text-white font-mono text-center mt-1">
                                </div>
                                <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                                    <span class="text-[10px] text-slate-400 block">Cañistas</span>
                                    <input type="number" name="limit_canista" value="6" min="1" class="w-full bg-slate-800 rounded p-1 text-white font-mono text-center mt-1">
                                </div>
                                <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                                    <span class="text-[10px] text-slate-400 block">Montadores</span>
                                    <input type="number" name="limit_montador" value="5" min="1" class="w-full bg-slate-800 rounded p-1 text-white font-mono text-center mt-1">
                                </div>
                                <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-center">
                                    <span class="text-[10px] text-slate-400 block">Grúas 50T</span>
                                    <input type="number" name="limit_grua_50t" value="1" min="1" class="w-full bg-slate-800 rounded p-1 text-white font-mono text-center mt-1">
                                </div>
                            </div>
                        </div>

                    </form>

                    <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-2">
                        <button type="button" class="btn-close-modal px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-semibold">Cancelar</button>
                        <button type="button" id="btn-submit-create-project" class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i> Crear Obra y Empezar
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const submitBtn = document.getElementById('btn-submit-create-project');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const form = document.getElementById('form-create-project');
                const formData = new FormData(form);

                const newProjData = {
                    name: formData.get('name'),
                    code: formData.get('code'),
                    client: formData.get('client'),
                    location: formData.get('location'),
                    startDate: formData.get('startDate'),
                    durationDays: parseInt(formData.get('durationDays')) || 30,
                    contractBudget: parseFloat(formData.get('contractBudget')) || 100000,
                    resourceLimits: {
                        soldador: parseInt(formData.get('limit_soldador')) || 4,
                        canista: parseInt(formData.get('limit_canista')) || 6,
                        montador: parseInt(formData.get('limit_montador')) || 5,
                        ayudante: 8,
                        supervisor: 2,
                        grua_50t: parseInt(formData.get('limit_grua_50t')) || 1,
                        hidrogrua: 1,
                        hidroelevador: 2,
                        andamios: 200,
                        generador: 2,
                        motosoldadora: 3,
                        bomba_hidro: 1
                    }
                };

                const created = this.store.createProject(newProjData);
                this.showToast(`Obra ${created.name} creada exitosamente`);
                this.closeModal();

                // Actualizar selector del header
                const selector = document.getElementById('project-select');
                if (selector) {
                    selector.innerHTML = this.store.getAllProjects().map(p => `
                        <option value="${p.id}">${p.code ? `[${p.code}] ` : ''}${p.name}</option>
                    `).join('');
                    selector.value = created.id;
                }
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 7. MODAL: BALANCE CONSOLIDADO DE RECURSOS (COTIZADO VS REAL CONSUMIDO)
    // ======================================================================
    openResourceBalanceModal() {
        const isSupervision = this.store.state.isSupervisionMode;
        const balanceData = this.store.getResourceBalance();
        const kpis = this.store.getProjectKPIs();
        const project = this.store.getActiveProject();

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="scale" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <h3 class="text-base font-bold text-white">Balance Consolidado de Recursos Cotizados vs. Terreno</h3>
                                <p class="text-xs text-slate-400">${project.name} • ${project.client || ''} ${isSupervision ? '(Vista Operativa)' : ''}</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-grow text-xs">
                        
                        <!-- Tarjetas Resumen (Condicional según Modo Supervisión) -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            ${!isSupervision ? `
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <span class="text-[10px] text-slate-400 block mb-1">Monto Cotizado (Venta)</span>
                                    <span class="font-mono font-extrabold text-base text-amber-400">$${kpis.contractBudget.toLocaleString()} USD</span>
                                </div>
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <span class="text-[10px] text-slate-400 block mb-1">Costo Real Proyectado</span>
                                    <span class="font-mono font-extrabold text-base text-white">$${kpis.totalRealCost.toLocaleString()} USD</span>
                                </div>
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <span class="text-[10px] text-slate-400 block mb-1">Margen Bruto Estimado</span>
                                    <span class="font-mono font-extrabold text-base ${kpis.projectedGrossMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                                        $${kpis.projectedGrossMargin.toLocaleString()} (${kpis.projectedGrossMarginPct}%)
                                    </span>
                                </div>
                            ` : `
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <span class="text-[10px] text-slate-400 block mb-1">HH Cotizadas Totales</span>
                                    <span class="font-mono font-extrabold text-base text-cyan-400">${kpis.totalEstimatedHH.toLocaleString()} HH</span>
                                </div>
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <span class="text-[10px] text-slate-400 block mb-1">HH Consumidas Terreno</span>
                                    <span class="font-mono font-extrabold text-base text-white">${kpis.totalRealHH.toLocaleString()} HH</span>
                                </div>
                                <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <span class="text-[10px] text-slate-400 block mb-1">Avance Físico Global</span>
                                    <span class="font-mono font-extrabold text-base text-emerald-400">${kpis.globalProgress}%</span>
                                </div>
                            `}
                            <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                <span class="text-[10px] text-slate-400 block mb-1">Desvío Neto de HH</span>
                                <span class="font-mono font-extrabold text-base ${kpis.hhDeviation > 0 ? 'text-rose-400' : 'text-emerald-400'}">
                                    ${kpis.hhDeviation > 0 ? `+${kpis.hhDeviation} HH` : `${kpis.hhDeviation} HH`}
                                </span>
                            </div>
                        </div>

                        <!-- Tabla Detallada por Recurso -->
                        <div class="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr class="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                                            <th class="p-3">Recurso / Oficio</th>
                                            <th class="p-3">Categoría</th>
                                            <th class="p-3 text-right">Cotizado (Presupuesto)</th>
                                            <th class="p-3 text-right">Real Consumido</th>
                                            <th class="p-3 text-right">Saldo Remanente</th>
                                            ${!isSupervision ? `<th class="p-3 text-right">Impacto Financiero ($)</th>` : ''}
                                            <th class="p-3 text-center">Nivel de Consumo</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-800/70 font-mono">
                                        ${balanceData.items.map(item => {
                                            const isOver = item.delta > 0;
                                            return `
                                                <tr class="hover:bg-slate-900/50 transition-colors">
                                                    <td class="p-3 font-sans font-semibold text-slate-200 flex items-center gap-2">
                                                        <i data-lucide="${item.category === 'machinery' ? 'truck' : (item.category === 'equipment' ? 'layers' : 'users')}" class="w-3.5 h-3.5 text-slate-400"></i>
                                                        ${item.name}
                                                    </td>
                                                    <td class="p-3 text-slate-400 uppercase text-[10px] font-sans">
                                                        ${item.category === 'labor' ? 'Mano de Obra' : (item.category === 'machinery' ? 'Maquinaria' : 'Equipos')}
                                                    </td>
                                                    <td class="p-3 text-right text-slate-300 font-bold">${item.estimated} ${item.unit}</td>
                                                    <td class="p-3 text-right text-white font-bold">${item.real} ${item.unit}</td>
                                                    <td class="p-3 text-right font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}">
                                                        ${isOver ? `+${item.delta}` : item.balance} ${item.unit}
                                                    </td>
                                                    ${!isSupervision ? `
                                                        <td class="p-3 text-right font-bold ${item.costDelta > 0 ? 'text-rose-400' : (item.costDelta < 0 ? 'text-emerald-400' : 'text-slate-400')}">
                                                            ${item.costDelta > 0 ? `+$${item.costDelta.toLocaleString()}` : (item.costDelta < 0 ? `-$${Math.abs(item.costDelta).toLocaleString()}` : '$0')}
                                                        </td>
                                                    ` : ''}
                                                    <td class="p-3 text-center">
                                                        <div class="flex items-center gap-2 justify-center">
                                                            <div class="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                                <div class="h-full ${item.percentUsed > 100 ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${Math.min(100, item.percentUsed)}%;"></div>
                                                            </div>
                                                            <span class="text-[10px] font-bold ${item.percentUsed > 100 ? 'text-rose-400' : 'text-slate-300'}">${item.percentUsed}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-between items-center">
                        <button type="button" id="btn-export-balance-csv" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5">
                            <i data-lucide="download" class="w-3.5 h-3.5 text-cyan-400"></i> Exportar Balance a CSV
                        </button>
                        <button type="button" class="btn-close-modal px-4 py-2 rounded-xl bg-slate-700 text-slate-200 text-xs font-semibold">Cerrar</button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        // Exportar a CSV
        const exportBtn = document.getElementById('btn-export-balance-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                let csv = '';
                if (!isSupervision) {
                    csv = 'Recurso,Categoria,Unidad,Cotizado,Real_Consumido,Saldo_Remanente,Tarifa_Hora_USD,Impacto_Financiero_USD,Consumo_Pct\n';
                    balanceData.items.forEach(it => {
                        csv += `"${it.name}","${it.category}","${it.unit}",${it.estimated},${it.real},${it.balance},${it.hourlyRate},${it.costDelta},${it.percentUsed}%\n`;
                    });
                } else {
                    csv = 'Recurso,Categoria,Unidad,Cotizado,Real_Consumido,Saldo_Remanente,Consumo_Pct\n';
                    balanceData.items.forEach(it => {
                        csv += `"${it.name}","${it.category}","${it.unit}",${it.estimated},${it.real},${it.balance},${it.percentUsed}%\n`;
                    });
                }
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Balance_Recursos_${project.code}_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                this.showToast('Balance exportado a archivo CSV');
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 8. MODAL: CREADOR LIMPIO DE TAREAS (SIN CREACIÓN PREVIA EN BACKLOG)
    // ======================================================================
    openTaskCreator() {
        const p = this.store.getActiveProject();
        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="plus-square" class="w-5 h-5 text-amber-400"></i>
                            <h3 class="text-base font-bold text-white">Nueva Tarea de Montaje</h3>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form id="form-create-task" class="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-grow text-xs">
                        
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="sm:col-span-2">
                                <label class="block text-slate-300 font-semibold mb-1">Nombre de la Tarea</label>
                                <input type="text" name="name" placeholder="Ej: Montaje de Cañería 8'' Sch 80" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" required>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Tag / Código</label>
                                <input type="text" name="tag" placeholder="Ej: PIP-10" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Disciplina</label>
                                <select name="discipline" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                                    ${DISCIPLINES.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Duración Estimada (Días)</label>
                                <input type="number" name="durationDays" min="1" max="60" value="3" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono" required>
                            </div>
                        </div>

                        <!-- Fecha de inicio y destino -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Fecha de Inicio Programada</label>
                                <input type="date" name="estimatedStart" value="${p ? p.startDate : '2026-09-01'}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono">
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Destino de la Tarea</label>
                                <select name="targetDestination" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-semibold">
                                    <option value="calendar" selected>Programar directo en Calendario</option>
                                    <option value="backlog">Enviar a Bandeja de Pendientes</option>
                                </select>
                            </div>
                        </div>

                        <!-- Mano de obra -->
                        <div>
                            <h4 class="font-bold text-slate-200 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-cyan-400">
                                <i data-lucide="users" class="w-4 h-4"></i> Mano de Obra Estimada (Horas-Hombre totales)
                            </h4>
                            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                ${RESOURCE_CATALOG.labor.map(res => `
                                    <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                                        <label class="block text-[11px] text-slate-400 truncate">${res.name.split(' ')[0]}</label>
                                        <input type="number" min="0" step="4" name="labor_${res.id}" value="${res.id === 'supervisor' ? 12 : 24}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 mt-1 text-white font-mono text-center focus:border-amber-500 focus:outline-none">
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Maquinaria -->
                        <div>
                            <h4 class="font-bold text-slate-200 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-orange-400">
                                <i data-lucide="truck" class="w-4 h-4"></i> Maquinaria Pesada (Horas de uso)
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                ${RESOURCE_CATALOG.machinery.map(res => `
                                    <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                                        <label class="block text-[11px] text-slate-400 truncate">${res.name}</label>
                                        <input type="number" min="0" step="2" name="machinery_${res.id}" value="0" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 mt-1 text-white font-mono text-center focus:border-amber-500 focus:outline-none">
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label class="block text-slate-300 font-semibold mb-1">Notas Técnicas / Memoria de Montaje</label>
                            <textarea name="notes" rows="2" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" placeholder="Especificaciones de soldadura, izajes o requerimientos de seguridad..."></textarea>
                        </div>

                    </form>

                    <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-2">
                        <button type="button" class="btn-close-modal px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">Cancelar</button>
                        <button type="button" id="btn-save-new-task" class="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                            <i data-lucide="check" class="w-4 h-4"></i> Guardar Tarea
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const saveBtn = document.getElementById('btn-save-new-task');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const form = document.getElementById('form-create-task');
                const formData = new FormData(form);

                const labor = {};
                RESOURCE_CATALOG.labor.forEach(r => {
                    labor[r.id] = parseFloat(formData.get(`labor_${r.id}`)) || 0;
                });

                const machinery = {};
                RESOURCE_CATALOG.machinery.forEach(r => {
                    machinery[r.id] = parseFloat(formData.get(`machinery_${r.id}`)) || 0;
                });

                const targetDest = formData.get('targetDestination');
                const startDate = formData.get('estimatedStart');
                const addToBacklog = targetDest === 'backlog';

                const taskData = {
                    name: formData.get('name') || 'Nueva Tarea',
                    tag: formData.get('tag') || '',
                    discipline: formData.get('discipline') || 'piping',
                    durationDays: parseInt(formData.get('durationDays')) || 3,
                    estimatedStart: startDate,
                    notes: formData.get('notes') || '',
                    labor,
                    machinery
                };

                this.store.createTask(taskData, addToBacklog);
                this.showToast(addToBacklog ? 'Tarea creada y añadida a la bandeja de pendientes' : 'Tarea creada y programada en el calendario');
                this.closeModal();
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 9. MODAL: INFORME EJECUTIVO DE ESTADO DE OBRA (IMPRIMIBLE / PDF)
    // ======================================================================
    openPrintReportModal() {
        const p = this.store.getActiveProject();
        const kpis = this.store.getProjectKPIs();
        const balance = this.store.getResourceBalance();
        const allTasks = [...(p.tasks || [])];
        const isSupervision = this.store.state.isSupervisionMode;

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
                <div class="bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col print:m-0 print:p-0 print:max-w-none print:shadow-none">
                    
                    <!-- Header no imprimible -->
                    <div class="p-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between print:hidden">
                        <span class="font-bold text-slate-700 flex items-center gap-2">
                            <i data-lucide="printer" class="w-5 h-5 text-amber-600"></i> Vista Previa de Informe Ejecutivo de Obra ${isSupervision ? '(Operativo)' : ''}
                        </span>
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                                <i data-lucide="printer" class="w-4 h-4"></i> Imprimir o Guardar PDF
                            </button>
                            <button type="button" class="btn-close-modal px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold">Cerrar</button>
                        </div>
                    </div>

                    <!-- Cuerpo Imprimible -->
                    <div class="p-8 space-y-6 overflow-y-auto text-xs leading-relaxed print:p-0">
                        
                        <!-- Encabezado corporativo -->
                        <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                            <div>
                                <h1 class="text-xl font-black tracking-tight text-slate-950 uppercase">${p.name}</h1>
                                <p class="text-sm font-semibold text-slate-600">Código: ${p.code} • Cliente: ${p.client || 'N/A'}</p>
                                <p class="text-xs text-slate-500">Ubicación: ${p.location || 'N/A'} • Fecha Inicio: ${p.startDate}</p>
                            </div>
                            <div class="text-right">
                                <span class="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded border border-slate-300">INFORME EJECUTIVO DE MONTAJE</span>
                                <p class="text-[10px] text-slate-500 mt-1">Fecha de Emisión: ${new Date().toLocaleDateString('es-AR')}</p>
                            </div>
                        </div>

                        <!-- Resumen KPI -->
                        <div class="grid grid-cols-4 gap-3">
                            <div class="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <span class="text-[10px] uppercase font-bold text-slate-500 block">Avance Ponderado</span>
                                <span class="text-xl font-extrabold text-slate-900 font-mono">${kpis.globalProgress}%</span>
                            </div>
                            <div class="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <span class="text-[10px] uppercase font-bold text-slate-500 block">Horas-Hombre (Real/Plan)</span>
                                <span class="text-sm font-bold text-slate-900 font-mono">${kpis.totalRealHH} / ${kpis.totalEstimatedHH} HH</span>
                            </div>
                            <div class="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <span class="text-[10px] uppercase font-bold text-slate-500 block">Desempeño Plazo (SPI)</span>
                                <span class="text-base font-bold ${kpis.spi >= 1 ? 'text-emerald-700' : 'text-rose-700'} font-mono">SPI: ${kpis.spi}</span>
                            </div>
                            ${!isSupervision ? `
                            <div class="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <span class="text-[10px] uppercase font-bold text-slate-500 block">Presupuesto Cotizado</span>
                                <span class="text-sm font-bold text-slate-900 font-mono">$${kpis.contractBudget.toLocaleString()} USD</span>
                            </div>
                            ` : `
                            <div class="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <span class="text-[10px] uppercase font-bold text-slate-500 block">Tareas Programadas</span>
                                <span class="text-sm font-bold text-slate-900 font-mono">${allTasks.filter(t => t.status === 'completed').length} / ${allTasks.length} listas</span>
                            </div>
                            `}
                        </div>

                        <!-- Tabla de Tareas y Estado -->
                        <div>
                            <h3 class="font-bold text-sm text-slate-900 uppercase tracking-wide mb-2">Detalle de Tareas de Montaje Programadas</h3>
                            <table class="w-full text-left border-collapse border border-slate-300 text-[11px]">
                                <thead class="bg-slate-100 border-b border-slate-300 font-semibold">
                                    <tr>
                                        <th class="p-2 border-r border-slate-300">Tag</th>
                                        <th class="p-2 border-r border-slate-300">Tarea</th>
                                        <th class="p-2 border-r border-slate-300">Disciplina</th>
                                        <th class="p-2 border-r border-slate-300 text-center">Duración</th>
                                        <th class="p-2 border-r border-slate-300 text-center">Avance</th>
                                        <th class="p-2 border-r border-slate-300 text-right">HH Plan</th>
                                        <th class="p-2">Estado</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 font-mono">
                                    ${allTasks.map(t => `
                                        <tr>
                                            <td class="p-2 border-r border-slate-200 font-bold">${t.tag || '-'}</td>
                                            <td class="p-2 border-r border-slate-200 font-sans font-medium">${t.name}</td>
                                            <td class="p-2 border-r border-slate-200 uppercase text-[10px] font-sans">${t.discipline}</td>
                                            <td class="p-2 border-r border-slate-200 text-center">${t.durationDays}d</td>
                                            <td class="p-2 border-r border-slate-200 text-center font-bold">${t.progress || 0}%</td>
                                            <td class="p-2 border-r border-slate-200 text-right">${t.labor ? Object.values(t.labor).reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0}</td>
                                            <td class="p-2 font-sans font-semibold">${t.status === 'completed' ? 'Finalizada' : (t.status === 'in_progress' ? 'En Ejecución' : 'Pendiente')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Firmas de conformidad -->
                        <div class="grid grid-cols-2 gap-12 pt-12 text-center text-xs">
                            <div class="border-t border-slate-400 pt-2 font-bold text-slate-700">
                                Jefatura de Obra / Montaje Mecánico
                            </div>
                            <div class="border-t border-slate-400 pt-2 font-bold text-slate-700">
                                Inspección Técnica de Obra (Comitente)
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        if (window.lucide) window.lucide.createIcons();
    }
}


// ===== app.js =====
// ==========================================================================
// APP: BOOTSTRAP, ORQUESTADOR DE VISTAS, DASHBOARD KPI Y CONTROLADORES
// ==========================================================================




class AppController {
    constructor() {
        this.store = store;
        this.modals = new ModalManager(store);
        window.appModals = this.modals; // Disponible globalmente para eventos en HTML

        this.timeline = new TimelineRenderer(store, 'timeline-container', 'backlog-cards-container');
        
        this.initDOM();
        this.initEvents();
        
        // Suscribirse a cambios del store reactivo
        this.store.subscribe((state) => this.render(state));

        // Renderizado inicial
        this.render(this.store.state);
    }

    initDOM() {
        // Inicializar selector de proyectos
        const selector = document.getElementById('project-select');
        if (selector) {
            selector.innerHTML = this.store.getAllProjects().map(p => `
                <option value="${p.id}">${p.code ? `[${p.code}] ` : ''}${p.name}</option>
            `).join('');
            selector.value = this.store.state.currentProjectId;
        }

        // Inicializar selector de filtro de disciplinas
        const discFilter = document.getElementById('filter-discipline');
        if (discFilter) {
            discFilter.innerHTML = `
                <option value="all">Todas las disciplinas</option>
                ${DISCIPLINES.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            `;
        }
    }

    initEvents() {
        // Selector de proyecto
        const selector = document.getElementById('project-select');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.store.switchProject(e.target.value);
            });
        }

        // Pestañas Principales: Estimado | Real | Comparativa
        ['estimated', 'real', 'comparativa'].forEach(tabName => {
            const btn = document.getElementById(`tab-btn-${tabName}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.store.switchTab(tabName);
                });
            }
        });

        // Botón Modo Supervisión
        const btnSupervision = document.getElementById('btn-toggle-supervision');
        if (btnSupervision) {
            btnSupervision.addEventListener('click', () => {
                this.store.toggleSupervisionMode();
            });
        }

        // Botón Compartir Enlace
        const btnShare = document.getElementById('btn-share-link');
        if (btnShare) {
            btnShare.addEventListener('click', () => {
                this.modals.openShareModal();
            });
        }

        // Botón Importar Presupuesto
        const btnImport = document.getElementById('btn-open-import');
        if (btnImport) {
            btnImport.addEventListener('click', () => {
                this.modals.openImportModal();
            });
        }

        // Botón Crear Nueva Obra
        const btnCreateProject = document.getElementById('btn-open-create-project');
        if (btnCreateProject) {
            btnCreateProject.addEventListener('click', () => {
                this.modals.openCreateProjectModal();
            });
        }

        // Botón Balance Consolidado de Recursos Cotizados
        const btnResourceBalance = document.getElementById('btn-open-resource-balance');
        if (btnResourceBalance) {
            btnResourceBalance.addEventListener('click', () => {
                this.modals.openResourceBalanceModal();
            });
        }

        // Botón Informe Ejecutivo Imprimible / PDF
        const btnPrintReport = document.getElementById('btn-open-print-report');
        if (btnPrintReport) {
            btnPrintReport.addEventListener('click', () => {
                this.modals.openPrintReportModal();
            });
        }

        // Botón Nueva Tarea Manual (Limpio, solo se crea si el usuario confirma)
        const btnNewTask = document.getElementById('btn-new-task');
        if (btnNewTask) {
            btnNewTask.addEventListener('click', () => {
                this.modals.openTaskCreator();
            });
        }

        // Filtros de búsqueda
        const searchInput = document.getElementById('input-search-tasks');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.store.setFilters({ search: e.target.value });
            });
        }

        const discFilter = document.getElementById('filter-discipline');
        if (discFilter) {
            discFilter.addEventListener('change', (e) => {
                this.store.setFilters({ discipline: e.target.value });
            });
        }

        const statusFilter = document.getElementById('filter-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.store.setFilters({ status: e.target.value });
            });
        }

        // Toggle Heatmap de Recursos
        const toggleHeatmap = document.getElementById('btn-toggle-heatmap');
        if (toggleHeatmap) {
            toggleHeatmap.addEventListener('click', () => {
                const current = this.store.state.filters.showHeatmap;
                this.store.setFilters({ showHeatmap: !current });
            });
        }

        // Toggle Bandeja de Pendientes (Móvil / Colapsable)
        const toggleDrawerBtn = document.getElementById('btn-toggle-backlog');
        const backlogSidebar = document.getElementById('backlog-sidebar');
        if (toggleDrawerBtn && backlogSidebar) {
            toggleDrawerBtn.addEventListener('click', () => {
                backlogSidebar.classList.toggle('hidden');
                backlogSidebar.classList.toggle('flex');
            });
        }

        // Botón de restablecer datos a fábrica
        const btnReset = document.getElementById('btn-reset-data');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm('¿Restablecer todos los datos del proyecto a los valores de demostración iniciales?')) {
                    this.store.resetToDefault();
                    this.modals.showToast('Datos restablecidos');
                }
            });
        }
    }

    /**
     * Renderiza la aplicación completa ante cambios de estado
     */
    render(state) {
        this.updateProjectHeader(state);
        this.updateTabsUI(state.currentTab);
        this.updateSupervisionBanner(state.isSupervisionMode);
        this.updateKPIDashboard();
        this.timeline.render();

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Actualiza la información del encabezado del proyecto
     */
    updateProjectHeader(state) {
        const project = this.store.getActiveProject();
        if (!project) return;

        const selector = document.getElementById('project-select');
        if (selector && selector.value !== project.id) {
            selector.value = project.id;
        }

        const titleEl = document.getElementById('project-title');
        if (titleEl) titleEl.textContent = project.name;

        const clientEl = document.getElementById('project-client-loc');
        if (clientEl) {
            clientEl.textContent = `${project.client || ''} • ${project.location || ''} • Inicio: ${project.startDate}`;
        }
    }

    /**
     * Actualiza el diseño visual de las 3 pestañas principales
     */
    updateTabsUI(activeTab) {
        ['estimated', 'real', 'comparativa'].forEach(tabName => {
            const btn = document.getElementById(`tab-btn-${tabName}`);
            if (!btn) return;

            const isActive = tabName === activeTab;
            if (isActive) {
                btn.className = 'tab-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20';
            } else {
                btn.className = 'tab-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50';
            }
        });

        // Control de visibilidad de la Bandeja Lateral de Pendientes según la pestaña
        const backlogSidebar = document.getElementById('backlog-sidebar');
        const btnToggleBacklog = document.getElementById('btn-toggle-backlog');

        if (activeTab === 'estimated') {
            // Pestaña Estimado: Ocultar totalmente la bandeja de tareas, solo mostrar el calendario limpio a pantalla completa
            if (backlogSidebar) {
                backlogSidebar.classList.add('hidden');
                backlogSidebar.classList.remove('lg:flex', 'flex');
            }
            if (btnToggleBacklog) {
                btnToggleBacklog.classList.add('hidden');
                btnToggleBacklog.classList.remove('flex');
            }
        } else if (activeTab === 'real') {
            // Pestaña Real: Permitir bandeja de pendientes para gestión operativa en terreno
            if (backlogSidebar) {
                backlogSidebar.classList.remove('hidden');
                backlogSidebar.classList.add('lg:flex');
            }
            if (btnToggleBacklog) {
                btnToggleBacklog.classList.remove('hidden');
                btnToggleBacklog.classList.add('flex');
            }
        } else if (activeTab === 'comparativa') {
            // Pestaña Comparativa: Ocultar bandeja para maximizar la comparación visual en pantalla completa
            if (backlogSidebar) {
                backlogSidebar.classList.add('hidden');
                backlogSidebar.classList.remove('lg:flex', 'flex');
            }
            if (btnToggleBacklog) {
                btnToggleBacklog.classList.add('hidden');
                btnToggleBacklog.classList.remove('flex');
            }
        }

        // Banner descriptivo según la pestaña activa
        const bannerEl = document.getElementById('tab-context-banner');
        if (bannerEl) {
            if (activeTab === 'estimated') {
                bannerEl.innerHTML = `
                    <div class="flex items-center gap-2 text-xs text-slate-300">
                        <i data-lucide="calendar" class="w-4 h-4 text-blue-400"></i>
                        <span><strong>Pestaña 1: Estimado (Cronograma Base)</strong> — Calendario contractual oficial y tareas programadas en base a lo cotizado.</span>
                    </div>
                `;
            } else if (activeTab === 'real') {
                bannerEl.innerHTML = `
                    <div class="flex items-center gap-2 text-xs text-slate-300">
                        <i data-lucide="activity" class="w-4 h-4 text-emerald-400"></i>
                        <span><strong>Pestaña 2: Real (Ejecución en Terreno)</strong> — Monitoreo efectivo de obra. Asienta partes diarios de avance y horas en cada tarea.</span>
                    </div>
                `;
            } else if (activeTab === 'comparativa') {
                bannerEl.innerHTML = `
                    <div class="flex items-center gap-2 text-xs text-slate-300">
                        <i data-lucide="git-compare" class="w-4 h-4 text-amber-400"></i>
                        <span><strong>Pestaña 3: Comparativa / Control</strong> — Superposición de Línea de Base (arriba) vs. Avance Real (abajo). Cálculos automáticos de desviación en días y Horas-Hombre.</span>
                    </div>
                `;
            }
        }
    }

    /**
     * Actualiza el aviso y comportamiento del modo supervisión (Solo lectura)
     */
    updateSupervisionBanner(isSupervision) {
        const banner = document.getElementById('supervision-banner');
        const btnToggle = document.getElementById('btn-toggle-supervision');

        if (banner) {
            if (isSupervision) {
                banner.classList.remove('hidden');
                banner.classList.add('flex');
            } else {
                banner.classList.add('hidden');
                banner.classList.remove('flex');
            }
        }

        if (btnToggle) {
            if (isSupervision) {
                btnToggle.innerHTML = `<i data-lucide="eye" class="w-4 h-4 text-cyan-400"></i> <span class="hidden sm:inline">Modo:</span> Supervisión`;
                btnToggle.classList.add('border-cyan-500/50', 'bg-cyan-950/40', 'text-cyan-300');
                btnToggle.classList.remove('border-slate-700', 'bg-slate-800', 'text-slate-300');
            } else {
                btnToggle.innerHTML = `<i data-lucide="edit-3" class="w-4 h-4 text-amber-400"></i> <span class="hidden sm:inline">Modo:</span> Edición`;
                btnToggle.classList.remove('border-cyan-500/50', 'bg-cyan-950/40', 'text-cyan-300');
                btnToggle.classList.add('border-slate-700', 'bg-slate-800', 'text-slate-300');
            }
        }

        // Ocultar tarjeta de costos/dinero y mostrar tarjeta de tareas operativas
        const costCard = document.getElementById('kpi-cost-card');
        const taskStatsCard = document.getElementById('kpi-tasks-stats-card');
        if (costCard && taskStatsCard) {
            if (isSupervision) {
                costCard.classList.add('hidden');
                taskStatsCard.classList.remove('hidden');
            } else {
                costCard.classList.remove('hidden');
                taskStatsCard.classList.add('hidden');
            }
        }

        // Ocultar botones de modificación en modo supervisión
        const editOnlyButtons = [
            'btn-open-create-project',
            'btn-open-import',
            'btn-new-task',
            'btn-reset-data'
        ];
        editOnlyButtons.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isSupervision) {
                    el.classList.add('hidden');
                } else {
                    el.classList.remove('hidden');
                }
            }
        });
    }

    /**
     * Actualiza el Dashboard superior con los KPIs (HH, Costo, Avance Ponderado, EVM SPI, Conflictos)
     */
    updateKPIDashboard() {
        const kpis = this.store.getProjectKPIs();
        if (!kpis) return;

        // 1. Horas Hombre (Plan vs Real)
        const hhEstimatedEl = document.getElementById('kpi-hh-estimated');
        const hhRealEl = document.getElementById('kpi-hh-real');
        const hhDeviationEl = document.getElementById('kpi-hh-deviation');
        if (hhEstimatedEl) hhEstimatedEl.textContent = `${kpis.totalEstimatedHH.toLocaleString()} HH`;
        if (hhRealEl) hhRealEl.textContent = `${kpis.totalRealHH.toLocaleString()} HH`;
        if (hhDeviationEl) {
            const dev = kpis.hhDeviation;
            hhDeviationEl.textContent = dev > 0 ? `+${dev} HH sobrecosto` : (dev < 0 ? `${dev} HH ahorro` : 'En presupuesto');
            hhDeviationEl.className = `text-[10px] font-semibold px-1.5 py-0.5 rounded ${dev > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`;
        }

        // 2. Avance Global Ponderado
        const progressEl = document.getElementById('kpi-global-progress');
        const progressFill = document.getElementById('kpi-progress-bar-fill');
        if (progressEl) progressEl.textContent = `${kpis.globalProgress}%`;
        if (progressFill) progressFill.style.width = `${kpis.globalProgress}%`;

        // 3. Monto Cotizado de Venta vs Costo Real (Modo Edición)
        const costRealEl = document.getElementById('kpi-cost-real');
        const contractBudgetEl = document.getElementById('kpi-contract-budget');
        const marginBadgeEl = document.getElementById('kpi-margin-badge');
        if (costRealEl) costRealEl.textContent = `$${kpis.totalRealCost.toLocaleString()}`;
        if (contractBudgetEl) contractBudgetEl.textContent = `$${kpis.contractBudget.toLocaleString()}`;
        if (marginBadgeEl) {
            const isPositive = kpis.projectedGrossMargin >= 0;
            marginBadgeEl.textContent = `Margen: ${kpis.projectedGrossMarginPct}% ($${kpis.projectedGrossMargin.toLocaleString()})`;
            marginBadgeEl.className = `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`;
        }

        // 3B. Tareas Operativas para Modo Supervisión (Sin Costos)
        const project = this.store.getActiveProject();
        if (project) {
            const allTasks = [...(project.tasks || []), ...(project.backlog || [])];
            const completedCount = allTasks.filter(t => (t.progress || 0) >= 100).length;
            const inProgressCount = allTasks.filter(t => (t.progress || 0) > 0 && (t.progress || 0) < 100).length;
            const completedEl = document.getElementById('kpi-supervision-completed-count');
            const totalEl = document.getElementById('kpi-supervision-total-count');
            const badgeEl = document.getElementById('kpi-supervision-tasks-badge');
            if (completedEl) completedEl.textContent = completedCount;
            if (totalEl) totalEl.textContent = allTasks.length;
            if (badgeEl) badgeEl.textContent = `${inProgressCount} en curso • ${completedCount} listas`;
        }

        // 4. Plazo y EVM SPI (Schedule Performance Index)
        const spiEl = document.getElementById('kpi-spi-value');
        const daysDevEl = document.getElementById('kpi-days-deviation');
        if (spiEl) {
            spiEl.textContent = `SPI: ${kpis.spi}`;
            spiEl.className = `text-xs font-mono font-bold px-2 py-0.5 rounded ${kpis.spi >= 1.0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`;
        }
        if (daysDevEl) {
            daysDevEl.textContent = kpis.totalDaysDeviation > 0 
                ? `+${kpis.totalDaysDeviation} días de atraso (${kpis.delayedTasksCount} tareas)`
                : 'Cronograma al día';
            daysDevEl.className = `text-xs ${kpis.totalDaysDeviation > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}`;
        }

        // 5. Alertas de Conflictos
        const conflictsBadge = document.getElementById('kpi-conflicts-badge');
        const conflictsText = document.getElementById('kpi-conflicts-text');
        if (conflictsBadge && conflictsText) {
            if (kpis.activeConflicts > 0) {
                conflictsBadge.classList.remove('hidden');
                conflictsBadge.classList.add('flex', 'animate-pulse');
                conflictsText.textContent = `${kpis.activeConflicts} sobreasignaciones detectadas`;
            } else {
                conflictsBadge.classList.add('hidden');
                conflictsBadge.classList.remove('flex', 'animate-pulse');
            }
        }

        // Contador de pendientes en badge
        const backlogCounter = document.getElementById('backlog-count-badge');
        if (backlogCounter) {
            backlogCounter.textContent = kpis.backlogCount;
        }
    }
}

// Iniciar aplicación al cargar el DOM en navegador
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new AppController();
    });
}


})();
