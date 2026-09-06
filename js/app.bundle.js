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
        calendarConfig: {
            workWeek: [1, 2, 3, 4, 5],
            holidays: {
                '2026-09-11': {
                    name: 'Feriado Provincial / Asueto Petrolero',
                    isWorking: false,
                    isPaid: true,
                    hoursPerWorker: 8
                }
            }
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
                estimatedEnd: '2026-09-09',
                realStart: '2026-09-04',
                realEnd: '2026-09-10',
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
                estimatedStart: '2026-09-07',
                estimatedEnd: '2026-09-10',
                realStart: '2026-09-07',
                realEnd: '2026-09-14',
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
                estimatedEnd: '2026-09-14',
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
                estimatedStart: '2026-09-15',
                estimatedEnd: '2026-09-17',
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
 * Formatea un objeto Date a string YYYY-MM-DD usando fecha local, sin desfase UTC
 */
function formatDateLocal(d) {
    if (!d || isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Genera un array de fechas (YYYY-MM-DD) entre startDate y endDate inclusive
 */
function getDatesRange(startDateStr, endDateStr) {
    const dates = [];
    if (!startDateStr || !endDateStr) return dates;
    
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);
    
    // Mediodía para evitar cualquier salto DST
    let curr = new Date(sYear, sMonth - 1, sDay, 12, 0, 0);
    const end = new Date(eYear, eMonth - 1, eDay, 12, 0, 0);
    
    while (curr <= end) {
        dates.push(formatDateLocal(curr));
        curr.setDate(curr.getDate() + 1);
    }
    return dates;
}

/**
 * Calcula la fecha de fin a partir de una fecha de inicio y una duración en días (mínimo 1 día).
 * Si se especifica calendarConfig, contabiliza únicamente días laborables (saltando fines de semana y feriados/paradas).
 */
function calculateEndDate(startDateStr, durationDays, calendarConfig = null) {
    if (!startDateStr) return null;
    const dur = Math.max(1, parseInt(durationDays) || 1);
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const curr = new Date(sYear, sMonth - 1, sDay, 12, 0, 0);

    if (!calendarConfig) {
        curr.setDate(curr.getDate() + (dur - 1));
        return formatDateLocal(curr);
    }

    const workWeek = calendarConfig.workWeek || [1, 2, 3, 4, 5];
    const holidays = calendarConfig.holidays || {};

    let workDaysCount = 0;
    let safetyCounter = 0;
    const maxDays = Math.max(1000, dur * 10);

    while (safetyCounter < maxDays) {
        safetyCounter++;
        const dStr = formatDateLocal(curr);
        let isWorking = true;

        if (holidays[dStr]) {
            isWorking = Boolean(holidays[dStr].isWorking);
        } else {
            isWorking = workWeek.includes(curr.getDay());
        }

        if (isWorking) {
            workDaysCount++;
            if (workDaysCount >= dur) {
                return dStr;
            }
        }
        curr.setDate(curr.getDate() + 1);
    }
    return formatDateLocal(curr);
}

/**
 * Busca metadatos de un recurso en el catálogo (labor, machinery, equipment)
 */
function getResourceMeta(resourceId, customCatalog = null) {
    const cat = customCatalog || RESOURCE_CATALOG;
    for (const group of ['labor', 'machinery', 'equipment']) {
        if (cat[group]) {
            const found = cat[group].find(r => r.id === resourceId);
            if (found) return { ...found, category: group };
        }
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
 * @param {Object} customCatalog - Catálogo dinámico opcional
 * @returns {Object} { conflictsByDate, taskConflicts, dailyLoad, totalConflictsCount }
 */
function analyzeResourceConflicts(tasks, resourceLimits = {}, mode = 'estimated', customCatalog = null, calendarConfig = null) {
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
            if (calendarConfig) {
                const workWeek = calendarConfig.workWeek || [1, 2, 3, 4, 5];
                const holidays = calendarConfig.holidays || {};
                let isWorking = true;
                if (holidays[date]) {
                    isWorking = Boolean(holidays[date].isWorking);
                } else {
                    const [y, m, d] = date.split('-').map(Number);
                    isWorking = workWeek.includes(new Date(y, m - 1, d, 12, 0, 0).getDay());
                }
                if (!isWorking) return; // No hay actividad productiva en días no laborables
            }

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
            const meta = getResourceMeta(resId, customCatalog);
            const limit = (resourceLimits && resourceLimits[resId] !== undefined) 
                ? resourceLimits[resId] 
                : (meta.defaultLimit || 5);

            if (data.total > limit) {
                // Hay sobreasignación (monotarea o multitarea)
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
                status: 'all'
            },
            selectedTaskId: null,
            catalogs: {
                labor: [],
                machinery: [],
                equipment: []
            },
            disciplines: []
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
                currentProjectId: this.state.currentProjectId,
                catalogs: this.state.catalogs,
                disciplines: this.state.disciplines
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
            this.state.catalogs = JSON.parse(JSON.stringify(RESOURCE_CATALOG));
            this.state.disciplines = JSON.parse(JSON.stringify(DISCIPLINES));
            return;
        }
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.projects && parsed.projects.length > 0) {
                    this.state.projects = parsed.projects;
                    this.state.currentProjectId = parsed.currentProjectId || parsed.projects[0].id;
                }
                this.state.catalogs = parsed.catalogs || JSON.parse(JSON.stringify(RESOURCE_CATALOG));
                this.state.disciplines = parsed.disciplines || JSON.parse(JSON.stringify(DISCIPLINES));
                return;
            }
        } catch (e) {
            console.warn('Cargando proyectos por defecto tras error en localStorage:', e);
        }
        // Si no hay datos guardados, cargar los mock iniciales
        this.state.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
        this.state.currentProjectId = this.state.projects[0].id;
        this.state.catalogs = JSON.parse(JSON.stringify(RESOURCE_CATALOG));
        this.state.disciplines = JSON.parse(JSON.stringify(DISCIPLINES));
    }

    /**
     * Genera el payload de respaldo completo y dispara la descarga del archivo de base de datos
     */
    exportDatabase(fileExtension = 'json') {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
        const data = {
            app: 'ACHERO - Avance & Control de Obras',
            schemaVersion: '1.0',
            exportedAt: now.toISOString(),
            exportedAtLocale: now.toLocaleString('es-AR'),
            stats: {
                projectsCount: this.state.projects.length,
                tasksCount: this.state.projects.reduce((acc, p) => acc + (p.tasks ? p.tasks.length : 0) + (p.backlog ? p.backlog.length : 0), 0),
                laborCount: (this.state.catalogs && this.state.catalogs.labor) ? this.state.catalogs.labor.length : 0,
                machineryCount: (this.state.catalogs && this.state.catalogs.machinery) ? this.state.catalogs.machinery.length : 0,
                disciplinesCount: (this.state.disciplines || []).length
            },
            projects: this.state.projects,
            currentProjectId: this.state.currentProjectId,
            catalogs: this.state.catalogs,
            disciplines: this.state.disciplines
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const fileName = `ACHERO_BaseDatos_${dateStr}_${timeStr}.${fileExtension}`;

        if (typeof window !== 'undefined' && typeof window.URL !== 'undefined' && typeof window.URL.createObjectURL === 'function') {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            if (document.body) {
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            window.URL.revokeObjectURL(url);
        }

        return { success: true, fileName, stats: data.stats };
    }

    /**
     * Importa y valida una base de datos proveniente de un archivo JSON/.db
     * Modo: 'overwrite' (reemplaza todo) | 'merge' (combina obras sin borrar las existentes)
     */
    importDatabase(importedData, mode = 'overwrite') {
        if (!importedData || typeof importedData !== 'object') {
            throw new Error('El archivo proporcionado no tiene un formato válido.');
        }

        const projects = importedData.projects;
        if (!Array.isArray(projects) || projects.length === 0) {
            throw new Error('El archivo no contiene un listado válido de obras (projects).');
        }

        if (mode === 'overwrite') {
            this.state.projects = JSON.parse(JSON.stringify(projects));
            this.state.currentProjectId = importedData.currentProjectId || projects[0].id;
            if (importedData.catalogs) {
                this.state.catalogs = JSON.parse(JSON.stringify(importedData.catalogs));
            }
            if (importedData.disciplines && Array.isArray(importedData.disciplines)) {
                this.state.disciplines = JSON.parse(JSON.stringify(importedData.disciplines));
            }
        } else if (mode === 'merge') {
            // Combinar proyectos
            projects.forEach(impProj => {
                const existingIdx = this.state.projects.findIndex(p => p.id === impProj.id);
                if (existingIdx !== -1) {
                    this.state.projects[existingIdx] = JSON.parse(JSON.stringify(impProj));
                } else {
                    this.state.projects.push(JSON.parse(JSON.stringify(impProj)));
                }
            });

            // Combinar catálogos
            if (importedData.catalogs) {
                ['labor', 'machinery', 'equipment'].forEach(catKey => {
                    const impItems = importedData.catalogs[catKey] || [];
                    if (!this.state.catalogs[catKey]) this.state.catalogs[catKey] = [];
                    impItems.forEach(item => {
                        if (!this.state.catalogs[catKey].some(x => x.id === item.id)) {
                            this.state.catalogs[catKey].push(JSON.parse(JSON.stringify(item)));
                        }
                    });
                });
            }

            // Combinar disciplinas
            if (importedData.disciplines && Array.isArray(importedData.disciplines)) {
                importedData.disciplines.forEach(disc => {
                    if (!this.state.disciplines.some(d => d.id === disc.id)) {
                        this.state.disciplines.push(JSON.parse(JSON.stringify(disc)));
                    }
                });
            }
        }

        this.notify();
        return {
            success: true,
            importedProjectsCount: projects.length,
            totalProjectsCount: this.state.projects.length
        };
    }

    /**
     * Retorna estadísticas del almacenamiento local actual
     */
    getDatabaseStats() {
        const rawJson = typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) || '') : '';
        const sizeBytes = new Blob([rawJson]).size;
        const sizeKB = (sizeBytes / 1024).toFixed(1);

        const totalTasks = this.state.projects.reduce((sum, p) => {
            return sum + (p.tasks ? p.tasks.length : 0) + (p.backlog ? p.backlog.length : 0);
        }, 0);

        return {
            projectsCount: this.state.projects.length,
            tasksCount: totalTasks,
            sizeKB: sizeKB,
            sizeBytes: sizeBytes,
            currentProjectName: this.getActiveProject()?.name || 'N/A'
        };
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

    /**
     * Obtiene la fecha de corte de avance para el proyecto (HOY o simulación)
     */
    getProjectCutoffDate(project = this.getActiveProject()) {
        if (!project) return formatDateLocal(new Date());
        if (project.currentDate) return project.currentDate;
        
        const todayStr = formatDateLocal(new Date());
        const projStart = project.startDate || '2026-09-01';
        const projEnd = calculateEndDate(projStart, project.durationDays || 30);
        
        // Si la fecha actual de la máquina cae dentro del cronograma de la obra
        if (todayStr >= projStart && todayStr <= projEnd) {
            return todayStr;
        }
        
        // Para obras demo en septiembre 2026
        if (projStart <= '2026-09-08' && projEnd >= '2026-09-08') {
            return '2026-09-08';
        }
        return projStart;
    }

    getConflicts() {
        const project = this.getActiveProject();
        if (!project) return { conflictsByDate: {}, taskConflicts: {}, dailyLoad: {}, totalConflictsCount: 0 };
        return analyzeResourceConflicts(project.tasks, project.resourceLimits, this.state.currentTab === 'real' ? 'real' : 'estimated', this.getCatalogs(), project.calendarConfig);
    }

    /**
     * Calcula la fecha de fin de una tarea considerando días laborables del calendario de obra
     */
    calculateTaskEndDate(startDateStr, durationDays, project = this.getActiveProject()) {
        const calConfig = project ? project.calendarConfig : null;
        return calculateEndDate(startDateStr, durationDays, calConfig);
    }

    /**
     * Obtiene el estado laboral de una fecha en el calendario del proyecto:
     * - 'workday': Jornada normal de trabajo
     * - 'weekend': Fin de semana estándar (Sábado/Domingo según workWeek)
     * - 'holiday_paid': Feriado / asueto pago (no laborable pero devenga costo sobre presupuesto)
     * - 'holiday_unpaid': Parada de obra sin liquidación salarial
     */
    getDayStatus(dateStr, project = this.getActiveProject()) {
        if (!dateStr || !project) {
            return { type: 'workday', isWorking: true, isWeekend: false, isHoliday: false, isPaid: false, name: 'Día Laborable', cost: 0 };
        }

        const calConfig = project.calendarConfig || {};
        const workWeek = calConfig.workWeek || [1, 2, 3, 4, 5]; // Lun-Vie por defecto
        const holidays = calConfig.holidays || {};

        // 1. Configuración explícita para la fecha
        if (holidays[dateStr]) {
            const h = holidays[dateStr];
            const isPaid = Boolean(h.isPaid);
            const isWorking = Boolean(h.isWorking);
            const cost = isPaid ? this.getHolidayDailyCost(dateStr, project) : 0;
            return {
                type: isWorking ? 'workday' : (isPaid ? 'holiday_paid' : 'holiday_unpaid'),
                isWorking,
                isWeekend: false,
                isHoliday: true,
                isPaid,
                name: h.name || (isPaid ? 'Feriado Pago' : 'Día No Laborable'),
                hoursPerWorker: h.hoursPerWorker || 8,
                customCost: h.customCost !== undefined ? h.customCost : null,
                cost
            };
        }

        // 2. Determinar si es fin de semana según workWeek
        const [y, m, d] = dateStr.split('-').map(Number);
        const dayOfWeek = new Date(y, m - 1, d, 12, 0, 0).getDay();
        const isWorking = workWeek.includes(dayOfWeek);

        if (!isWorking) {
            const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            return {
                type: 'weekend',
                isWorking: false,
                isWeekend: true,
                isHoliday: false,
                isPaid: false,
                name: `${dayNames[dayOfWeek]} (No Laborable)`,
                cost: 0
            };
        }

        return {
            type: 'workday',
            isWorking: true,
            isWeekend: false,
            isHoliday: false,
            isPaid: false,
            name: 'Jornada Laborable Normal',
            cost: 0
        };
    }

    /**
     * Calcula el costo presupuestario de una jornada de feriado pago
     */
    getHolidayDailyCost(dateStr, project = this.getActiveProject()) {
        if (!project) return 0;
        const calConfig = project.calendarConfig || {};
        const holidays = calConfig.holidays || {};
        const h = holidays[dateStr];
        if (!h || !h.isPaid) return 0;

        // Si el usuario fijó un monto manual personalizado
        if (h.customCost !== null && h.customCost !== undefined && !isNaN(Number(h.customCost))) {
            return Math.round(Number(h.customCost));
        }

        // Calcular en base a la dotación de mano de obra del proyecto
        const hoursPerWorker = Number(h.hoursPerWorker) || 8;
        const catalogs = this.getCatalogs();
        const laborCatalog = catalogs.labor || [];

        let totalLaborCost = 0;
        const limits = project.resourceLimits || {};

        laborCatalog.forEach(res => {
            const qty = Number(limits[res.id]) || 0;
            if (qty > 0) {
                const rate = Number(res.hourlyRate) || 25;
                totalLaborCost += qty * hoursPerWorker * rate;
            }
        });

        // Si no hay límites de dotación cargados, estimar en base a las cuadrillas de tareas
        if (totalLaborCost === 0 && project.tasks && project.tasks.length > 0) {
            const avgLaborMap = {};
            project.tasks.forEach(t => {
                if (t.labor) {
                    const dur = Math.max(1, t.durationDays || 1);
                    Object.entries(t.labor).forEach(([rId, hrs]) => {
                        avgLaborMap[rId] = Math.max(avgLaborMap[rId] || 0, (parseFloat(hrs) || 0) / dur);
                    });
                }
            });
            Object.entries(avgLaborMap).forEach(([rId, avgPerDay]) => {
                const meta = getResourceMeta(rId, catalogs);
                totalLaborCost += avgPerDay * (meta.hourlyRate || 25);
            });
        }

        return Math.round(totalLaborCost || 1200);
    }

    /**
     * Configura el estado de una fecha (laborable, fin de semana, feriado pago o parada sin costo)
     */
    setDayStatus(dateStr, statusData, project = this.getActiveProject()) {
        if (this.state.isSupervisionMode || !project || !dateStr) return false;

        if (!project.calendarConfig) {
            project.calendarConfig = { workWeek: [1, 2, 3, 4, 5], holidays: {} };
        }
        if (!project.calendarConfig.holidays) {
            project.calendarConfig.holidays = {};
        }

        if (!statusData || statusData.type === 'reset' || statusData.type === 'default') {
            delete project.calendarConfig.holidays[dateStr];
        } else if (statusData.type === 'workday') {
            project.calendarConfig.holidays[dateStr] = {
                name: statusData.name || 'Jornada Laborable Habilitada',
                isWorking: true,
                isPaid: false
            };
        } else if (statusData.type === 'weekend') {
            project.calendarConfig.holidays[dateStr] = {
                name: statusData.name || 'Día No Laborable (Sin Costo)',
                isWorking: false,
                isPaid: false
            };
        } else if (statusData.type === 'holiday_paid') {
            project.calendarConfig.holidays[dateStr] = {
                name: statusData.name || 'Feriado Pago / Asueto',
                isWorking: false,
                isPaid: true,
                hoursPerWorker: Number(statusData.hoursPerWorker) || 8,
                customCost: statusData.customCost !== undefined && statusData.customCost !== null && statusData.customCost !== '' 
                    ? Number(statusData.customCost) 
                    : null
            };
        } else if (statusData.type === 'holiday_unpaid') {
            project.calendarConfig.holidays[dateStr] = {
                name: statusData.name || 'Parada No Laborable (Sin Costo)',
                isWorking: false,
                isPaid: false
            };
        }

        // Recalcular dinámicamente fechas fin de las tareas según el nuevo calendario laboral
        (project.tasks || []).forEach(t => {
            const dur = Math.max(1, t.durationDays || 1);
            if (t.estimatedStart) {
                t.estimatedEnd = this.calculateTaskEndDate(t.estimatedStart, dur, project);
            }
            if (t.realStart) {
                t.realEnd = this.calculateTaskEndDate(t.realStart, dur, project);
            }
        });

        this.notify();
        return true;
    }

    // Cálculo exhaustivo de KPIs (HH, Costo, Avance Ponderado, EVM)
    getProjectKPIs() {
        const project = this.getActiveProject();
        if (!project) return null;

        const tasks = project.tasks || [];
        const catalogs = this.getCatalogs();
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
                    const meta = getResourceMeta(resId, catalogs);
                    totalEstimatedCost += h * (meta.hourlyRate || 25);
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
                    const meta = getResourceMeta(resId, catalogs);
                    totalRealCost += h * (meta.hourlyRate || 25);
                });
            }
            totalRealHH += taskRealHH;

            // Costos Maquinaria
            if (t.machinery) {
                Object.entries(t.machinery).forEach(([mId, hrs]) => {
                    const h = parseFloat(hrs) || 0;
                    const meta = getResourceMeta(mId, catalogs);
                    totalEstimatedMachineryCost += h * (meta.hourlyRate || 100);
                });
            }
            const machToUse = (t.realMachinery && Object.keys(t.realMachinery).length > 0) ? t.realMachinery : t.machinery;
            if (machToUse) {
                Object.entries(machToUse).forEach(([mId, hrs]) => {
                    const h = parseFloat(hrs) || 0;
                    const meta = getResourceMeta(mId, catalogs);
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

        // Desviación en días (Comparativa) y Planned Value riguroso (EVM)
        let totalDaysDeviation = 0;
        let delayedTasksCount = 0;
        const cutoffDateStr = this.getProjectCutoffDate(project);
        const [cY, cM, cD] = cutoffDateStr.split('-').map(Number);
        const cutoffTime = new Date(cY, cM - 1, cD, 12, 0, 0).getTime();

        let plannedValueHH = 0;

        tasks.forEach(t => {
            const taskHH = t.labor ? Object.values(t.labor).reduce((a, b) => a + (parseFloat(b) || 0), 0) : 40;

            // 1. Atraso y desvío de cronograma
            if (t.estimatedEnd && t.realEnd) {
                const [eY, eM, eD] = t.estimatedEnd.split('-').map(Number);
                const [rY, rM, rD] = t.realEnd.split('-').map(Number);
                const est = new Date(eY, eM - 1, eD, 12, 0, 0).getTime();
                const real = new Date(rY, rM - 1, rD, 12, 0, 0).getTime();
                const diffDays = Math.round((real - est) / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    totalDaysDeviation += diffDays;
                    delayedTasksCount++;
                }
            } else if (t.estimatedEnd && ((t.progress || 0) < 100)) {
                const [eY, eM, eD] = t.estimatedEnd.split('-').map(Number);
                const est = new Date(eY, eM - 1, eD, 12, 0, 0).getTime();
                if (cutoffTime > est) {
                    const overdue = Math.round((cutoffTime - est) / (1000 * 60 * 60 * 24));
                    totalDaysDeviation += overdue;
                    delayedTasksCount++;
                }
            }

            // 2. Planned Value (PV) acumulado al corte de obra
            if (t.estimatedStart && t.estimatedEnd) {
                if (t.estimatedEnd <= cutoffDateStr) {
                    plannedValueHH += taskHH;
                } else if (t.estimatedStart <= cutoffDateStr) {
                    const dur = Math.max(1, t.durationDays || 1);
                    const [sY, sM, sD] = t.estimatedStart.split('-').map(Number);
                    const startMs = new Date(sY, sM - 1, sD, 12, 0, 0).getTime();
                    const elapsedDays = Math.max(1, Math.round((cutoffTime - startMs) / (1000 * 60 * 60 * 24)) + 1);
                    const planFraction = Math.min(1, elapsedDays / dur);
                    plannedValueHH += (taskHH * planFraction);
                }
            }
        });

        // Índice SPI (Earned Value / Planned Value)
        let spi = 1.00;
        if (plannedValueHH > 0) {
            spi = (earnedValueHH / plannedValueHH).toFixed(2);
        } else if (earnedValueHH > 0) {
            spi = 1.10;
        }

        // Conteo de conflictos activos
        const conflicts = this.getConflicts();

        // 3. Costos de Feriados Pagos en el calendario de la obra
        const startDateStr = project.startDate || '2026-09-01';
        const timelineDays = project.durationDays || 28;
        const endDateStr = calculateEndDate(startDateStr, timelineDays);
        const calendarDates = getDatesRange(startDateStr, endDateStr);

        let totalHolidayCost = 0;
        let paidHolidaysCount = 0;
        let weekendDaysCount = 0;
        let nonWorkingDaysCount = 0;

        calendarDates.forEach(dStr => {
            const status = this.getDayStatus(dStr, project);
            if (!status.isWorking) {
                nonWorkingDaysCount++;
                if (status.isWeekend) weekendDaysCount++;
            }
            if (status.isHoliday && status.isPaid) {
                paidHolidaysCount++;
                totalHolidayCost += status.cost || 0;
            }
        });

        // Sumar costo de feriados al presupuesto estimado y real
        const finalEstimatedProjectCost = totalEstimatedProjectCost + totalHolidayCost;
        const finalRealProjectCost = totalRealProjectCost + totalHolidayCost;

        // Monto contractual cotizado (Venta) vs Costo Proyectado
        const contractBudget = project.contractBudget || Math.round(finalEstimatedProjectCost * 1.28);
        const projectedGrossMargin = contractBudget - finalRealProjectCost;
        const projectedGrossMarginPct = contractBudget > 0 ? Math.round((projectedGrossMargin / contractBudget) * 100) : 0;

        return {
            totalEstimatedHH: Math.round(totalEstimatedHH),
            totalRealHH: Math.round(totalRealHH),
            hhDeviation: Math.round(totalRealHH - totalEstimatedHH),
            globalProgress,
            totalEstimatedCost: Math.round(finalEstimatedProjectCost),
            totalRealCost: Math.round(finalRealProjectCost),
            costDeviation: Math.round(finalRealProjectCost - finalEstimatedProjectCost),
            contractBudget: Math.round(contractBudget),
            projectedGrossMargin: Math.round(projectedGrossMargin),
            projectedGrossMarginPct,
            totalDaysDeviation,
            delayedTasksCount,
            spi: parseFloat(spi),
            activeConflicts: conflicts.totalConflictsCount,
            totalTasksCount: tasks.length + (project.backlog ? project.backlog.length : 0),
            backlogCount: project.backlog ? project.backlog.length : 0,
            // Métricas de calendario y feriados
            totalHolidayCost: Math.round(totalHolidayCost),
            paidHolidaysCount,
            weekendDaysCount,
            nonWorkingDaysCount
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

        const catalogs = this.getCatalogs();

        // Inicializar catálogo dinámico completo
        ['labor', 'machinery', 'equipment'].forEach(category => {
            if (catalogs[category]) {
                catalogs[category].forEach(res => {
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
            }
        });

        const ensureResource = (resId, fallbackCategory = 'labor', fallbackUnit = 'HH') => {
            if (!resourceMap[resId]) {
                const meta = getResourceMeta(resId, catalogs);
                resourceMap[resId] = {
                    id: resId,
                    name: meta.name || resId,
                    category: meta.category || fallbackCategory,
                    unit: meta.unit || fallbackUnit,
                    hourlyRate: meta.hourlyRate || res.dailyRate || 25,
                    estimated: 0,
                    real: 0
                };
            }
        };

        // Acumular de las tareas
        allTasks.forEach(task => {
            // Mano de obra
            if (task.labor) {
                Object.entries(task.labor).forEach(([rId, qty]) => {
                    ensureResource(rId, 'labor', 'HH');
                    resourceMap[rId].estimated += parseFloat(qty) || 0;
                });
            }
            if (task.realLabor && Object.keys(task.realLabor).length > 0) {
                Object.entries(task.realLabor).forEach(([rId, qty]) => {
                    ensureResource(rId, 'labor', 'HH');
                    resourceMap[rId].real += parseFloat(qty) || 0;
                });
            } else if (task.progress > 0 && task.labor) {
                // Si tiene avance pero no desglose fino, computar proporcional
                Object.entries(task.labor).forEach(([rId, qty]) => {
                    ensureResource(rId, 'labor', 'HH');
                    resourceMap[rId].real += ((parseFloat(qty) || 0) * (task.progress / 100));
                });
            }

            // Maquinaria
            if (task.machinery) {
                Object.entries(task.machinery).forEach(([mId, qty]) => {
                    ensureResource(mId, 'machinery', 'hs');
                    resourceMap[mId].estimated += parseFloat(qty) || 0;
                });
            }
            if (task.realMachinery && Object.keys(task.realMachinery).length > 0) {
                Object.entries(task.realMachinery).forEach(([mId, qty]) => {
                    ensureResource(mId, 'machinery', 'hs');
                    resourceMap[mId].real += parseFloat(qty) || 0;
                });
            }

            // Equipamiento
            if (task.equipment) {
                Object.entries(task.equipment).forEach(([eId, qty]) => {
                    ensureResource(eId, 'equipment', 'u');
                    resourceMap[eId].estimated += parseFloat(qty) || 0;
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

    // Eliminar una obra del sistema (con validación de seguridad)
    deleteProject(projectId) {
        if (this.state.isSupervisionMode) return false;
        if (this.state.projects.length <= 1) {
            throw new Error('No se puede eliminar la única obra activa. Debe haber al menos una obra en la base de datos.');
        }

        const index = this.state.projects.findIndex(p => p.id === projectId);
        if (index === -1) return false;

        const deletedName = this.state.projects[index].name;
        this.state.projects.splice(index, 1);

        if (this.state.currentProjectId === projectId) {
            this.state.currentProjectId = this.state.projects[0].id;
        }

        this.notify();
        return { success: true, deletedName };
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
        const newEndDate = this.calculateTaskEndDate(targetDate, dur, project);

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

    // Intercambiar posición de dos filas de tareas (Drag & Drop en las 3 pestañas)
    swapTasks(taskIdA, taskIdB) {
        if (this.state.isSupervisionMode) return false;
        const project = this.getActiveProject();
        if (!project || !project.tasks) return false;

        const idxA = project.tasks.findIndex(t => t.id === taskIdA);
        const idxB = project.tasks.findIndex(t => t.id === taskIdB);

        if (idxA !== -1 && idxB !== -1 && idxA !== idxB) {
            const temp = project.tasks[idxA];
            project.tasks[idxA] = project.tasks[idxB];
            project.tasks[idxB] = temp;
            this.notify();
            return true;
        }
        return false;
    }

    // Reordenar tarea a la posición de otra tarea
    reorderTasks(sourceTaskId, targetTaskId, placeAfter = false) {
        if (this.state.isSupervisionMode) return false;
        const project = this.getActiveProject();
        if (!project || !project.tasks) return false;

        const fromIdx = project.tasks.findIndex(t => t.id === sourceTaskId);
        const toIdx = project.tasks.findIndex(t => t.id === targetTaskId);

        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
            const [moved] = project.tasks.splice(fromIdx, 1);
            const insertIdx = placeAfter ? (toIdx > fromIdx ? toIdx : toIdx + 1) : (toIdx > fromIdx ? toIdx - 1 : toIdx);
            project.tasks.splice(Math.max(0, Math.min(project.tasks.length, insertIdx)), 0, moved);
            this.notify();
            return true;
        }
        return false;
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
                task.estimatedEnd = this.calculateTaskEndDate(task.estimatedStart, task.durationDays, project);
            }
        }
        if (updatedFields.realStart || (updatedFields.durationDays && task.realStart && !updatedFields.realEnd)) {
            if (task.realStart && !updatedFields.realEnd) {
                task.realEnd = this.calculateTaskEndDate(task.realStart, task.durationDays, project);
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

    // Asegurar baseline de recursos para cálculo determinista de partes diarios
    ensureTaskBaseResources(task) {
        if (!task) return;
        if (!task.dailyLogs) task.dailyLogs = [];
        if (!task.realLabor) task.realLabor = {};
        if (!task.realMachinery) task.realMachinery = {};

        // Asegurar que cada parte diario tenga un ID único
        task.dailyLogs.forEach((l, idx) => {
            if (!l.id) l.id = 'LOG-' + (idx + 1) + '-' + (l.date || 'rec');
        });

        if (task._baseRealLabor !== undefined && task._baseRealMachinery !== undefined) {
            return;
        }

        // Sumar lo que ya tienen asentado los partes diarios existentes
        const loggedLabor = {};
        const loggedMach = {};
        task.dailyLogs.forEach(log => {
            if (log.labor) {
                Object.entries(log.labor).forEach(([rId, hrs]) => {
                    loggedLabor[rId] = (loggedLabor[rId] || 0) + (parseFloat(hrs) || 0);
                });
            }
            if (log.machinery) {
                Object.entries(log.machinery).forEach(([mId, hrs]) => {
                    loggedMach[mId] = (loggedMach[mId] || 0) + (parseFloat(hrs) || 0);
                });
            }
        });

        // La base es el realLabor actual menos lo que fue sumado por partes diarios
        task._baseRealLabor = {};
        Object.entries(task.realLabor || {}).forEach(([rId, val]) => {
            task._baseRealLabor[rId] = Math.max(0, (parseFloat(val) || 0) - (loggedLabor[rId] || 0));
        });

        task._baseRealMachinery = {};
        Object.entries(task.realMachinery || {}).forEach(([mId, val]) => {
            task._baseRealMachinery[mId] = Math.max(0, (parseFloat(val) || 0) - (loggedMach[mId] || 0));
        });
    }

    // Recalcular recursos y avance de la tarea en base a sus partes diarios
    recalculateTaskResources(task) {
        if (!task) return;
        this.ensureTaskBaseResources(task);

        const newLabor = { ...(task._baseRealLabor || {}) };
        const newMach = { ...(task._baseRealMachinery || {}) };

        // Acumular todos los partes diarios vigentes
        (task.dailyLogs || []).forEach(log => {
            if (log.labor) {
                Object.entries(log.labor).forEach(([rId, hrs]) => {
                    const h = parseFloat(hrs) || 0;
                    if (h > 0) newLabor[rId] = (newLabor[rId] || 0) + h;
                });
            }
            if (log.machinery) {
                Object.entries(log.machinery).forEach(([mId, hrs]) => {
                    const h = parseFloat(hrs) || 0;
                    if (h > 0) newMach[mId] = (newMach[mId] || 0) + h;
                });
            }
        });

        task.realLabor = newLabor;
        task.realMachinery = newMach;

        // Si hay partes diarios, el avance lo determina el parte más reciente
        if (task.dailyLogs && task.dailyLogs.length > 0) {
            task.progress = task.dailyLogs[0].progress !== undefined ? task.dailyLogs[0].progress : (task.progress || 0);
            if (task.progress >= 100) {
                task.status = 'completed';
                if (!task.realEnd) task.realEnd = task.dailyLogs[0].date;
            } else if (task.progress > 0) {
                task.status = 'in_progress';
                if (!task.realStart) task.realStart = task.estimatedStart || task.dailyLogs[0].date;
            } else {
                task.status = 'pending';
            }
        } else {
            // Si no quedan partes diarios
            if (task.progress >= 100) {
                task.status = 'completed';
            } else if (task.progress > 0) {
                task.status = 'in_progress';
            } else {
                task.status = 'pending';
            }
        }
    }

    // Registrar Parte Diario estructurado con historial de auditoría
    addDailyLog(taskId, logData) {
        if (this.state.isSupervisionMode) return null;
        const project = this.getActiveProject();
        if (!project) return null;

        let task = project.tasks.find(t => t.id === taskId);
        if (!task && project.backlog) task = project.backlog.find(t => t.id === taskId);
        if (!task) return null;

        this.ensureTaskBaseResources(task);

        const logId = 'LOG-' + Date.now().toString(36) + '-' + Math.floor(10 + Math.random() * 90);
        const date = logData.date || this.getProjectCutoffDate(project);
        const progress = Math.min(100, Math.max(0, logData.progress !== undefined ? parseInt(logData.progress) : (task.progress || 0)));
        const notes = (logData.notes || '').trim();

        // Acumular mano de obra de la jornada
        const laborLogged = {};
        if (logData.labor) {
            Object.entries(logData.labor).forEach(([rId, hrs]) => {
                const h = parseFloat(hrs) || 0;
                if (h > 0) {
                    laborLogged[rId] = h;
                }
            });
        }

        // Acumular maquinaria de la jornada
        const machLogged = {};
        if (logData.machinery) {
            Object.entries(logData.machinery).forEach(([mId, hrs]) => {
                const h = parseFloat(hrs) || 0;
                if (h > 0) {
                    machLogged[mId] = h;
                }
            });
        }

        const newLog = {
            id: logId,
            date: date,
            progress: progress,
            labor: laborLogged,
            machinery: machLogged,
            notes: notes,
            createdAt: new Date().toISOString()
        };

        task.dailyLogs.unshift(newLog); // Más reciente arriba
        this.recalculateTaskResources(task);

        if (notes) {
            const noteHeader = `[${date} Parte Diario]: ${notes}`;
            task.notes = task.notes ? `${task.notes}\n${noteHeader}` : noteHeader;
        }

        this.notify();
        return newLog;
    }

    // Editar un Parte Diario existente (para corregir horas, avance, fecha o notas mal cargadas)
    updateDailyLog(taskId, logId, updatedData) {
        if (this.state.isSupervisionMode) return null;
        const project = this.getActiveProject();
        if (!project) return null;

        let task = project.tasks.find(t => t.id === taskId);
        if (!task && project.backlog) task = project.backlog.find(t => t.id === taskId);
        if (!task || !task.dailyLogs) return null;

        const log = task.dailyLogs.find(l => l.id === logId);
        if (!log) return null;

        this.ensureTaskBaseResources(task);

        if (updatedData.date) log.date = updatedData.date;
        if (updatedData.progress !== undefined) {
            log.progress = Math.min(100, Math.max(0, parseInt(updatedData.progress)));
        }
        if (updatedData.notes !== undefined) {
            log.notes = (updatedData.notes || '').trim();
        }

        if (updatedData.labor) {
            const cleanLabor = {};
            Object.entries(updatedData.labor).forEach(([rId, hrs]) => {
                const h = parseFloat(hrs) || 0;
                if (h > 0) cleanLabor[rId] = h;
            });
            log.labor = cleanLabor;
        }

        if (updatedData.machinery) {
            const cleanMach = {};
            Object.entries(updatedData.machinery).forEach(([mId, hrs]) => {
                const h = parseFloat(hrs) || 0;
                if (h > 0) cleanMach[mId] = h;
            });
            log.machinery = cleanMach;
        }

        log.updatedAt = new Date().toISOString();

        this.recalculateTaskResources(task);
        this.notify();
        return log;
    }

    // Eliminar un Parte Diario erróneo (descuenta horas acumuladas y recalcula avance)
    deleteDailyLog(taskId, logId) {
        if (this.state.isSupervisionMode) return false;
        const project = this.getActiveProject();
        if (!project) return false;

        let task = project.tasks.find(t => t.id === taskId);
        if (!task && project.backlog) task = project.backlog.find(t => t.id === taskId);
        if (!task || !task.dailyLogs) return false;

        const idx = task.dailyLogs.findIndex(l => l.id === logId);
        if (idx === -1) return false;

        this.ensureTaskBaseResources(task);
        task.dailyLogs.splice(idx, 1);

        this.recalculateTaskResources(task);
        this.notify();
        return true;
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
            estimatedEnd: addToBacklog ? null : this.calculateTaskEndDate(taskData.estimatedStart || '2026-09-01', taskData.durationDays || 3, project),
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

    // ======================================================================
    // GESTIÓN DE CATÁLOGOS CRUD (EQUIPOS, MANO DE OBRA Y DISCIPLINAS)
    // ======================================================================

    getCatalogs() {
        return this.state.catalogs || RESOURCE_CATALOG;
    }

    getDisciplines() {
        return this.state.disciplines || DISCIPLINES;
    }

    isResourceInUse(resourceId) {
        for (const p of this.state.projects) {
            const allTasks = [...(p.tasks || []), ...(p.backlog || [])];
            for (const t of allTasks) {
                if (t.labor && t.labor[resourceId] > 0) return true;
                if (t.realLabor && t.realLabor[resourceId] > 0) return true;
                if (t.machinery && t.machinery[resourceId] > 0) return true;
                if (t.realMachinery && t.realMachinery[resourceId] > 0) return true;
                if (t.equipment && t.equipment[resourceId] > 0) return true;
            }
        }
        return false;
    }

    isDisciplineInUse(discId) {
        for (const p of this.state.projects) {
            const allTasks = [...(p.tasks || []), ...(p.backlog || [])];
            if (allTasks.some(t => t.discipline === discId)) return true;
        }
        return false;
    }

    addCatalogItem(category, item) {
        if (this.state.isSupervisionMode) return null;
        if (!['labor', 'machinery', 'equipment'].includes(category)) return null;
        if (!this.state.catalogs[category]) this.state.catalogs[category] = [];

        if (!item.id) {
            item.id = (item.name || 'recurso').toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
        }
        this.state.catalogs[category].push(item);
        this.notify();
        return item;
    }

    updateCatalogItem(category, itemId, updates) {
        if (this.state.isSupervisionMode) return null;
        if (!['labor', 'machinery', 'equipment'].includes(category)) return null;
        const list = this.state.catalogs[category];
        const idx = list.findIndex(r => r.id === itemId);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...updates };
            this.notify();
            return list[idx];
        }
        return null;
    }

    deleteCatalogItem(category, itemId) {
        if (this.state.isSupervisionMode) return false;
        if (!['labor', 'machinery', 'equipment'].includes(category)) return false;
        this.state.catalogs[category] = this.state.catalogs[category].filter(r => r.id !== itemId);
        this.notify();
        return true;
    }

    addDiscipline(disc) {
        if (this.state.isSupervisionMode) return null;
        if (!disc.id) {
            disc.id = (disc.name || 'disc').toLowerCase().replace(/[^a-z0-9]/g, '_');
        }
        const color = disc.color || 'blue';
        if (!disc.badgeClass) {
            disc.badgeClass = `bg-${color}-500/10 text-${color}-400 border-${color}-500/30`;
        }
        this.state.disciplines.push(disc);
        this.notify();
        return disc;
    }

    updateDiscipline(discId, updates) {
        if (this.state.isSupervisionMode) return null;
        const idx = this.state.disciplines.findIndex(d => d.id === discId);
        if (idx !== -1) {
            const color = updates.color || this.state.disciplines[idx].color || 'blue';
            updates.badgeClass = `bg-${color}-500/10 text-${color}-400 border-${color}-500/30`;
            this.state.disciplines[idx] = { ...this.state.disciplines[idx], ...updates };
            this.notify();
            return this.state.disciplines[idx];
        }
        return null;
    }

    deleteDiscipline(discId) {
        if (this.state.isSupervisionMode) return false;
        this.state.disciplines = this.state.disciplines.filter(d => d.id !== discId);
        this.notify();
        return true;
    }

    // Resetear a datos iniciales de fábrica
    resetToDefault() {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
        this.state.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
        this.state.currentProjectId = this.state.projects[0].id;
        this.state.catalogs = JSON.parse(JSON.stringify(RESOURCE_CATALOG));
        this.state.disciplines = JSON.parse(JSON.stringify(DISCIPLINES));
        this.notify();
    }
}
const store = new ProjectStore();


// ===== timeline.js =====
// ==========================================================================
// TIMELINE: RENDERIZADO DE CRONOGRAMA GANTT, COMPARATIVA Y DRAG & DROP
// ==========================================================================
class TimelineRenderer {
    constructor(store, containerId, backlogContainerId, montageContainerId = 'montage-tasks-cards-container') {
        this.store = store;
        this.container = document.getElementById(containerId);
        this.backlogContainer = document.getElementById(backlogContainerId);
        this.montageContainer = document.getElementById(montageContainerId);
        
        // Carga de zoom persistente y escala inicial optimizada para móviles (< 640px)
        let savedZoom = null;
        try {
            if (typeof localStorage !== 'undefined') {
                savedZoom = parseInt(localStorage.getItem('montaje_timeline_zoom'));
            }
        } catch(e) {}
        const defaultWidth = (typeof window !== 'undefined' && window.innerWidth < 640) ? 65 : 90;
        this.columnWidth = (!isNaN(savedZoom) && savedZoom >= 42 && savedZoom <= 180) ? savedZoom : defaultWidth;

        this.todayStr = '2026-09-08'; // Fecha simulada de corte de obra
        this.draggedTaskId = null;
        this.draggedRowTaskId = null;
        this.montageSearchQuery = '';

        this.initEvents();
        this.updateZoomIndicator();
    }

    setZoom(width) {
        const clamped = Math.max(42, Math.min(180, Math.round(width)));
        if (this.columnWidth === clamped) return;
        this.columnWidth = clamped;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('montaje_timeline_zoom', String(this.columnWidth));
            }
        } catch(e) {}
        this.updateZoomIndicator();
        this.render();
    }

    zoomIn(step = 15) {
        this.setZoom(this.columnWidth + step);
    }

    zoomOut(step = 15) {
        this.setZoom(this.columnWidth - step);
    }

    zoomReset() {
        const defaultWidth = (typeof window !== 'undefined' && window.innerWidth < 640) ? 65 : 90;
        this.setZoom(defaultWidth);
    }

    updateZoomIndicator() {
        const pctLabel = document.getElementById('label-timeline-zoom-pct');
        if (pctLabel) {
            const pct = Math.round((this.columnWidth / 90) * 100);
            pctLabel.textContent = `${pct}%`;
        }
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

        // Buscador interno en barra lateral de montaje
        const searchMontageInput = document.getElementById('input-search-montage-sidebar');
        if (searchMontageInput) {
            searchMontageInput.addEventListener('input', (e) => {
                this.montageSearchQuery = e.target.value.toLowerCase().trim();
                const project = this.store.getActiveProject();
                if (project) this.renderMontageTasksSidebar(project.tasks || []);
            });
        }

        // Controles de Zoom en Pantalla
        const btnZoomIn = document.getElementById('btn-timeline-zoom-in');
        const btnZoomOut = document.getElementById('btn-timeline-zoom-out');
        const btnZoomReset = document.getElementById('btn-timeline-zoom-reset');
        if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.zoomIn());
        if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.zoomOut());
        if (btnZoomReset) btnZoomReset.addEventListener('click', () => this.zoomReset());

        document.querySelectorAll('.btn-zoom-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const w = parseInt(btn.dataset.width);
                if (!isNaN(w)) this.setZoom(w);
            });
        });

        // Soporte de Pinch-to-Zoom táctil optimizado para teléfonos móviles
        if (this.container) {
            let initialPinchDist = 0;
            let initialPinchWidth = 90;
            let isPinching = false;
            let lastPinchTime = 0;

            this.container.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    isPinching = true;
                    initialPinchDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    initialPinchWidth = this.columnWidth;
                }
            }, { passive: true });

            this.container.addEventListener('touchmove', (e) => {
                if (isPinching && e.touches.length === 2 && initialPinchDist > 0) {
                    const now = Date.now();
                    if (now - lastPinchTime > 30) {
                        lastPinchTime = now;
                        const currentDist = Math.hypot(
                            e.touches[0].clientX - e.touches[1].clientX,
                            e.touches[0].clientY - e.touches[1].clientY
                        );
                        if (currentDist > 0) {
                            const scale = currentDist / initialPinchDist;
                            this.setZoom(Math.round(initialPinchWidth * scale));
                        }
                    }
                }
            }, { passive: true });

            this.container.addEventListener('touchend', (e) => {
                if (e.touches.length < 2) {
                    isPinching = false;
                    initialPinchDist = 0;
                }
            }, { passive: true });

            // Ctrl + Rueda en Desktop / Touchpad
            this.container.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    const delta = e.deltaY < 0 ? 12 : -12;
                    this.setZoom(this.columnWidth + delta);
                }
            }, { passive: false });

            // Doble toque en cabecera para alternar rápido entre vista compacta y normal
            let lastTap = 0;
            this.container.addEventListener('click', (e) => {
                const dayHeader = e.target.closest('.timeline-day-header');
                if (dayHeader) {
                    const now = Date.now();
                    if (now - lastTap < 300) {
                        this.setZoom(this.columnWidth < 75 ? 110 : 55);
                        lastTap = 0;
                        return;
                    }
                    lastTap = now;
                }
            });
        }
    }

    formatDate(dateStr) {
        if (!dateStr) return { dayName: '', dayNum: '', monthName: '', full: '' };
        const [y, m, d] = dateStr.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d, 12, 0, 0);
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const dayName = days[dateObj.getDay()];
        const dayNum = String(d).padStart(2, '0');
        const monthName = months[m - 1];
        return { dayName, dayNum, monthName, full: `${dayName} ${dayNum} ${monthName}` };
    }

    /**
     * Formatea fecha YYYY-MM-DD a formato amigable: "Lun 01 Sep"
     */
    formatDateLabel(dateStr) {
        return this.formatDate(dateStr);
    }

    /**
     * Render principal del Timeline, Backlog y Barra de Montaje
     */
    render() {
        const project = this.store.getActiveProject();
        if (!project) return;

        const state = this.store.state;
        const conflicts = this.store.getConflicts();
        const currentTab = state.currentTab;

        // Fecha dinámica de corte de obra ("HOY")
        this.todayStr = this.store.getProjectCutoffDate(project);

        // 1. Determinar rango de fechas del timeline (21 a 28 días desde project.startDate)
        const startDateStr = project.startDate || '2026-09-01';
        const timelineDays = project.durationDays || 28;
        const endDateStr = calculateEndDate(startDateStr, timelineDays);
        const calendarDates = getDatesRange(startDateStr, endDateStr);

        // 2. Renderizar la Bandeja de Pendientes
        this.renderBacklog(project.backlog || [], conflicts);

        // 3. Renderizar la Barra Lateral de Tareas de Montaje
        this.renderMontageTasksSidebar(project.tasks || []);

        // 4. Renderizar el Timeline Principal
        this.renderTimelineGrid(calendarDates, project.tasks || [], conflicts, currentTab);
    }

    /**
     * Renderiza las tareas de montaje en la gaveta lateral derecha (Pestaña Real)
     */
    renderMontageTasksSidebar(tasks) {
        if (!this.montageContainer) {
            this.montageContainer = document.getElementById('montage-tasks-cards-container');
        }
        if (!this.montageContainer) return;

        const disciplines = this.store.getDisciplines();

        let filtered = [...tasks];
        if (this.montageSearchQuery) {
            filtered = filtered.filter(t => 
                (t.name && t.name.toLowerCase().includes(this.montageSearchQuery)) ||
                (t.tag && t.tag.toLowerCase().includes(this.montageSearchQuery)) ||
                (t.discipline && t.discipline.toLowerCase().includes(this.montageSearchQuery))
            );
        }

        const countBadge = document.getElementById('tasks-count-badge');
        if (countBadge) countBadge.textContent = filtered.length;

        if (filtered.length === 0) {
            this.montageContainer.innerHTML = `
                <div class="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-700/60 rounded-xl my-2">
                    <i data-lucide="clipboard-list" class="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60"></i>
                    No se encontraron tareas de montaje.
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        let html = '';
        filtered.forEach(task => {
            const discipline = disciplines.find(d => d.id === task.discipline) || disciplines[0] || { name: task.discipline, badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
            const progress = task.progress || 0;
            const isCompleted = task.status === 'completed' || progress >= 100;
            const isDelayed = task.status === 'delayed';

            const statusBadge = isCompleted 
                ? '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Lista</span>'
                : (isDelayed 
                    ? '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Atrasada</span>'
                    : '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">En Obra</span>');

            html += `
                <div class="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 rounded-xl p-3 shadow-md transition-all">
                    <div class="flex items-center justify-between gap-1.5 mb-1.5">
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded ${discipline.badgeClass} border font-semibold truncate max-w-[150px]">
                            ${task.tag ? `${task.tag} • ` : ''}${discipline.name.split(' ')[0]}
                        </span>
                        ${statusBadge}
                    </div>

                    <h4 class="text-xs font-bold text-white mb-1.5 leading-snug line-clamp-2" title="${task.name}">
                        ${task.name}
                    </h4>

                    <!-- Barra de avance físico -->
                    <div class="mb-2.5">
                        <div class="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span>Avance Físico</span>
                            <span class="font-bold text-white">${progress}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style="width: ${progress}%;"></div>
                        </div>
                    </div>

                    <!-- Fechas y Duración -->
                    <div class="flex items-center justify-between text-[11px] text-slate-400 mb-2.5 font-mono">
                        <span class="flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3 text-slate-500"></i> ${task.realStart || task.estimatedStart || 'S/D'}
                        </span>
                        <span class="text-slate-300 font-bold">${task.durationDays}d</span>
                    </div>

                    <!-- Botones de Acción Rápida y Reordenamiento -->
                    <div class="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-700/60">
                        <div class="flex items-center gap-1">
                            <button type="button" class="btn-sidebar-moveup p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-amber-400 transition-colors" data-task-id="${task.id}" title="Subir fila">
                                <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
                            </button>
                            <button type="button" class="btn-sidebar-movedown p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-amber-400 transition-colors" data-task-id="${task.id}" title="Bajar fila">
                                <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                        <div class="flex items-center gap-1.5 flex-1 justify-end">
                            <button type="button" class="btn-sidebar-dailylog flex-1 px-2 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors" data-task-id="${task.id}">
                                <i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i> Parte Diario
                            </button>
                            <button type="button" class="btn-sidebar-edittask p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors" data-task-id="${task.id}" title="Editar tarea">
                                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        this.montageContainer.innerHTML = html;

        // Listeners para subir/bajar fila desde la barra lateral
        this.montageContainer.querySelectorAll('.btn-sidebar-moveup').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = btn.dataset.taskId;
                const project = this.store.getActiveProject();
                if (!project || !project.tasks) return;
                const idx = project.tasks.findIndex(t => t.id === tid);
                if (idx > 0) {
                    this.store.swapTasks(project.tasks[idx].id, project.tasks[idx - 1].id);
                }
            });
        });

        this.montageContainer.querySelectorAll('.btn-sidebar-movedown').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = btn.dataset.taskId;
                const project = this.store.getActiveProject();
                if (!project || !project.tasks) return;
                const idx = project.tasks.findIndex(t => t.id === tid);
                if (idx !== -1 && idx < project.tasks.length - 1) {
                    this.store.swapTasks(project.tasks[idx].id, project.tasks[idx + 1].id);
                }
            });
        });

        // Listeners de los botones dentro de la barra
        this.montageContainer.querySelectorAll('.btn-sidebar-dailylog').forEach(b => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = b.dataset.taskId;
                if (window.appModals) window.appModals.openDailyLog(tid);
            });
        });

        this.montageContainer.querySelectorAll('.btn-sidebar-edittask').forEach(b => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = b.dataset.taskId;
                if (window.appModals) window.appModals.openTaskEditor(tid);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Renderiza las tarjetas en la bandeja de pendientes
     */
    renderBacklog(backlogTasks, conflicts) {
        if (!this.backlogContainer) return;

        const isSupervision = this.store.state.isSupervisionMode;
        const filtered = this.filterTasks(backlogTasks);
        const disciplines = this.store.getDisciplines();

        const badgeReal = document.getElementById('backlog-count-badge-real');
        if (badgeReal) badgeReal.textContent = filtered.length;

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
            const discipline = disciplines.find(d => d.id === task.discipline) || disciplines[0] || { name: task.discipline, badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
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

        // 1. Cabecera horizontal de días adaptativa al nivel de zoom
        const isCompact = this.columnWidth < 65;
        const isVeryCompact = this.columnWidth < 52;

        let headerColsHtml = '';
        calendarDates.forEach((dateStr) => {
            const { dayName, dayNum, monthName } = this.formatDateLabel(dateStr);
            const isToday = dateStr === this.todayStr;
            const hasConflict = conflicts.conflictsByDate && conflicts.conflictsByDate[dateStr] && conflicts.conflictsByDate[dateStr].length > 0;
            const conflictInfo = hasConflict ? conflicts.conflictsByDate[dateStr] : null;
            const dayStatus = this.store.getDayStatus(dateStr);

            let dayBgClass = 'hover:bg-slate-800/50 cursor-pointer';
            let dayTextClass = 'text-slate-400';
            let numBgClass = 'text-slate-200';
            let tagBadge = '';

            if (dayStatus.isHoliday && dayStatus.isPaid) {
                dayBgClass = 'timeline-day-holiday-paid cursor-pointer';
                dayTextClass = 'text-purple-300 font-extrabold';
                numBgClass = 'bg-purple-600 text-white shadow-sm shadow-purple-500/30';
                tagBadge = `<span class="px-1 py-0.2 rounded text-[8px] font-black bg-purple-500/30 text-purple-200 border border-purple-400/50 truncate max-w-[90%]" title="${dayStatus.name} - Costo cuadrilla: $${Math.round(dayStatus.cost || 0)}">Feriado $</span>`;
            } else if (dayStatus.isHoliday && !dayStatus.isPaid) {
                dayBgClass = 'timeline-day-holiday-unpaid cursor-pointer';
                dayTextClass = 'text-rose-300 font-bold';
                numBgClass = 'bg-rose-700 text-white';
                tagBadge = `<span class="px-1 py-0.2 rounded text-[8px] font-bold bg-rose-500/20 text-rose-200 border border-rose-500/30 truncate max-w-[90%]" title="${dayStatus.name}">Parada</span>`;
            } else if (dayStatus.isWeekend) {
                dayBgClass = 'timeline-day-weekend cursor-pointer opacity-80';
                dayTextClass = 'text-slate-500';
                numBgClass = 'text-slate-400';
                tagBadge = `<span class="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Fin Sem</span>`;
            } else if (isToday) {
                dayBgClass = 'bg-amber-500/10 border-amber-500/40 cursor-pointer';
                dayTextClass = 'text-amber-400 font-bold';
                numBgClass = 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20';
            }

            headerColsHtml += `
                <div class="timeline-day-header flex-shrink-0 flex flex-col items-center justify-between py-1.5 border-r border-slate-700/60 transition-colors select-none ${dayBgClass}"
                     style="width: ${this.columnWidth}px;"
                     data-date="${dateStr}"
                     title="Día: ${dayStatus.name}. Haz clic para configurar día laborable, fin de semana o feriado pago.">
                    
                    <span class="${isVeryCompact ? 'text-[8px]' : 'text-[10px]'} uppercase font-bold tracking-wider ${dayTextClass}">
                        ${isVeryCompact ? dayName.slice(0, 1) : dayName}
                    </span>
                    
                    <div class="my-0.5 flex items-center justify-center ${isVeryCompact ? 'w-5 h-5 text-[10px]' : (isCompact ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-xs')} rounded-full font-black ${numBgClass}">
                        ${dayNum}
                    </div>

                    ${isVeryCompact ? '' : `<span class="text-[9px] text-slate-400 font-medium truncate">${monthName}</span>`}

                    ${hasConflict ? `
                        <button class="btn-inspect-conflict mt-0.5 px-1 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[9px] font-bold flex items-center gap-0.5 hover:bg-red-500 hover:text-white transition-all shadow-sm animate-pulse z-10"
                                title="Sobreasignación de recursos en esta fecha. Clic para inspeccionar."
                                data-date="${dateStr}">
                            <i data-lucide="alert-triangle" class="w-2.5 h-2.5"></i> ${isVeryCompact ? '' : conflictInfo.length}
                        </button>
                    ` : (tagBadge ? tagBadge : `
                        <span class="text-[9px] text-transparent select-none mt-0.5">•</span>
                    `)}
                </div>
            `;
        });

        // Ancho de columna del tirador para reordenar filas
        const rowHandleWidth = 32;
        // Ensamblado final de ancho del calendario
        const totalTimelineWidth = (calendarDates.length * this.columnWidth) + rowHandleWidth;

        // 2. Construcción de los carriles de tareas (Swimlanes)
        let lanesHtml = '';
        filteredTasks.forEach((task, index) => {
            const laneHtml = this.renderTaskLane(task, calendarDates, conflicts, currentTab, isSupervision, index, totalTimelineWidth);
            lanesHtml += laneHtml;
        });

        this.container.innerHTML = `
            <div class="timeline-wrapper select-none overflow-x-auto overflow-y-visible custom-scrollbar relative pb-4" style="min-width: 100%;">
                
                <!-- Barra superior de calendario (Gantt puro sin columnas laterales dentro del calendario) -->
                <div class="sticky top-0 z-20 flex bg-slate-900/95 backdrop-blur border-b border-slate-700/80 shadow-md" style="width: ${totalTimelineWidth}px;">
                    <!-- Cabecera sticky para el tirador de reordenar filas -->
                    <div class="timeline-row-reorder-header sticky left-0 z-30 flex-shrink-0 w-8 flex items-center justify-center bg-slate-900 border-r border-slate-700/80 text-slate-500" title="Arrastra el número de fila para intercambiar el orden">
                        <i data-lucide="chevrons-up-down" class="w-3.5 h-3.5 text-slate-400"></i>
                    </div>
                    <div class="flex">${headerColsHtml}</div>
                </div>

                <!-- Cuerpo de Carriles de Tareas (Gantt Puro) -->
                <div class="relative divide-y divide-slate-800/80" style="width: ${totalTimelineWidth}px;">
                    ${lanesHtml.length > 0 ? lanesHtml : `
                        <div class="p-12 text-center text-slate-400 text-sm">
                            <i data-lucide="clipboard-x" class="w-10 h-10 mx-auto mb-2 text-slate-500 opacity-60"></i>
                            No hay tareas programadas que coincidan con los filtros.
                        </div>
                    `}
                </div>

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

        // 5b. Clic en cabecera de día para configurar feriados / días no laborables
        this.container.querySelectorAll('.timeline-day-header').forEach(hdr => {
            hdr.addEventListener('click', (e) => {
                if (e.target.closest('.btn-inspect-conflict')) return;
                const date = hdr.dataset.date;
                if (window.appModals && typeof window.appModals.openDayCalendarModal === 'function') {
                    window.appModals.openDayCalendarModal(date);
                }
            });
        });

        // 6. Clic en las barras de tareas para abrir Parte Diario (en Real) o Editor de Tarea (en Estimado/Comparativa)
        this.container.querySelectorAll('.timeline-bar-container').forEach(bar => {
            bar.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = bar.dataset.taskId;
                if (currentTab === 'real') {
                    if (window.appModals) window.appModals.openDailyLog(taskId);
                } else {
                    if (window.appModals) window.appModals.openTaskEditor(taskId);
                }
            });
        });

        // Botones de edición y reporte rápido auxiliares
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
    renderTaskLane(task, calendarDates, conflicts, currentTab, isSupervision, index, totalTimelineWidth) {
        const rowIndex = index;
        const rowHandleWidth = 32;
        const disciplines = this.store.getDisciplines();
        const discipline = disciplines.find(d => d.id === task.discipline) || disciplines[0] || { name: 'General', badgeClass: 'bg-slate-700 text-slate-300' };
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
        const endIndex = endDayStr ? calendarDates.indexOf(endDayStr) : -1;

        // Si la tarea no tiene fecha en este rango
        const isPlaced = startIndex !== -1;
        const leftOffset = isPlaced ? (startIndex * this.columnWidth) : 0;

        // Ancho de barra y span de días calendario (días corridos reales que abarca la tarea)
        const calendarSpan = (isPlaced && endIndex !== -1 && endIndex >= startIndex) 
            ? (endIndex - startIndex + 1) 
            : dur;
        const barWidth = Math.max(this.columnWidth * 0.9, calendarSpan * this.columnWidth);

        // Desglose de fechas que abarca la tarea en el calendario
        const taskDates = [];
        if (isPlaced) {
            for (let i = 0; i < calendarSpan; i++) {
                const idx = startIndex + i;
                if (idx < calendarDates.length) {
                    taskDates.push(calendarDates[idx]);
                }
            }
        }
        const nonWorkingDaysInTask = taskDates.filter(d => !this.store.getDayStatus(d).isWorking);
        const nonWorkingCount = nonWorkingDaysInTask.length;

        // Capa visual de pausas por días no laborables superpuesta de forma nítida en la barra
        const nonWorkingOverlayHtml = isPlaced ? `
            <div class="absolute inset-0 flex pointer-events-none z-10">
                ${taskDates.map(d => {
                    const dayStatus = this.store.getDayStatus(d);
                    if (dayStatus.isHoliday && dayStatus.isPaid) {
                        return `
                            <div class="task-bar-pause-holiday-paid h-full border-r border-purple-500/60 flex flex-col items-center justify-center p-0.5 overflow-hidden select-none"
                                 style="width: ${this.columnWidth}px;"
                                 title="Feriado Pago: ${dayStatus.name} (Pausa de Tarea en Terreno)">
                                <span class="px-1 py-0.2 rounded text-[7.5px] font-black bg-purple-950/95 text-purple-200 border border-purple-400 shadow-md">
                                    ${this.columnWidth < 65 ? 'FER' : '🟣 Feriado $'}
                                </span>
                                ${this.columnWidth >= 85 ? `<span class="text-[7.5px] font-extrabold text-purple-300 leading-none mt-0.5 tracking-tight">Pausa</span>` : ''}
                            </div>
                        `;
                    }
                    if (dayStatus.isWeekend) {
                        return `
                            <div class="task-bar-pause-weekend h-full border-r border-slate-700/80 flex flex-col items-center justify-center p-0.5 overflow-hidden select-none"
                                 style="width: ${this.columnWidth}px;"
                                 title="Fin de Semana: ${dayStatus.name} (Descanso)">
                                <span class="px-1 py-0.2 rounded text-[7.5px] font-bold bg-slate-950/95 text-slate-300 border border-slate-600/90 shadow-md">
                                    ${this.columnWidth < 65 ? 'FIN' : '⏸️ Fin Sem'}
                                </span>
                                ${this.columnWidth >= 85 ? `<span class="text-[7.5px] font-bold text-slate-400 leading-none mt-0.5 tracking-tight">Descanso</span>` : ''}
                            </div>
                        `;
                    }
                    if (dayStatus.isHoliday && !dayStatus.isPaid) {
                        return `
                            <div class="task-bar-pause-holiday-unpaid h-full border-r border-rose-500/60 flex flex-col items-center justify-center p-0.5 overflow-hidden select-none"
                                 style="width: ${this.columnWidth}px;"
                                 title="Parada No Laborable">
                                <span class="px-1 py-0.2 rounded text-[7.5px] font-bold bg-rose-950/95 text-rose-200 border border-rose-400 shadow-md">
                                    ${this.columnWidth < 65 ? 'PAR' : '🔴 Parada'}
                                </span>
                            </div>
                        `;
                    }
                    return `<div class="h-full border-r border-slate-700/30" style="width: ${this.columnWidth}px;"></div>`;
                }).join('')}
            </div>
        ` : '';

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

        const laneWidth = totalTimelineWidth || ((calendarDates.length * this.columnWidth) + rowHandleWidth);

        return `
            <div class="task-lane relative flex items-center py-2 h-20 hover:bg-slate-800/30 transition-colors border-b border-slate-800/60 group" 
                 style="width: ${laneWidth}px;" 
                 data-task-id="${task.id}"
                 data-row-index="${rowIndex}">
                
                <!-- Tirador sticky para arrastrar e intercambiar fila en las 3 pestañas -->
                <div class="row-drag-handle sticky left-0 z-20 flex-shrink-0 flex items-center justify-center w-8 h-full bg-slate-900/95 hover:bg-slate-800 border-r border-slate-700/60 cursor-grab active:cursor-grabbing text-slate-400 hover:text-amber-400 group/handle select-none transition-colors"
                     title="Arrastra para intercambiar posición de fila con otra tarea"
                     draggable="${!isSupervision}"
                     data-task-id="${task.id}"
                     data-row-index="${rowIndex}">
                    <div class="flex flex-col items-center justify-center pointer-events-none">
                        <span class="text-[10px] font-mono font-bold text-slate-400 group-hover/handle:text-amber-400 leading-none">${rowIndex + 1}</span>
                        <i data-lucide="grip-vertical" class="w-3.5 h-3.5 text-slate-500 group-hover/handle:text-amber-400 mt-0.5"></i>
                    </div>
                </div>

                <!-- Columnas interactivas receptoras de Drag & Drop en el carril -->
                <div class="absolute inset-y-0 right-0 flex" style="left: ${rowHandleWidth}px;">
                    ${calendarDates.map(d => {
                        const dayStatus = this.store.getDayStatus(d);
                        let cellClass = '';
                        if (dayStatus.isHoliday && dayStatus.isPaid) {
                            cellClass = 'timeline-cell-holiday-paid';
                        } else if (dayStatus.isHoliday && !dayStatus.isPaid) {
                            cellClass = 'timeline-cell-holiday-unpaid';
                        } else if (dayStatus.isWeekend) {
                            cellClass = 'timeline-cell-weekend';
                        }
                        return `
                            <div class="timeline-grid-cell ${cellClass} border-r border-slate-800/60 h-full transition-colors" 
                                 style="width: ${this.columnWidth}px;" 
                                 data-date="${d}"></div>
                        `;
                    }).join('')}
                </div>

                ${isPlaced ? `
                    <!-- BARRA(S) DE TAREA INTERACTIVA(S) -->
                    <div class="timeline-bar-container absolute top-2 bottom-2 rounded-xl transition-all select-none cursor-pointer"
                         style="left: ${leftOffset + rowHandleWidth}px; width: ${barWidth}px;"
                         draggable="${!isSupervision}"
                         data-task-id="${task.id}"
                         title="${task.name} (${task.durationDays}d laborables${nonWorkingCount > 0 ? ` • ${calendarSpan}d corridos con ${nonWorkingCount}d de pausa no laborable` : ''})">

                        ${currentTab === 'comparativa' ? `
                            <!-- MODO COMPARATIVA: DOBLE BARRA (Línea Base vs Real) -->
                            <div class="h-full flex flex-col justify-between ${barWidth < 55 ? 'p-0.5' : 'p-1'} bg-slate-900/90 border-2 ${hasConflict ? 'border-red-500 shadow-red-500/20' : 'border-slate-700'} rounded-xl shadow-lg relative overflow-hidden">
                                
                                ${nonWorkingOverlayHtml}

                                <!-- Barra Superior: Estimado (Línea Base) -->
                                <div class="h-[42%] bg-slate-700/60 rounded border border-dashed border-slate-500/50 flex items-center justify-between ${barWidth < 55 ? 'px-1' : 'px-2'} text-[10px] text-slate-300 relative z-20">
                                    <span class="flex items-center gap-1 font-mono font-bold text-slate-400 truncate">
                                        ${barWidth < 55 ? `${task.durationDays}d` : `<i data-lucide="flag" class="w-2.5 h-2.5 text-blue-400"></i> Plan: ${task.durationDays}d lab (${calendarSpan}d)`}
                                    </span>
                                    ${barWidth >= 55 ? `<span class="font-mono text-[9px] text-slate-400">${estHH} HH</span>` : ''}
                                </div>

                                <!-- Barra Inferior: Real en Terreno -->
                                <div class="h-[52%] relative bg-slate-800 rounded flex items-center overflow-hidden border border-slate-600/80 z-20">
                                    <!-- Progreso real llenado -->
                                    <div class="absolute inset-y-0 left-0 ${hasConflict ? 'bg-gradient-to-r from-red-600 to-rose-500' : (task.progress >= 100 ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gradient-to-r from-emerald-600 to-teal-500')} opacity-90 transition-all"
                                         style="width: ${task.progress || 0}%;"></div>
                                    
                                    <!-- Texto superpuesto -->
                                    <div class="relative z-10 w-full ${barWidth < 55 ? 'px-1 justify-center' : 'px-2 justify-between'} flex items-center text-[10px] font-bold text-white">
                                        <span class="truncate ${barWidth >= 55 ? 'pr-1' : ''}">${barWidth < 55 ? `${task.progress || 0}%` : `${task.name} (${task.progress || 0}%)`}</span>
                                        ${barWidth >= 55 ? `
                                            <div class="flex items-center gap-1 font-mono text-[9px] flex-shrink-0">
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
                                        ` : ''}
                                    </div>
                                </div>

                            </div>
                        ` : `
                            <!-- MODO NORMAL (ESTIMADO O REAL): TARJETA GANTT -->
                            <div class="h-full bg-slate-800/95 hover:bg-slate-800 border-2 ${hasConflict ? 'border-red-500 ring-2 ring-red-500/20' : (task.progress >= 100 ? 'border-blue-500/80' : 'border-slate-700/80')} rounded-xl ${barWidth < 55 ? 'p-1' : 'p-2'} shadow-lg flex flex-col justify-between relative overflow-hidden group/bar cursor-pointer">
                                
                                <!-- Relleno de barra de progreso interna -->
                                <div class="absolute inset-y-0 left-0 ${hasConflict ? 'bg-red-500/20' : (task.progress >= 100 ? 'bg-blue-500/20' : 'bg-emerald-500/20')} pointer-events-none transition-all z-0"
                                     style="width: ${task.progress || 0}%;"></div>

                                ${nonWorkingOverlayHtml}

                                ${barWidth < 55 ? `
                                    <!-- FORMATO COMPACTO PARA ZOOM REDUCIDO / MÓVIL -->
                                    <div class="relative z-20 flex flex-col justify-center items-center h-full text-center pointer-events-none">
                                        <span class="text-[8px] font-mono font-bold leading-tight ${discipline.badgeClass} px-1 rounded truncate max-w-full">
                                            ${task.tag || 'TSK'}
                                        </span>
                                        <span class="text-[9px] font-mono font-extrabold ${task.progress >= 100 ? 'text-blue-400' : 'text-emerald-400'}">
                                            ${task.progress || 0}%
                                        </span>
                                    </div>
                                ` : `
                                    <!-- Cabecera de la tarjeta dentro de la barra -->
                                    <div class="relative z-20 flex items-center justify-between gap-2 pointer-events-none">
                                        <div class="flex items-center gap-1.5 truncate">
                                            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${discipline.badgeClass} border flex-shrink-0">
                                                ${task.tag || 'TSK'}
                                            </span>
                                            <span class="text-xs font-bold text-slate-100 truncate" title="${task.name}">
                                                ${task.name}
                                            </span>
                                        </div>
                                        <span class="text-[10px] font-mono font-extrabold flex-shrink-0 ${task.progress >= 100 ? 'text-blue-400' : 'text-emerald-400'}">
                                            ${task.progress || 0}%
                                        </span>
                                    </div>

                                    <!-- Footer de la barra con recursos -->
                                    <div class="relative z-20 flex items-center justify-between text-[10px] text-slate-400 font-medium pointer-events-none">
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
                                        <div class="flex items-center gap-1">
                                            <span class="text-[9px] bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono flex items-center gap-1" title="${task.durationDays} días laborables ejecutados en ${calendarSpan} días corridos">
                                                <i data-lucide="clock" class="w-2.5 h-2.5 text-amber-400"></i> ${task.durationDays}d lab (${calendarSpan}d)
                                            </span>
                                            ${nonWorkingCount > 0 ? `
                                                <span class="text-[8px] font-bold px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5" title="${nonWorkingCount} días no laborables (fines de semana / feriados) durante la ejecución de esta tarea">
                                                    <i data-lucide="pause-circle" class="w-2 h-2"></i> ${nonWorkingCount}d pausa
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>
                                `}

                            </div>
                        `}

                    </div>
                ` : `
                    <div class="text-xs text-slate-500 italic pl-4">No asignada al calendario</div>
                `}

            </div>
        `;
    }

    /**
     * Vincula listeners de Drag and Drop en las columnas de la cuadrícula
     */
    attachDropZones() {
        const isSupervision = this.store.state.isSupervisionMode;
        if (isSupervision) return;

        // 1. Columnas receptoras de Drop para programar fechas (calendario y cabecera)
        const dropTargets = this.container.querySelectorAll('.timeline-day-header, .timeline-grid-cell');
        dropTargets.forEach(col => {
            col.addEventListener('dragover', (e) => {
                if (this.draggedRowTaskId) return; // Si se arrastra una fila completa, ignorar celdas de fecha
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                col.classList.add('bg-amber-500/20');
            });

            col.addEventListener('dragleave', () => {
                col.classList.remove('bg-amber-500/20');
            });

            col.addEventListener('drop', (e) => {
                if (this.draggedRowTaskId) return; // Si se arrastra una fila completa, no cambiar fechas
                e.preventDefault();
                col.classList.remove('bg-amber-500/20');
                const targetDate = col.dataset.date;
                const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;
                if (taskId && targetDate) {
                    this.store.scheduleTask(taskId, targetDate);
                }
            });
        });

        // 2. Barras existentes en el timeline para arrastrar y cambiar fecha
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

        // 3. Arrastre de filas para intercambiar posición (disponible en las 3 pestañas: Estimado, Real y Comparativa)
        this.container.querySelectorAll('.row-drag-handle').forEach(handle => {
            handle.addEventListener('dragstart', (e) => {
                const taskId = handle.dataset.taskId;
                this.draggedRowTaskId = taskId;
                e.dataTransfer.setData('application/x-task-row', taskId);
                e.dataTransfer.setData('text/plain', taskId);
                e.dataTransfer.effectAllowed = 'move';
                const lane = handle.closest('.task-lane');
                if (lane) {
                    lane.classList.add('opacity-40', 'ring-2', 'ring-amber-500');
                }
            });

            handle.addEventListener('dragend', () => {
                const lane = handle.closest('.task-lane');
                if (lane) {
                    lane.classList.remove('opacity-40', 'ring-2', 'ring-amber-500');
                }
                this.draggedRowTaskId = null;
                this.container.querySelectorAll('.task-lane').forEach(l => {
                    l.classList.remove('bg-amber-500/20', 'ring-2', 'ring-amber-400', 'ring-inset');
                });
            });
        });

        // Receptores de drop en los carriles para intercambiar filas
        this.container.querySelectorAll('.task-lane').forEach(lane => {
            lane.addEventListener('dragover', (e) => {
                if (!this.draggedRowTaskId) return;
                const targetTaskId = lane.dataset.taskId;
                if (targetTaskId && targetTaskId !== this.draggedRowTaskId) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    lane.classList.add('bg-amber-500/20', 'ring-2', 'ring-amber-400', 'ring-inset');
                }
            });

            lane.addEventListener('dragleave', (e) => {
                if (!lane.contains(e.relatedTarget)) {
                    lane.classList.remove('bg-amber-500/20', 'ring-2', 'ring-amber-400', 'ring-inset');
                }
            });

            lane.addEventListener('drop', (e) => {
                if (!this.draggedRowTaskId) return;
                e.preventDefault();
                lane.classList.remove('bg-amber-500/20', 'ring-2', 'ring-amber-400', 'ring-inset');
                const targetTaskId = lane.dataset.taskId;
                const sourceTaskId = this.draggedRowTaskId;
                this.draggedRowTaskId = null;
                if (sourceTaskId && targetTaskId && sourceTaskId !== targetTaskId) {
                    const swapped = this.store.swapTasks(sourceTaskId, targetTaskId);
                    if (swapped && window.appToast) {
                        window.appToast.success('Posición de tareas intercambiada');
                    }
                }
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
        if (typeof document !== 'undefined') {
            const printStyle = document.getElementById('dynamic-print-page-style');
            if (printStyle) printStyle.remove();
        }
    }

    setPrintPageOrientation(orientation = 'portrait') {
        if (typeof document === 'undefined') return;
        let styleTag = document.getElementById('dynamic-print-page-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-print-page-style';
            document.head.appendChild(styleTag);
        }
        const pageSize = orientation === 'landscape' ? 'landscape' : 'portrait';
        const pageMargin = orientation === 'landscape' ? '6mm 8mm' : '8mm';
        styleTag.textContent = `@media print {
            @page { size: ${pageSize}; margin: ${pageMargin}; }
            body > *:not(#modal-root),
            body > header,
            body > section,
            body > nav,
            body > main,
            body > footer,
            body > aside,
            header,
            section,
            nav,
            main,
            footer,
            aside {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
        }`;
    }

    /**
     * Devuelve el esquema cromático de alta legibilidad para impresión según la disciplina de la tarea,
     * alineado con los colores de las tarjetas y barras visualizadas en la pantalla de la app.
     */
    getDisciplineStyle(disciplineId) {
        const disciplines = this.store.getDisciplines();
        const disc = (disciplines || []).find(d => d.id === disciplineId) || {};
        const color = disc.color || (disciplineId === 'piping' ? 'blue' :
                                    disciplineId === 'estructura' ? 'amber' :
                                    disciplineId === 'equipos' ? 'purple' :
                                    disciplineId === 'soldadura' ? 'orange' :
                                    disciplineId === 'end' ? 'emerald' :
                                    disciplineId === 'pruebas' ? 'cyan' : 'blue');

        switch (color) {
            case 'amber':
            case 'yellow':
                return {
                    name: disc.name || 'Estructuras Metálicas',
                    bgClass: 'bg-amber-500',
                    borderClass: 'border-amber-700',
                    textClass: 'text-slate-950 font-black',
                    hex: '#f59e0b',
                    borderHex: '#b45309',
                    textHex: '#0f172a',
                    tagBg: '#fef3c7',
                    tagText: '#92400e',
                    tagBorder: '#fcd34d'
                };
            case 'purple':
            case 'indigo':
            case 'violet':
                return {
                    name: disc.name || 'Montaje de Equipos',
                    bgClass: 'bg-purple-600',
                    borderClass: 'border-purple-800',
                    textClass: 'text-white font-bold',
                    hex: '#9333ea',
                    borderHex: '#7e22ce',
                    textHex: '#ffffff',
                    tagBg: '#f3e8ff',
                    tagText: '#6b21a8',
                    tagBorder: '#d8b4fe'
                };
            case 'orange':
            case 'red':
                return {
                    name: disc.name || 'Soldadura Especial',
                    bgClass: 'bg-orange-600',
                    borderClass: 'border-orange-800',
                    textClass: 'text-white font-bold',
                    hex: '#ea580c',
                    borderHex: '#c2410c',
                    textHex: '#ffffff',
                    tagBg: '#ffedd5',
                    tagText: '#9a3412',
                    tagBorder: '#fdba74'
                };
            case 'emerald':
            case 'green':
            case 'teal':
                return {
                    name: disc.name || 'Ensayos No Destructivos (END)',
                    bgClass: 'bg-emerald-600',
                    borderClass: 'border-emerald-800',
                    textClass: 'text-white font-bold',
                    hex: '#059669',
                    borderHex: '#047857',
                    textHex: '#ffffff',
                    tagBg: '#d1fae5',
                    tagText: '#065f46',
                    tagBorder: '#6ee7b7'
                };
            case 'cyan':
                return {
                    name: disc.name || 'Pruebas y Comisionado',
                    bgClass: 'bg-cyan-600',
                    borderClass: 'border-cyan-800',
                    textClass: 'text-white font-bold',
                    hex: '#0891b2',
                    borderHex: '#0e7490',
                    textHex: '#ffffff',
                    tagBg: '#cffafe',
                    tagText: '#155e75',
                    tagBorder: '#67e8f9'
                };
            case 'blue':
            case 'sky':
            default:
                return {
                    name: disc.name || 'Cañería (Piping)',
                    bgClass: 'bg-blue-600',
                    borderClass: 'border-blue-800',
                    textClass: 'text-white font-bold',
                    hex: '#2563eb',
                    borderHex: '#1d4ed8',
                    textHex: '#ffffff',
                    tagBg: '#dbeafe',
                    tagText: '#1e40af',
                    tagBorder: '#93c5fd'
                };
        }
    }

    /**
     * Dispara la impresión nativa desactivando temporalmente el modo dark en la raíz
     * para asegurar fondo 100% blanco y textos negros de máximo contraste en PDF y papel
     */
    triggerPrint() {
        if (typeof document === 'undefined' || typeof window === 'undefined') return;
        const htmlEl = document.documentElement;
        const wasDark = htmlEl.classList.contains('dark');
        if (wasDark) htmlEl.classList.remove('dark');

        let restored = false;
        const restoreTheme = () => {
            if (restored) return;
            restored = true;
            if (wasDark) htmlEl.classList.add('dark');
            window.removeEventListener('afterprint', restoreTheme);
        };

        window.addEventListener('afterprint', restoreTheme);

        // Pequeño delay de 50ms para que el navegador repinte el fondo blanco antes de abrir el diálogo de impresión
        setTimeout(() => {
            window.print();
            // Respaldo de seguridad por si afterprint no dispara en el navegador
            setTimeout(restoreTheme, 1500);
        }, 50);
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

        const disciplines = this.store.getDisciplines();
        const catalogs = this.store.getCatalogs();
        const laborCatalog = catalogs.labor || [];
        const machineryCatalog = [
            ...(catalogs.machinery || []).map(m => ({ ...m, _cat: 'machinery' })),
            ...(catalogs.equipment || []).map(e => ({ ...e, _cat: 'equipment' }))
        ];

        const assignedLabor = Object.entries(task.labor || {}).filter(([_, h]) => h > 0);
        const assignedMachinery = Object.entries({ ...(task.machinery || {}), ...(task.equipment || {}) }).filter(([_, h]) => h > 0);

        let deviationBadgeHtml = '';
        const estStart = task.estimatedStart;
        const realStart = task.realStart;
        if (estStart && realStart) {
            const [ey, em, ed] = estStart.split('-').map(Number);
            const [ry, rm, rd] = realStart.split('-').map(Number);
            const diffDays = Math.round((new Date(ry, rm - 1, rd, 12) - new Date(ey, em - 1, ed, 12)) / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                deviationBadgeHtml = `<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">+${diffDays}d atraso inicio</span>`;
            } else if (diffDays < 0) {
                deviationBadgeHtml = `<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">${Math.abs(diffDays)}d adelanto inicio</span>`;
            } else {
                deviationBadgeHtml = `<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Inicio según plan</span>`;
            }
        }

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

                        <!-- Disciplina y Fechas Estimadas (Línea Base) -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Disciplina</label>
                                <select name="discipline" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                                    ${disciplines.map(d => `<option value="${d.id}" ${d.id === task.discipline ? 'selected' : ''}>${d.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Duración Prevista (Días)</label>
                                <input type="number" name="durationDays" min="1" max="60" value="${task.durationDays || 3}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono" required ${isSupervision ? 'disabled' : ''}>
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1 text-cyan-400">📅 Inicio Estimado (Línea Base)</label>
                                <input type="date" name="estimatedStart" value="${task.estimatedStart || ''}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                            </div>
                        </div>

                        <!-- Ejecución en Terreno (Fechas Reales vs Plan) -->
                        <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                            <div class="flex items-center justify-between mb-2">
                                <h5 class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                    <i data-lucide="calendar-clock" class="w-4 h-4"></i> Ejecución en Terreno (Fechas Reales)
                                </h5>
                                ${deviationBadgeHtml}
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Fecha Inicio Real</label>
                                    <input type="date" name="realStart" value="${task.realStart || ''}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                                </div>
                                <div>
                                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Fecha Fin Real (o Cierre Estimado)</label>
                                    <input type="date" name="realEnd" value="${task.realEnd || ''}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-amber-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                                </div>
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

                        <!-- Recursos: Mano de Obra (Horas-Hombre) con Menú Desplegable -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                                    <i data-lucide="users" class="w-4 h-4"></i> Mano de Obra (Horas-Hombre totales)
                                </h4>
                                ${!isSupervision ? `
                                    <button type="button" id="btn-add-labor-row" class="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all">
                                        <i data-lucide="plus" class="w-3.5 h-3.5"></i> + Asignar Especialidad
                                    </button>
                                ` : ''}
                            </div>
                            <div id="task-labor-rows-container" class="space-y-2">
                                <!-- Filas dinámicas generadas abajo -->
                            </div>
                        </div>

                        <!-- Recursos: Maquinaria y Equipos con Menú Desplegable -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider text-orange-400">
                                    <i data-lucide="truck" class="w-4 h-4"></i> Equipos y Maquinarias (Horas de uso)
                                </h4>
                                ${!isSupervision ? `
                                    <button type="button" id="btn-add-mach-row" class="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all">
                                        <i data-lucide="plus" class="w-3.5 h-3.5"></i> + Asignar Equipo
                                    </button>
                                ` : ''}
                            </div>
                            <div id="task-mach-rows-container" class="space-y-2">
                                <!-- Filas dinámicas generadas abajo -->
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

        // Renderizar filas dinámicas de Mano de Obra
        const laborContainer = document.getElementById('task-labor-rows-container');
        const appendLaborRow = (resId = '', hours = 8) => {
            if (!laborContainer) return;
            const row = document.createElement('div');
            row.className = 'labor-row flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700';
            const selectedId = resId || (laborCatalog[0]?.id || '');
            row.innerHTML = `
                <div class="flex-grow">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Especialidad de Mano de Obra</label>
                    <select class="labor-select-id w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-cyan-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                        ${laborCatalog.map(r => `<option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>${r.name} (${r.unit || 'HH'})</option>`).join('')}
                    </select>
                </div>
                <div class="w-28 flex-shrink-0">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Horas (HH)</label>
                    <input type="number" min="0" step="1" value="${hours}" class="labor-input-hours w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-center text-xs focus:border-cyan-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                </div>
                ${!isSupervision ? `
                    <div class="pt-3.5 flex-shrink-0">
                        <button type="button" class="btn-remove-labor-row p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Quitar especialidad">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                ` : ''}
            `;
            laborContainer.appendChild(row);
            row.querySelector('.btn-remove-labor-row')?.addEventListener('click', () => row.remove());
            if (window.lucide) window.lucide.createIcons();
        };

        if (assignedLabor.length > 0) {
            assignedLabor.forEach(([rId, h]) => appendLaborRow(rId, h));
        } else if (!isSupervision && laborCatalog.length > 0) {
            appendLaborRow(laborCatalog[0]?.id || 'supervisor', 8);
        }

        document.getElementById('btn-add-labor-row')?.addEventListener('click', () => {
            appendLaborRow('', 8);
        });

        // Renderizar filas dinámicas de Maquinaria y Equipos
        const machContainer = document.getElementById('task-mach-rows-container');
        const appendMachRow = (resId = '', hours = 4) => {
            if (!machContainer) return;
            const row = document.createElement('div');
            row.className = 'mach-row flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700';
            const selectedId = resId || (machineryCatalog[0]?.id || '');
            row.innerHTML = `
                <div class="flex-grow">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Equipo / Maquinaria</label>
                    <select class="mach-select-id w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-orange-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                        ${machineryCatalog.map(r => `<option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>${r.name} (${r.unit || 'hs'})</option>`).join('')}
                    </select>
                </div>
                <div class="w-28 flex-shrink-0">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Horas de Uso</label>
                    <input type="number" min="0" step="1" value="${hours}" class="mach-input-hours w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-center text-xs focus:border-orange-500 focus:outline-none" ${isSupervision ? 'disabled' : ''}>
                </div>
                ${!isSupervision ? `
                    <div class="pt-3.5 flex-shrink-0">
                        <button type="button" class="btn-remove-mach-row p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Quitar equipo">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                ` : ''}
            `;
            machContainer.appendChild(row);
            row.querySelector('.btn-remove-mach-row')?.addEventListener('click', () => row.remove());
            if (window.lucide) window.lucide.createIcons();
        };

        if (assignedMachinery.length > 0) {
            assignedMachinery.forEach(([rId, h]) => appendMachRow(rId, h));
        }

        document.getElementById('btn-add-mach-row')?.addEventListener('click', () => {
            appendMachRow('', 4);
        });

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
                document.querySelectorAll('#task-labor-rows-container .labor-row').forEach(row => {
                    const sel = row.querySelector('.labor-select-id');
                    const inp = row.querySelector('.labor-input-hours');
                    if (sel && inp) {
                        const id = sel.value;
                        const val = parseFloat(inp.value) || 0;
                        if (id && val > 0) {
                            laborUpdates[id] = (laborUpdates[id] || 0) + val;
                        }
                    }
                });

                const machUpdates = {};
                const equipUpdates = {};
                document.querySelectorAll('#task-mach-rows-container .mach-row').forEach(row => {
                    const sel = row.querySelector('.mach-select-id');
                    const inp = row.querySelector('.mach-input-hours');
                    if (sel && inp) {
                        const id = sel.value;
                        const val = parseFloat(inp.value) || 0;
                        if (id && val > 0) {
                            const isEquip = (catalogs.equipment || []).some(e => e.id === id);
                            if (isEquip) {
                                equipUpdates[id] = (equipUpdates[id] || 0) + val;
                            } else {
                                machUpdates[id] = (machUpdates[id] || 0) + val;
                            }
                        }
                    }
                });

                const updated = {
                    name: formData.get('name'),
                    tag: formData.get('tag'),
                    discipline: formData.get('discipline'),
                    durationDays: parseInt(formData.get('durationDays')) || 3,
                    estimatedStart: formData.get('estimatedStart') || null,
                    realStart: formData.get('realStart') || null,
                    realEnd: formData.get('realEnd') || null,
                    progress: parseInt(formData.get('progress')) || 0,
                    notes: formData.get('notes') || '',
                    labor: laborUpdates,
                    machinery: machUpdates,
                    equipment: equipUpdates
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
        const currentMachinery = { ...(task.realMachinery || {}), ...(task.realEquipment || {}) };
        const catalogs = this.store.getCatalogs();
        const laborCatalog = catalogs.labor || [];
        const machineryCatalog = [
            ...(catalogs.machinery || []).map(m => ({ ...m, _cat: 'machinery' })),
            ...(catalogs.equipment || []).map(e => ({ ...e, _cat: 'equipment' }))
        ];

        // Identificar recursos relevantes para esta tarea
        const activeLabor = laborCatalog.filter(res => {
            return (task.labor && task.labor[res.id] > 0) || (currentLabor[res.id] > 0);
        });
        const laborToShow = activeLabor.length > 0 ? activeLabor : laborCatalog.slice(0, 3);

        const activeMachinery = machineryCatalog.filter(res => {
            return (task.machinery && task.machinery[res.id] > 0) || 
                   (task.equipment && task.equipment[res.id] > 0) || 
                   (currentMachinery[res.id] > 0);
        });

        const defaultDate = this.store.getProjectCutoffDate();

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
                        
                        <!-- Fecha de Jornada Reportada -->
                        <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-200">Fecha del Parte Diario</label>
                                <span class="text-[10px] text-slate-400">Jornada laboral imputada</span>
                            </div>
                            <input type="date" id="daily-log-date" value="${defaultDate}" class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none">
                        </div>

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
                            <div id="daily-labor-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${laborToShow.map(res => {
                                    const accum = currentLabor[res.id] || 0;
                                    const est = (task.labor && task.labor[res.id]) || 0;
                                    return `
                                        <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 daily-labor-item" data-res-id="${res.id}">
                                            <div class="flex items-center justify-between text-[10px] mb-1">
                                                <span class="text-slate-300 font-semibold truncate" title="${res.name}">${res.name.split('(')[0]}</span>
                                                <span class="text-slate-500 font-mono">${accum}/${est}h</span>
                                            </div>
                                            <input type="number" min="0" step="0.5" id="daily-hh-${res.id}" class="daily-hh-input w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-emerald-500 focus:outline-none" placeholder="+0 HH">
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Cargar Maquinaria Pesada / Equipos de Montaje -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="block font-bold text-slate-300 mb-1 flex items-center gap-1 text-orange-400">
                                    <i data-lucide="truck" class="w-3.5 h-3.5"></i> Horas de Equipos / Maquinarias Hoy
                                </label>
                                <span class="text-[10px] text-slate-400">Se suman al acumulado real</span>
                            </div>
                            <div id="daily-mach-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${activeMachinery.length > 0 ? activeMachinery.map(res => {
                                    const accum = currentMachinery[res.id] || 0;
                                    const est = (task.machinery && task.machinery[res.id]) || (task.equipment && task.equipment[res.id]) || 0;
                                    return `
                                        <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 daily-mach-item" data-res-id="${res.id}">
                                            <div class="flex items-center justify-between text-[10px] mb-1">
                                                <span class="text-slate-300 font-semibold truncate" title="${res.name}">${res.name.split('(')[0]}</span>
                                                <span class="text-slate-500 font-mono">${accum}/${est}hs</span>
                                            </div>
                                            <input type="number" min="0" step="0.5" id="daily-mach-${res.id}" class="daily-mach-input w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-orange-500 focus:outline-none" placeholder="+0 hs">
                                        </div>
                                    `;
                                }).join('') : `<p id="no-mach-notice" class="text-slate-500 text-[11px] italic py-1 sm:col-span-2">Sin equipos asignados originalmente (puedes imputar desde el selector inferior).</p>`}
                            </div>
                        </div>

                        <!-- Selector Menú Desplegable para Imputar Recursos Adicionales en Parte Diario -->
                        <div class="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80">
                            <label class="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
                                <i data-lucide="plus-circle" class="w-3.5 h-3.5 text-emerald-400"></i> Imputar Recurso / Mano de Obra a la Jornada
                            </label>
                            <div class="flex flex-col sm:flex-row gap-2">
                                <select id="select-daily-extra-resource" class="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs focus:border-emerald-500 focus:outline-none">
                                    <optgroup label="👷 Especialidades de Mano de Obra">
                                        ${laborCatalog.map(r => `<option value="labor:${r.id}">${r.name} (${r.unit || 'HH'})</option>`).join('')}
                                    </optgroup>
                                    <optgroup label="🚜 Equipos y Maquinarias">
                                        ${machineryCatalog.map(r => `<option value="mach:${r.id}">${r.name} (${r.unit || 'hs'})</option>`).join('')}
                                    </optgroup>
                                </select>
                                <button type="button" id="btn-add-extra-daily-resource" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all whitespace-nowrap">
                                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> Agregar a Jornada
                                </button>
                            </div>
                        </div>

                        <!-- Novedades de Campo -->
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Novedad / Observaciones de Jornada</label>
                            <input type="text" id="daily-note" placeholder="Ej: Soldadura de 4 juntas completadas con éxito; viento normal" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-emerald-500 text-xs">
                        </div>

                        <!-- Historial de Partes Anteriores -->
                        <!-- Historial de Partes Anteriores con Edición y Eliminación -->
                        ${(task.dailyLogs && task.dailyLogs.length > 0) ? `
                            <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                                <div class="flex items-center justify-between mb-2">
                                    <h5 class="font-bold text-slate-300 flex items-center gap-1.5 text-xs text-emerald-400">
                                        <i data-lucide="history" class="w-3.5 h-3.5"></i> Historial de Partes Asentados (${task.dailyLogs.length})
                                    </h5>
                                    <span class="text-[10px] text-slate-400">Corrección de horas o partes erróneos</span>
                                </div>
                                <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                    ${task.dailyLogs.map(l => `
                                        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 text-[11px] transition-all" data-log-id="${l.id}">
                                            <div class="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                                                <div class="flex items-center gap-2">
                                                    <span class="text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">${l.date}</span>
                                                    <span>Avance: <strong class="text-white">${l.progress}%</strong></span>
                                                </div>
                                                <div class="flex items-center gap-1">
                                                    <button type="button" class="btn-edit-daily-log px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer" data-task-id="${task.id}" data-log-id="${l.id}" title="Editar horas o datos de este parte">
                                                        <i data-lucide="edit-2" class="w-3 h-3"></i> Editar
                                                    </button>
                                                    <button type="button" class="btn-delete-daily-log px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer" data-task-id="${task.id}" data-log-id="${l.id}" title="Eliminar este parte">
                                                        <i data-lucide="trash-2" class="w-3 h-3"></i> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                            ${l.notes ? `<p class="text-slate-300 text-[11px] italic mb-1.5 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/60">"${l.notes}"</p>` : ''}
                                            <div class="flex flex-wrap gap-1 text-[9px] font-mono">
                                                ${Object.entries(l.labor || {}).map(([rId, h]) => `<span class="bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-800 text-cyan-300 font-bold">${rId}: +${h}h</span>`).join(' ')}
                                                ${Object.entries(l.machinery || {}).map(([mId, h]) => `<span class="bg-orange-950/90 px-1.5 py-0.5 rounded border border-orange-800 text-orange-300 font-bold">${mId}: +${h}hs</span>`).join(' ')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

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

        // Manejo del selector desplegable de recursos extra en Parte Diario
        const btnAddExtra = document.getElementById('btn-add-extra-daily-resource');
        if (btnAddExtra) {
            btnAddExtra.addEventListener('click', () => {
                const sel = document.getElementById('select-daily-extra-resource');
                if (!sel) return;
                const [cat, resId] = sel.value.split(':');
                if (cat === 'labor') {
                    const res = laborCatalog.find(r => r.id === resId);
                    if (!res) return;
                    const existingInp = document.getElementById(`daily-hh-${res.id}`);
                    if (existingInp) {
                        existingInp.focus();
                        existingInp.classList.add('ring-2', 'ring-emerald-400');
                        setTimeout(() => existingInp.classList.remove('ring-2', 'ring-emerald-400'), 1500);
                        return;
                    }
                    const container = document.getElementById('daily-labor-container');
                    const item = document.createElement('div');
                    item.className = 'bg-slate-800/80 p-2.5 rounded-xl border border-emerald-500/50 daily-labor-item animate-fade-in';
                    item.dataset.resId = res.id;
                    item.innerHTML = `
                        <div class="flex items-center justify-between text-[10px] mb-1">
                            <span class="text-emerald-400 font-bold truncate" title="${res.name}">✨ ${res.name.split('(')[0]}</span>
                            <span class="text-slate-400 font-mono">${currentLabor[res.id] || 0}/0h</span>
                        </div>
                        <input type="number" min="0" step="0.5" id="daily-hh-${res.id}" class="daily-hh-input w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-emerald-500 focus:outline-none" placeholder="+0 HH">
                    `;
                    container.appendChild(item);
                    document.getElementById(`daily-hh-${res.id}`)?.focus();
                } else if (cat === 'mach') {
                    const res = machineryCatalog.find(r => r.id === resId);
                    if (!res) return;
                    const existingInp = document.getElementById(`daily-mach-${res.id}`);
                    if (existingInp) {
                        existingInp.focus();
                        existingInp.classList.add('ring-2', 'ring-orange-400');
                        setTimeout(() => existingInp.classList.remove('ring-2', 'ring-orange-400'), 1500);
                        return;
                    }
                    const notice = document.getElementById('no-mach-notice');
                    if (notice) notice.remove();
                    const container = document.getElementById('daily-mach-container');
                    const item = document.createElement('div');
                    item.className = 'bg-slate-800/80 p-2.5 rounded-xl border border-orange-500/50 daily-mach-item animate-fade-in';
                    item.dataset.resId = res.id;
                    item.innerHTML = `
                        <div class="flex items-center justify-between text-[10px] mb-1">
                            <span class="text-orange-400 font-bold truncate" title="${res.name}">✨ ${res.name.split('(')[0]}</span>
                            <span class="text-slate-400 font-mono">${currentMachinery[res.id] || 0}/0hs</span>
                        </div>
                        <input type="number" min="0" step="0.5" id="daily-mach-${res.id}" class="daily-mach-input w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-orange-500 focus:outline-none" placeholder="+0 hs">
                    `;
                    container.appendChild(item);
                    document.getElementById(`daily-mach-${res.id}`)?.focus();
                }
            });
        }

        // Listeners para editar o eliminar partes diarios asentados
        this.modalRoot.querySelectorAll('.btn-edit-daily-log').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = btn.dataset.taskId;
                const lid = btn.dataset.logId;
                this.openEditDailyLogModal(tid, lid);
            });
        });

        this.modalRoot.querySelectorAll('.btn-delete-daily-log').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = btn.dataset.taskId;
                const lid = btn.dataset.logId;
                const targetLog = task.dailyLogs?.find(l => l.id === lid);
                const dateStr = targetLog ? targetLog.date : '';
                if (confirm(`¿Eliminar el parte diario del ${dateStr}? Se descontarán las horas asentadas en esa jornada y se recalculará el avance de la tarea.`)) {
                    const ok = this.store.deleteDailyLog(tid, lid);
                    if (ok) {
                        this.showToast('Parte diario eliminado correctamente.');
                        this.openDailyLog(tid);
                    }
                }
            });
        });

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const submitBtn = document.getElementById('btn-submit-daily');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const logDate = document.getElementById('daily-log-date')?.value || defaultDate;
                const note = document.getElementById('daily-note').value;
                
                // Mano de obra acumulando únicamente lo reportado hoy
                const laborLogged = {};
                document.querySelectorAll('#daily-labor-container .daily-labor-item').forEach(item => {
                    const rId = item.dataset.resId;
                    const input = document.getElementById(`daily-hh-${rId}`);
                    const val = input ? parseFloat(input.value) : 0;
                    if (val > 0) {
                        laborLogged[rId] = val;
                    }
                });

                // Maquinaria acumulando hoy
                const machLogged = {};
                document.querySelectorAll('#daily-mach-container .daily-mach-item').forEach(item => {
                    const rId = item.dataset.resId;
                    const input = document.getElementById(`daily-mach-${rId}`);
                    const val = input ? parseFloat(input.value) : 0;
                    if (val > 0) {
                        machLogged[rId] = val;
                    }
                });

                this.store.addDailyLog(taskId, {
                    date: logDate,
                    progress: currentProgress,
                    labor: laborLogged,
                    machinery: machLogged,
                    notes: note
                });

                this.showToast(`Parte diario asentado para el ${logDate}: Avance al ${currentProgress}%`);
                this.closeModal();
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Modal para editar un Parte Diario ya asentado (corregir horas mal cargadas, avance o fecha)
     */
    openEditDailyLogModal(taskId, logId) {
        const project = this.store.getActiveProject();
        if (!project) return;
        let task = project.tasks.find(t => t.id === taskId);
        if (!task && project.backlog) task = project.backlog.find(t => t.id === taskId);
        if (!task || !task.dailyLogs) return;

        const log = task.dailyLogs.find(l => l.id === logId);
        if (!log) return;

        const laborCatalog = this.store.getCatalogItems('labor');
        const machineryCatalog = this.store.getCatalogItems('machinery');

        // Recursos de mano de obra para editar
        const laborKeys = Array.from(new Set([
            ...Object.keys(log.labor || {}),
            ...Object.keys(task.labor || {})
        ]));
        const laborToShow = laborKeys.map(k => {
            return laborCatalog.find(r => r.id === k) || { id: k, name: k, unit: 'HH' };
        });

        // Maquinarias para editar
        const machKeys = Array.from(new Set([
            ...Object.keys(log.machinery || {}),
            ...Object.keys(task.machinery || {}),
            ...Object.keys(task.equipment || {})
        ]));
        const machToShow = machKeys.map(k => {
            return machineryCatalog.find(r => r.id === k) || { id: k, name: k, unit: 'hs' };
        });

        let currentProgress = log.progress !== undefined ? log.progress : (task.progress || 0);

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
                <div class="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    
                    <div class="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="edit-3" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <h3 class="text-sm font-bold text-white">Editar Parte Diario Asentado</h3>
                                <p class="text-[11px] text-slate-400 truncate max-w-[280px]">${task.tag ? `[${task.tag}] ` : ''}${task.name}</p>
                            </div>
                        </div>
                        <button type="button" class="btn-cancel-edit text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800" title="Volver al Parte Diario">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-4 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-grow">
                        
                        <!-- Fecha del Parte -->
                        <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-200">Fecha del Parte Diario</label>
                                <span class="text-[10px] text-slate-400">Jornada laboral imputada</span>
                            </div>
                            <input type="date" id="edit-daily-date" value="${log.date || ''}" class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:border-amber-500 focus:outline-none">
                        </div>

                        <!-- Avance Físico -->
                        <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-bold text-slate-200">Avance Físico Reportado:</span>
                                <span id="edit-quick-pct-label" class="font-mono font-bold text-amber-400 text-sm">${currentProgress}%</span>
                            </div>
                            <div class="grid grid-cols-5 gap-1.5 mb-2">
                                <button type="button" class="btn-edit-set-pct py-1.5 bg-slate-700 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors cursor-pointer" data-pct="25">25%</button>
                                <button type="button" class="btn-edit-set-pct py-1.5 bg-slate-700 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors cursor-pointer" data-pct="50">50%</button>
                                <button type="button" class="btn-edit-set-pct py-1.5 bg-slate-700 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors cursor-pointer" data-pct="75">75%</button>
                                <button type="button" class="btn-edit-set-pct py-1.5 bg-slate-700 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors cursor-pointer" data-pct="100">100%</button>
                                <button type="button" class="btn-edit-adjust-pct py-1.5 bg-slate-700 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors cursor-pointer" data-adjust="10">+10%</button>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-[11px] text-slate-400">Ajuste manual:</label>
                                <input type="number" min="0" max="100" id="edit-daily-progress-input" value="${currentProgress}" class="w-20 bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-amber-500 focus:outline-none">
                                <span class="text-slate-400">%</span>
                            </div>
                        </div>

                        <!-- Horas-Hombre de la Jornada -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="font-bold text-slate-300 flex items-center gap-1">
                                    <i data-lucide="users" class="w-3.5 h-3.5 text-cyan-400"></i> Horas-Hombre Asentadas en esta Jornada
                                </label>
                                <span class="text-[10px] text-slate-400">Modifica el valor para corregir el acumulado</span>
                            </div>
                            <div id="edit-daily-labor-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${laborToShow.map(res => {
                                    const loggedHrs = (log.labor && log.labor[res.id]) !== undefined ? log.labor[res.id] : 0;
                                    return `
                                        <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 edit-daily-labor-item" data-res-id="${res.id}">
                                            <div class="flex items-center justify-between text-[10px] mb-1">
                                                <span class="text-slate-300 font-semibold truncate" title="${res.name}">${res.name.split('(')[0]}</span>
                                                <span class="text-cyan-400 font-mono font-bold">${loggedHrs} HH</span>
                                            </div>
                                            <input type="number" min="0" step="0.5" id="edit-daily-hh-${res.id}" class="edit-daily-hh-input w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-amber-500 focus:outline-none" value="${loggedHrs}">
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Horas de Maquinarias / Equipos -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="block font-bold text-slate-300 mb-1 flex items-center gap-1 text-orange-400">
                                    <i data-lucide="truck" class="w-3.5 h-3.5"></i> Horas de Equipos / Maquinarias
                                </label>
                                <span class="text-[10px] text-slate-400">Modifica el valor para corregir el acumulado</span>
                            </div>
                            <div id="edit-daily-mach-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                ${machToShow.length > 0 ? machToShow.map(res => {
                                    const loggedHrs = (log.machinery && log.machinery[res.id]) !== undefined ? log.machinery[res.id] : 0;
                                    return `
                                        <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 edit-daily-mach-item" data-res-id="${res.id}">
                                            <div class="flex items-center justify-between text-[10px] mb-1">
                                                <span class="text-slate-300 font-semibold truncate" title="${res.name}">${res.name.split('(')[0]}</span>
                                                <span class="text-orange-400 font-mono font-bold">${loggedHrs} hs</span>
                                            </div>
                                            <input type="number" min="0" step="0.5" id="edit-daily-mach-${res.id}" class="edit-daily-mach-input w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-mono text-center text-xs focus:border-amber-500 focus:outline-none" value="${loggedHrs}">
                                        </div>
                                    `;
                                }).join('') : `<p class="text-slate-500 text-[11px] italic py-1 sm:col-span-2">Sin equipos asignados en este parte.</p>`}
                            </div>
                        </div>

                        <!-- Novedad / Observaciones -->
                        <div>
                            <label class="block font-semibold text-slate-300 mb-1">Novedad / Observaciones de Jornada</label>
                            <input type="text" id="edit-daily-note" value="${(log.notes || '').replace(/"/g, '&quot;')}" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500 text-xs">
                        </div>

                    </div>

                    <div class="p-3 bg-slate-800/80 border-t border-slate-700 flex justify-between items-center gap-2">
                        <button type="button" class="btn-cancel-edit px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer">
                            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Volver
                        </button>
                        <button type="button" id="btn-save-edit-daily" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer">
                            <i data-lucide="check" class="w-4 h-4"></i> Guardar Corrección
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        // Listeners para botones de porcentaje
        const pctLabel = document.getElementById('edit-quick-pct-label');
        const pctInput = document.getElementById('edit-daily-progress-input');

        this.modalRoot.querySelectorAll('.btn-edit-set-pct').forEach(btn => {
            btn.addEventListener('click', () => {
                currentProgress = parseInt(btn.dataset.pct);
                if (pctLabel) pctLabel.textContent = `${currentProgress}%`;
                if (pctInput) pctInput.value = currentProgress;
            });
        });

        this.modalRoot.querySelectorAll('.btn-edit-adjust-pct').forEach(btn => {
            btn.addEventListener('click', () => {
                const adj = parseInt(btn.dataset.adjust);
                currentProgress = Math.min(100, Math.max(0, currentProgress + adj));
                if (pctLabel) pctLabel.textContent = `${currentProgress}%`;
                if (pctInput) pctInput.value = currentProgress;
            });
        });

        if (pctInput) {
            pctInput.addEventListener('input', (e) => {
                const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                currentProgress = val;
                if (pctLabel) pctLabel.textContent = `${currentProgress}%`;
            });
        }

        // Cancelar y volver al parte diario
        this.modalRoot.querySelectorAll('.btn-cancel-edit').forEach(btn => {
            btn.addEventListener('click', () => this.openDailyLog(taskId));
        });

        // Guardar cambios
        const saveBtn = document.getElementById('btn-save-edit-daily');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const date = document.getElementById('edit-daily-date')?.value || log.date;
                const note = document.getElementById('edit-daily-note')?.value || '';

                const laborUpdated = {};
                document.querySelectorAll('#edit-daily-labor-container .edit-daily-labor-item').forEach(item => {
                    const rId = item.dataset.resId;
                    const inp = document.getElementById(`edit-daily-hh-${rId}`);
                    const val = inp ? parseFloat(inp.value) : 0;
                    if (val > 0) laborUpdated[rId] = val;
                });

                const machUpdated = {};
                document.querySelectorAll('#edit-daily-mach-container .edit-daily-mach-item').forEach(item => {
                    const rId = item.dataset.resId;
                    const inp = document.getElementById(`edit-daily-mach-${rId}`);
                    const val = inp ? parseFloat(inp.value) : 0;
                    if (val > 0) machUpdated[rId] = val;
                });

                this.store.updateDailyLog(taskId, logId, {
                    date,
                    progress: currentProgress,
                    labor: laborUpdated,
                    machinery: machUpdated,
                    notes: note
                });

                this.showToast(`Parte diario del ${date} corregido exitosamente.`);
                this.openDailyLog(taskId);
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 3. MODAL: INSPECTOR DE CONFLICTOS DE RECURSOS
    // ======================================================================
    openConflictInspector(dateStr) {
        const conflicts = this.store.getConflicts();
        let activeDate = dateStr;
        if (!activeDate || !conflicts.conflictsByDate || !conflicts.conflictsByDate[activeDate]) {
            const availableDates = Object.keys(conflicts.conflictsByDate || {});
            activeDate = availableDates.length > 0 ? availableDates[0] : (dateStr || this.store.getProjectCutoffDate());
        }
        const dateConflicts = (conflicts.conflictsByDate && conflicts.conflictsByDate[activeDate]) || [];

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
                <div class="bg-slate-900 border border-red-500/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                    
                    <div class="p-4 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="alert-triangle" class="w-5 h-5 text-red-400"></i>
                            <div>
                                <h3 class="text-sm font-bold text-white">Alerta de Sobreasignación de Recursos</h3>
                                <p class="text-[11px] text-red-300 font-mono">Fecha: ${activeDate}</p>
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
                                    <button class="btn-shift-task px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px]" data-task-id="${t.id}" data-current-date="${activeDate}">
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
    // 3b. MODAL: CONFIGURACIÓN DE DÍA (LABORABLE, FIN DE SEMANA, FERIADO PAGO)
    // ======================================================================
    openDayCalendarModal(dateStr) {
        if (!dateStr) return;
        const project = this.store.getActiveProject();
        if (!project) return;
        
        if (this.store.state.isSupervisionMode) {
            this.showToast('El calendario laboral es de solo lectura en modo supervisión.');
            return;
        }

        const dayStatus = this.store.getDayStatus(dateStr, project);
        const autoCost = this.store.getHolidayDailyCost(dateStr, project);

        // Formatear fecha amigable en español
        const [y, m, d] = dateStr.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d, 12, 0, 0);
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const formattedDate = `${dayNames[dateObj.getDay()]}, ${d} de ${monthNames[m - 1]} de ${y}`;

        const isCustomConfigured = Boolean(project.calendarConfig && project.calendarConfig.holidays && project.calendarConfig.holidays[dateStr]);
        const currentType = dayStatus.type; // 'workday' | 'weekend' | 'holiday_paid' | 'holiday_unpaid'

        const crewSize = project.resourceLimits ? Object.values(project.resourceLimits).reduce((a, b) => a + (Number(b) || 0), 0) : 0;

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
                <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    
                    <!-- Cabecera del Modal -->
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between flex-shrink-0">
                        <div class="flex items-center gap-2.5">
                            <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                                <i data-lucide="calendar" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-white">Configuración del Calendario Laboral</h3>
                                <p class="text-[11px] text-slate-400 font-mono">${formattedDate} • (${dateStr})</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Contenido y Opciones -->
                    <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar text-xs">
                        <div>
                            <label class="block text-slate-300 font-semibold mb-2">Clasificación para esta Fecha:</label>
                            
                            <div class="space-y-2">
                                <!-- 1. Jornada Laborable Normal -->
                                <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-700/70 bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer transition-all">
                                    <input type="radio" name="day_calendar_type" value="workday" ${currentType === 'workday' ? 'checked' : ''} class="mt-0.5 text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-slate-200">🟢 Jornada Laborable Normal</span>
                                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Día Hábil</span>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-0.5">Se planifican y ejecutan tareas productivas en obra. Costo imputado según horas ejecutadas.</p>
                                    </div>
                                </label>

                                <!-- 2. Fin de Semana / Franco Habitual (Sin Costo) -->
                                <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-700/70 bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer transition-all">
                                    <input type="radio" name="day_calendar_type" value="weekend" ${currentType === 'weekend' ? 'checked' : ''} class="mt-0.5 text-slate-400 focus:ring-slate-400 bg-slate-900 border-slate-700">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-slate-300">⚪ Fin de Semana / Franco Habitual</span>
                                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/40">Sin Costo</span>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-0.5">Día de descanso semanal estándar (Sábados/Domingos). No devenga jornales cargados al presupuesto.</p>
                                    </div>
                                </label>

                                <!-- 3. Feriado / Asueto Pago (CON Costo sobre Presupuesto) -->
                                <label class="flex items-start gap-3 p-3 rounded-xl border-2 ${currentType === 'holiday_paid' ? 'border-purple-500/80 bg-purple-950/20' : 'border-purple-500/40 bg-purple-950/10'} hover:bg-purple-950/30 cursor-pointer transition-all">
                                    <input type="radio" name="day_calendar_type" value="holiday_paid" ${currentType === 'holiday_paid' ? 'checked' : ''} class="mt-0.5 text-purple-500 focus:ring-purple-500 bg-slate-900 border-slate-700">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-purple-200">🟣 Feriado / Asueto Pago</span>
                                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">Afecta Presupuesto ($)</span>
                                        </div>
                                        <p class="text-[11px] text-purple-300/80 mt-0.5">No hay tareas físicas, pero se liquida el jornal del personal asignado y se carga como costo directo de obra.</p>
                                    </div>
                                </label>

                                <!-- 4. Parada No Laborable Sin Costo -->
                                <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-700/70 bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer transition-all">
                                    <input type="radio" name="day_calendar_type" value="holiday_unpaid" ${currentType === 'holiday_unpaid' ? 'checked' : ''} class="mt-0.5 text-rose-400 focus:ring-rose-400 bg-slate-900 border-slate-700">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold text-slate-300">🔴 Parada No Laborable Sin Costo</span>
                                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Sin Jornal</span>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-0.5">Día inhábil sin liquidación de haberes (ej. veda climática o suspensión sin goce acordada).</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Sección de Parámetros de Feriado / Parada -->
                        <div id="holiday-extra-config" class="space-y-3 p-3.5 bg-slate-950/60 rounded-xl border border-purple-500/30 transition-all ${currentType === 'holiday_paid' || currentType === 'holiday_unpaid' ? '' : 'hidden'}">
                            <div class="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                                <i data-lucide="info" class="w-3.5 h-3.5"></i> Parámetros de Liquidación y Costos
                            </div>
                            
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Nombre / Motivo:</label>
                                <input type="text" id="input-holiday-name" value="${dayStatus.name || ''}" placeholder="Ej: Feriado Nacional, Asueto Petrolero, etc." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-purple-500">
                            </div>

                            <div id="holiday-paid-details" class="grid grid-cols-2 gap-3 ${currentType === 'holiday_paid' ? '' : 'hidden'}">
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Horas por Operario:</label>
                                    <div class="flex items-center gap-1">
                                        <input type="number" id="input-holiday-hours" value="${dayStatus.hoursPerWorker || 8}" min="1" max="24" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 font-mono text-center">
                                        <span class="text-slate-400 text-[11px]">hs</span>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Costo Cuadrilla (USD):</label>
                                    <input type="number" id="input-holiday-cost" value="${dayStatus.customCost !== null && dayStatus.customCost !== undefined ? dayStatus.customCost : autoCost}" placeholder="Auto: $${autoCost}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 font-mono text-right">
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400">
                                * El costo automático estimado de la cuadrilla activa (${crewSize} operarios) es de <strong class="text-emerald-400 font-mono">$${autoCost.toLocaleString()} USD</strong> por jornada. Puedes ingresar un monto manual si pactaste otra tarifa.
                            </p>
                        </div>
                    </div>

                    <!-- Botones de Acción -->
                    <div class="p-4 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-between flex-shrink-0">
                        <div>
                            ${isCustomConfigured ? `
                                <button type="button" id="btn-reset-day" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors">
                                    <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Restablecer a Default
                                </button>
                            ` : `
                                <span class="text-[11px] text-slate-500">Configuración estándar de calendario</span>
                            `}
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-close-modal px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
                                Cancelar
                            </button>
                            <button type="button" id="btn-save-day-calendar" class="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-colors">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i> Guardar Día
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        // Listeners de cierre
        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        // Dinámica de visibilidad de opciones
        const extraConfigEl = this.modalRoot.querySelector('#holiday-extra-config');
        const paidDetailsEl = this.modalRoot.querySelector('#holiday-paid-details');
        const radioInputs = this.modalRoot.querySelectorAll('input[name="day_calendar_type"]');

        radioInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                const val = radio.value;
                if (val === 'holiday_paid') {
                    extraConfigEl.classList.remove('hidden');
                    paidDetailsEl.classList.remove('hidden');
                } else if (val === 'holiday_unpaid') {
                    extraConfigEl.classList.remove('hidden');
                    paidDetailsEl.classList.add('hidden');
                } else {
                    extraConfigEl.classList.add('hidden');
                    paidDetailsEl.classList.add('hidden');
                }
            });
        });

        // Guardar
        const btnSave = this.modalRoot.querySelector('#btn-save-day-calendar');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const selectedRadio = this.modalRoot.querySelector('input[name="day_calendar_type"]:checked');
                const type = selectedRadio ? selectedRadio.value : 'workday';
                const nameInput = this.modalRoot.querySelector('#input-holiday-name');
                const hoursInput = this.modalRoot.querySelector('#input-holiday-hours');
                const costInput = this.modalRoot.querySelector('#input-holiday-cost');

                const name = nameInput ? nameInput.value.trim() : '';
                const hoursPerWorker = hoursInput ? Number(hoursInput.value) || 8 : 8;
                const rawCost = costInput ? costInput.value.trim() : '';
                const customCost = rawCost !== '' ? Number(rawCost) : null;

                this.store.setDayStatus(dateStr, {
                    type,
                    name,
                    hoursPerWorker,
                    customCost
                });

                const desc = type === 'holiday_paid' ? 'feriado pago' : (type === 'weekend' ? 'fin de semana' : (type === 'holiday_unpaid' ? 'parada no laborable' : 'jornada laborable'));
                this.showToast(`Día ${dateStr} configurado como ${desc}`);
                this.closeModal();
            });
        }

        // Restablecer a default
        const btnReset = this.modalRoot.querySelector('#btn-reset-day');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.store.setDayStatus(dateStr, { type: 'reset' });
                this.showToast(`Día ${dateStr} restablecido a la configuración general.`);
                this.closeModal();
            });
        }

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
    // 6. ASISTENTE: ALTA DE NUEVA OBRA POR PASOS (WIZARD)
    // ======================================================================
    openCreateProjectModal() {
        this.openCreateProjectWizard(1);
    }

    openCreateProjectWizard(step = 1, context = null) {
        if (step === 1) {
            const tempProjectData = context?.tempProjectData || (context?.name !== undefined ? context : null);
            return this.openCatalogManagerModal('labor', { isWizard: true, step: 1, tempProjectData });
        }

        if (step === 3) {
            return this.openTaskCreator({
                isWizard: true,
                step: 3,
                createdProject: context?.createdProject || this.store.getActiveProject(),
                tasksCreatedCount: context?.tasksCreatedCount || 0
            });
        }

        // Paso 2: Parámetros contractuales y límites de capacidad diaria precargados del catálogo
        const catalogs = this.store.getCatalogs();
        const laborList = catalogs.labor || [];
        const machList = catalogs.machinery || [];
        const equipList = catalogs.equipment || [];

        const defaultData = {
            name: '',
            code: '',
            client: '',
            location: '',
            startDate: '2026-09-15',
            durationDays: 30,
            contractBudget: 125000,
            resourceLimits: {}
        };

        const currentData = { ...defaultData, ...(context?.tempProjectData || (context?.name !== undefined ? context : {})) };
        currentData.resourceLimits = currentData.resourceLimits || {};

        const escapeAttr = (str) => (str === undefined || str === null ? '' : String(str).replace(/"/g, '&quot;'));

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <!-- Header -->
                    <div class="p-4 sm:p-5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                <i data-lucide="folder-plus" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="text-base sm:text-lg font-bold text-white">Alta de Nueva Obra / Proyecto de Montaje</h3>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Paso 2 de 3: Parámetros y Capacidad</span>
                                </div>
                                <p class="text-xs text-slate-400">Configura los parámetros contractuales y los límites diarios de recursos para control de sobreasignación</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Stepper Bar -->
                    <div class="px-4 sm:px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2 flex-wrap">
                            <button type="button" id="btn-wizard-back-step1" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer">
                                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                <span>Paso 1: Catálogo</span>
                                <span class="text-[10px] underline ml-1 text-emerald-300">Modificar</span>
                            </button>
                            <span class="text-slate-600">➔</span>
                            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <span class="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">2</span>
                                <span>Paso 2: Parámetros y Capacidad (Activo)</span>
                            </div>
                            <span class="text-slate-600">➔</span>
                            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 border border-slate-800">
                                <span class="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-black">3</span>
                                <span>Paso 3: Crear Tareas</span>
                            </div>
                        </div>
                        <span class="hidden sm:inline text-slate-400 text-[11px]">Asistente de Configuración</span>
                    </div>

                    <!-- Formulario de Obra -->
                    <form id="form-create-project" class="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-grow">
                        
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="sm:col-span-2">
                                <label class="block font-semibold text-slate-300 mb-1">Nombre de la Obra *</label>
                                <input type="text" name="name" value="${escapeAttr(currentData.name)}" placeholder="Ej: Montaje Skid Separador de Gas Batería 3" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Código / ID Obra *</label>
                                <input type="text" name="code" value="${escapeAttr(currentData.code)}" placeholder="Ej: SKID-2026-03" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Cliente / Comitente</label>
                                <input type="text" name="client" value="${escapeAttr(currentData.client)}" placeholder="Ej: Pan American Energy / YPF" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Ubicación / Yacimiento</label>
                                <input type="text" name="location" value="${escapeAttr(currentData.location)}" placeholder="Ej: Cuenca del Golfo San Jorge" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Fecha de Inicio Contractual *</label>
                                <input type="date" name="startDate" value="${currentData.startDate || '2026-09-15'}" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Plazo Total (Días corridos)</label>
                                <input type="number" name="durationDays" min="1" max="365" value="${currentData.durationDays || 30}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono">
                            </div>
                            <div>
                                <label class="block font-semibold text-slate-300 mb-1">Presupuesto Cotizado ($ USD)</label>
                                <input type="number" name="contractBudget" min="0" step="1000" value="${currentData.contractBudget || 125000}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-amber-400">
                            </div>
                        </div>

                        <!-- Sección Dinámica: Capacidad Máxima Disponible Diaria -->
                        <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-4">
                            <div class="flex items-center justify-between flex-wrap gap-2">
                                <h5 class="font-bold text-slate-200 flex items-center gap-1.5 text-cyan-400">
                                    <i data-lucide="shield-alert" class="w-4 h-4"></i>
                                    <span>Capacidad Máxima Disponible Diaria (Control de Sobreasignación)</span>
                                </h5>
                                <span class="text-[11px] text-slate-400">Precargado automáticamente desde el Catálogo</span>
                            </div>

                            <!-- Subsección Mano de Obra -->
                            <div>
                                <span class="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block mb-2 flex items-center gap-1">
                                    <i data-lucide="users" class="w-3.5 h-3.5"></i> Dotación Diaria Máxima - Mano de Obra (Personas en simultáneo)
                                </span>
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                    ${laborList.map(res => {
                                        const val = (currentData.resourceLimits && currentData.resourceLimits[res.id] !== undefined)
                                            ? currentData.resourceLimits[res.id]
                                            : (res.defaultLimit !== undefined ? res.defaultLimit : 4);
                                        return `
                                            <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                                                <div class="mb-1">
                                                    <span class="text-xs font-semibold text-slate-200 block truncate" title="${res.name}">${res.name}</span>
                                                    <span class="text-[10px] text-slate-500">Unidad: ${res.unit || 'HH'}</span>
                                                </div>
                                                <div class="flex items-center gap-1.5 mt-1">
                                                    <input type="number" name="limit_${res.id}" value="${val}" min="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-white font-mono text-center font-bold text-xs focus:border-cyan-500 focus:outline-none">
                                                    <span class="text-[10px] text-slate-400 shrink-0">pers/día</span>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- Subsección Maquinarias y Equipos -->
                            <div>
                                <span class="text-[11px] font-bold text-orange-300 uppercase tracking-wider block mb-2 flex items-center gap-1">
                                    <i data-lucide="truck" class="w-3.5 h-3.5"></i> Disponibilidad Diaria - Equipos y Maquinarias
                                </span>
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                    ${[...machList, ...equipList].map(res => {
                                        const defaultVal = res.defaultLimit !== undefined ? res.defaultLimit : (res.unit === 'm²' ? 200 : 1);
                                        const val = (currentData.resourceLimits && currentData.resourceLimits[res.id] !== undefined)
                                            ? currentData.resourceLimits[res.id]
                                            : defaultVal;
                                        return `
                                            <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/80 hover:border-orange-500/40 transition-all flex flex-col justify-between">
                                                <div class="mb-1">
                                                    <span class="text-xs font-semibold text-slate-200 block truncate" title="${res.name}">${res.name}</span>
                                                    <span class="text-[10px] text-slate-500">Unidad: ${res.unit || 'hs'}</span>
                                                </div>
                                                <div class="flex items-center gap-1.5 mt-1">
                                                    <input type="number" name="limit_${res.id}" value="${val}" min="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-white font-mono text-center font-bold text-xs focus:border-orange-500 focus:outline-none">
                                                    <span class="text-[10px] text-slate-400 shrink-0">${res.unit === 'm²' ? 'm²' : 'u/día'}</span>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>

                    </form>

                    <!-- Footer Navigation -->
                    <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <button type="button" id="btn-wizard-back-bottom" class="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                            <i data-lucide="arrow-left" class="w-4 h-4"></i>
                            <span>Volver a Catálogo (Paso 1)</span>
                        </button>
                        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button type="button" class="btn-close-modal px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold">Cancelar</button>
                            <button type="button" id="btn-submit-create-project" class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer">
                                <span>Siguiente: Crear Tareas (Paso 3)</span>
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;
        document.body.classList.add('overflow-hidden');

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const extractCurrentData = () => {
            const form = document.getElementById('form-create-project');
            if (!form) return currentData;
            const formData = new FormData(form);
            const limits = {};
            for (const [key, value] of formData.entries()) {
                if (key.startsWith('limit_')) {
                    const resId = key.substring(6);
                    limits[resId] = Math.max(0, parseInt(value) || 0);
                }
            }
            return {
                name: (formData.get('name') || '').trim(),
                code: (formData.get('code') || '').trim(),
                client: (formData.get('client') || '').trim(),
                location: (formData.get('location') || '').trim(),
                startDate: formData.get('startDate') || '',
                durationDays: parseInt(formData.get('durationDays')) || 30,
                contractBudget: parseFloat(formData.get('contractBudget')) || 125000,
                resourceLimits: limits
            };
        };

        const goBackStep1 = () => {
            const dataToPreserve = extractCurrentData();
            this.openCreateProjectWizard(1, dataToPreserve);
        };

        const backBtnTop = document.getElementById('btn-wizard-back-step1');
        const backBtnBottom = document.getElementById('btn-wizard-back-bottom');
        if (backBtnTop) backBtnTop.addEventListener('click', goBackStep1);
        if (backBtnBottom) backBtnBottom.addEventListener('click', goBackStep1);

        const submitBtn = document.getElementById('btn-submit-create-project');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const form = document.getElementById('form-create-project');
                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const data = extractCurrentData();
                if (!data.name || !data.code || !data.startDate) {
                    alert('Por favor complete los campos obligatorios: Nombre de la Obra, Código y Fecha de Inicio Contractual.');
                    return;
                }

                // Asegurar que todos los recursos del catálogo tengan un límite establecido
                [...laborList, ...machList, ...equipList].forEach(res => {
                    if (data.resourceLimits[res.id] === undefined) {
                        data.resourceLimits[res.id] = res.defaultLimit !== undefined ? res.defaultLimit : (res.unit === 'm²' ? 200 : 2);
                    }
                });

                const created = this.store.createProject(data);
                this.showToast(`Obra "${created.name}" creada. Ahora agrega sus tareas iniciales.`, 'success');

                // Actualizar selector del header
                const selector = document.getElementById('project-select');
                if (selector) {
                    selector.innerHTML = this.store.getAllProjects().map(p => `
                        <option value="${p.id}">${p.code ? `[${p.code}] ` : ''}${p.name}</option>
                    `).join('');
                    selector.value = created.id;
                }

                // Transición al Paso 3: Creador de Tareas
                this.openCreateProjectWizard(3, { createdProject: created, tasksCreatedCount: 0 });
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 6B. MODAL: ELIMINAR OBRA / PROYECTO (VALIDACIÓN DE SEGURIDAD)
    // ======================================================================
    openDeleteProjectModal(projectId = this.store.state.currentProjectId) {
        if (this.store.state.isSupervisionMode) return;
        const project = this.store.state.projects.find(p => p.id === projectId);
        if (!project) return;

        if (this.store.state.projects.length <= 1) {
            this.showToast('No puedes eliminar la única obra disponible en la base de datos', 'warning');
            return;
        }

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
                <div class="bg-slate-900 border border-rose-500/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                    <div class="p-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="trash-2" class="w-5 h-5 text-rose-400"></i>
                            <div>
                                <h3 class="text-sm font-bold text-white">Eliminar Obra / Proyecto</h3>
                                <p class="text-[11px] text-rose-300 font-mono truncate max-w-[280px]">${project.name}</p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-5 text-xs text-slate-300 space-y-3">
                        <p>¿Estás seguro de que deseas eliminar permanentemente la obra <strong>"${project.name}"</strong> [${project.code || project.id}]?</p>
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[11px] space-y-1 text-slate-400">
                            <div>• Tareas en cronograma: <strong class="text-white">${project.tasks ? project.tasks.length : 0}</strong></div>
                            <div>• Tareas en pendientes: <strong class="text-white">${project.backlog ? project.backlog.length : 0}</strong></div>
                            <div>• Presupuesto contractual: <strong class="text-amber-400">$${(project.contractBudget || 0).toLocaleString()}</strong></div>
                        </div>
                        <p class="text-rose-400 font-semibold text-[11px]">⚠️ Esta acción eliminará los datos de esta obra. Puedes respaldarla previamente desde "Base de Datos".</p>
                    </div>

                    <div class="p-3 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-2">
                        <button type="button" class="btn-close-modal px-3.5 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-xs font-semibold">Cancelar</button>
                        <button type="button" id="btn-confirm-delete-project" class="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-rose-600/20">
                            <i data-lucide="trash-2" class="w-4 h-4"></i> Eliminar Obra Definitivamente
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;
        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const confirmBtn = document.getElementById('btn-confirm-delete-project');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                try {
                    const res = this.store.deleteProject(projectId);
                    if (res && res.success) {
                        this.showToast(`Obra "${res.deletedName}" eliminada correctamente`, 'warning');
                        this.closeModal();

                        // Actualizar selector del header
                        const selector = document.getElementById('project-select');
                        if (selector) {
                            selector.innerHTML = this.store.getAllProjects().map(p => `
                                <option value="${p.id}">${p.code ? `[${p.code}] ` : ''}${p.name}</option>
                            `).join('');
                            selector.value = this.store.state.currentProjectId;
                        }
                    }
                } catch (err) {
                    this.showToast(err.message, 'error');
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
    // 7.B MODAL: GESTOR DE CATÁLOGO CRUD (EQUIPOS, MANO DE OBRA Y DISCIPLINAS)
    // ======================================================================
    openCatalogManagerModal(initialTab = 'labor', wizardContext = null) {
        const isSupervision = this.store.state.isSupervisionMode;
        let activeTab = initialTab;
        let searchTerm = '';
        let editingItem = null; // null or { category: 'labor'|'machinery'|'equipment'|'disciplines', isNew: boolean, item: {...} }

        const renderModal = () => {
            const catalogs = this.store.getCatalogs();
            const disciplines = this.store.getDisciplines();
            const laborList = catalogs.labor || [];
            const machineryList = [
                ...(catalogs.machinery || []).map(m => ({ ...m, _cat: 'machinery' })),
                ...(catalogs.equipment || []).map(e => ({ ...e, _cat: 'equipment' }))
            ];
            const discList = disciplines || [];

            const filteredLabor = laborList.filter(l => !searchTerm || l.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const filteredMach = machineryList.filter(m => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const filteredDisc = discList.filter(d => !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()));

            const html = `
                <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div class="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                        
                        <!-- Header -->
                        <div class="p-4 sm:p-5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                    <i data-lucide="database" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <h3 class="text-base sm:text-lg font-bold text-white">Catálogo de Recursos y Disciplinas</h3>
                                        ${wizardContext ? `
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Paso 1 de 3: Configuración Previa</span>
                                        ` : `
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">CRUD Industrial</span>
                                        `}
                                    </div>
                                    <p class="text-xs text-slate-400">
                                        ${wizardContext ? 'Revisa, agrega o modifica recursos que estarán disponibles en la nueva obra antes de definir sus límites' : 'Administra especialidades de mano de obra, maquinarias, equipos y disciplinas de montaje'}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                ${wizardContext ? `
                                    <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs">
                                        <span class="flex items-center gap-1 font-bold text-amber-400"><span class="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">1</span> Catálogo</span>
                                        <span class="text-slate-600">➔</span>
                                        <span class="text-slate-400 flex items-center gap-1"><span class="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-black">2</span> Parámetros</span>
                                        <span class="text-slate-600">➔</span>
                                        <span class="text-slate-500 flex items-center gap-1"><span class="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-black">3</span> Tareas</span>
                                    </div>
                                ` : ''}
                                <button class="btn-close-modal text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Pestañas del Catálogo -->
                        <div class="px-4 sm:px-6 pt-3 bg-slate-900/90 border-b border-slate-800 flex gap-2 overflow-x-auto custom-scrollbar">
                            <button class="cat-tab-btn px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'labor' ? 'border-cyan-400 text-cyan-400 bg-slate-800/60' : 'border-transparent text-slate-400 hover:text-slate-200'}" data-tab="labor">
                                <i data-lucide="users" class="w-4 h-4"></i>
                                <span>Mano de Obra</span>
                                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">${laborList.length}</span>
                            </button>
                            <button class="cat-tab-btn px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'machinery' ? 'border-orange-400 text-orange-400 bg-slate-800/60' : 'border-transparent text-slate-400 hover:text-slate-200'}" data-tab="machinery">
                                <i data-lucide="truck" class="w-4 h-4"></i>
                                <span>Equipos y Maquinarias</span>
                                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-950 text-orange-300 border border-orange-800">${machineryList.length}</span>
                            </button>
                            <button class="cat-tab-btn px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'disciplines' ? 'border-emerald-400 text-emerald-400 bg-slate-800/60' : 'border-transparent text-slate-400 hover:text-slate-200'}" data-tab="disciplines">
                                <i data-lucide="layers" class="w-4 h-4"></i>
                                <span>Disciplinas de Montaje</span>
                                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">${discList.length}</span>
                            </button>
                        </div>

                        <!-- Barra de Herramientas y Búsqueda -->
                        <div class="p-4 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800">
                            <div class="w-full sm:w-72 relative">
                                <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3 top-2.5"></i>
                                <input type="text" id="cat-search-input" value="${searchTerm}" placeholder="Filtrar por nombre o código..." class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
                            </div>
                            <div>
                                ${!isSupervision ? `
                                    <button type="button" id="btn-cat-add-item" class="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all">
                                        <i data-lucide="plus" class="w-4 h-4"></i>
                                        <span>${activeTab === 'labor' ? '+ Nueva Especialidad de Mano de Obra' : (activeTab === 'machinery' ? '+ Nuevo Equipo o Maquinaria' : '+ Nueva Disciplina de Montaje')}</span>
                                    </button>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Contenedor Principal con Scroll -->
                        <div class="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-grow space-y-3 min-h-[320px]">
                            
                            <!-- Sub-formulario de Edición / Creación si está activo -->
                            ${editingItem ? renderFormHtml(editingItem) : ''}

                            <!-- Tab 1: Mano de Obra -->
                            ${activeTab === 'labor' && !editingItem ? `
                                <div class="overflow-x-auto rounded-xl border border-slate-800">
                                    <table class="w-full text-left text-xs text-slate-300">
                                        <thead class="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
                                            <tr>
                                                <th class="p-3">Especialidad de Mano de Obra</th>
                                                <th class="p-3 text-center">Unidad</th>
                                                ${!isSupervision ? '<th class="p-3 text-right">Tarifa ($/HH)</th>' : ''}
                                                <th class="p-3 text-center">Estado de Uso</th>
                                                ${!isSupervision ? '<th class="p-3 text-right">Acciones</th>' : ''}
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800">
                                            ${filteredLabor.length > 0 ? filteredLabor.map(item => {
                                                const inUse = this.store.isResourceInUse(item.id);
                                                return `
                                                    <tr class="hover:bg-slate-800/40 transition-colors">
                                                        <td class="p-3 font-semibold text-white flex items-center gap-2">
                                                            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                                                            <div>
                                                                <div>${item.name}</div>
                                                                <div class="text-[10px] text-slate-500 font-mono">ID: ${item.id}</div>
                                                            </div>
                                                        </td>
                                                        <td class="p-3 text-center font-mono text-slate-400">${item.unit || 'HH'}</td>
                                                        ${!isSupervision ? `<td class="p-3 text-right font-mono font-bold text-amber-400">$${item.costPerHour || 0}/h</td>` : ''}
                                                        <td class="p-3 text-center">
                                                            ${inUse ? `
                                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">En uso en obra</span>
                                                            ` : `
                                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">Sin asignación</span>
                                                            `}
                                                        </td>
                                                        ${!isSupervision ? `
                                                            <td class="p-3 text-right space-x-1 whitespace-nowrap">
                                                                <button class="btn-cat-edit px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white" data-cat="labor" data-id="${item.id}" title="Editar especialidad">
                                                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                                                </button>
                                                                <button class="btn-cat-delete px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30" data-cat="labor" data-id="${item.id}" title="Eliminar especialidad">
                                                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                                                </button>
                                                            </td>
                                                        ` : ''}
                                                    </tr>
                                                `;
                                            }).join('') : `
                                                <tr>
                                                    <td colspan="5" class="p-6 text-center text-slate-500 italic">No se encontraron especialidades registradas.</td>
                                                </tr>
                                            `}
                                        </tbody>
                                    </table>
                                </div>
                            ` : ''}

                            <!-- Tab 2: Maquinarias y Equipos -->
                            ${activeTab === 'machinery' && !editingItem ? `
                                <div class="overflow-x-auto rounded-xl border border-slate-800">
                                    <table class="w-full text-left text-xs text-slate-300">
                                        <thead class="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
                                            <tr>
                                                <th class="p-3">Equipo / Maquinaria</th>
                                                <th class="p-3 text-center">Categoría</th>
                                                <th class="p-3 text-center">Unidad</th>
                                                ${!isSupervision ? '<th class="p-3 text-right">Costo Operativo</th>' : ''}
                                                <th class="p-3 text-center">Estado de Uso</th>
                                                ${!isSupervision ? '<th class="p-3 text-right">Acciones</th>' : ''}
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800">
                                            ${filteredMach.length > 0 ? filteredMach.map(item => {
                                                const inUse = this.store.isResourceInUse(item.id);
                                                const isHeavy = item._cat === 'machinery';
                                                return `
                                                    <tr class="hover:bg-slate-800/40 transition-colors">
                                                        <td class="p-3 font-semibold text-white flex items-center gap-2">
                                                            <span class="w-2 h-2 rounded-full ${isHeavy ? 'bg-orange-400' : 'bg-teal-400'}"></span>
                                                            <div>
                                                                <div>${item.name}</div>
                                                                <div class="text-[10px] text-slate-500 font-mono">ID: ${item.id}</div>
                                                            </div>
                                                        </td>
                                                        <td class="p-3 text-center">
                                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${isHeavy ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-teal-500/10 text-teal-400 border border-teal-500/30'}">
                                                                ${isHeavy ? 'Maquinaria Pesada' : 'Equipo de Montaje'}
                                                            </span>
                                                        </td>
                                                        <td class="p-3 text-center font-mono text-slate-400">${item.unit || 'hs'}</td>
                                                        ${!isSupervision ? `<td class="p-3 text-right font-mono font-bold text-amber-400">$${item.costPerHour || 0}/h</td>` : ''}
                                                        <td class="p-3 text-center">
                                                            ${inUse ? `
                                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">En uso en obra</span>
                                                            ` : `
                                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">Sin asignación</span>
                                                            `}
                                                        </td>
                                                        ${!isSupervision ? `
                                                            <td class="p-3 text-right space-x-1 whitespace-nowrap">
                                                                <button class="btn-cat-edit px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white" data-cat="${item._cat}" data-id="${item.id}" title="Editar equipo">
                                                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                                                </button>
                                                                <button class="btn-cat-delete px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30" data-cat="${item._cat}" data-id="${item.id}" title="Eliminar equipo">
                                                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                                                </button>
                                                            </td>
                                                        ` : ''}
                                                    </tr>
                                                `;
                                            }).join('') : `
                                                <tr>
                                                    <td colspan="6" class="p-6 text-center text-slate-500 italic">No se encontraron equipos registrados.</td>
                                                </tr>
                                            `}
                                        </tbody>
                                    </table>
                                </div>
                            ` : ''}

                            <!-- Tab 3: Disciplinas -->
                            ${activeTab === 'disciplines' && !editingItem ? `
                                <div class="overflow-x-auto rounded-xl border border-slate-800">
                                    <table class="w-full text-left text-xs text-slate-300">
                                        <thead class="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
                                            <tr>
                                                <th class="p-3">Nombre de la Disciplina</th>
                                                <th class="p-3 text-center">Identificador (ID)</th>
                                                <th class="p-3 text-center">Insignia / Estilo</th>
                                                <th class="p-3 text-center">Estado de Uso</th>
                                                ${!isSupervision ? '<th class="p-3 text-right">Acciones</th>' : ''}
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800">
                                            ${filteredDisc.length > 0 ? filteredDisc.map(d => {
                                                const inUse = this.store.isDisciplineInUse(d.id);
                                                return `
                                                    <tr class="hover:bg-slate-800/40 transition-colors">
                                                        <td class="p-3 font-semibold text-white flex items-center gap-2">
                                                            <span class="w-2.5 h-2.5 rounded-full bg-${d.color || 'blue'}-400"></span>
                                                            <span>${d.name}</span>
                                                        </td>
                                                        <td class="p-3 text-center font-mono text-slate-400">${d.id}</td>
                                                        <td class="p-3 text-center">
                                                            <span class="px-2.5 py-1 rounded-lg text-xs font-semibold ${d.badgeClass || 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}">
                                                                ${d.name}
                                                            </span>
                                                        </td>
                                                        <td class="p-3 text-center">
                                                            ${inUse ? `
                                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">En uso en obra</span>
                                                            ` : `
                                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">Sin asignación</span>
                                                            `}
                                                        </td>
                                                        ${!isSupervision ? `
                                                            <td class="p-3 text-right space-x-1 whitespace-nowrap">
                                                                <button class="btn-cat-edit px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white" data-cat="disciplines" data-id="${d.id}" title="Editar disciplina">
                                                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                                                </button>
                                                                <button class="btn-cat-delete px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30" data-cat="disciplines" data-id="${d.id}" title="Eliminar disciplina">
                                                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                                                </button>
                                                            </td>
                                                        ` : ''}
                                                    </tr>
                                                `;
                                            }).join('') : `
                                                <tr>
                                                    <td colspan="5" class="p-6 text-center text-slate-500 italic">No se encontraron disciplinas registradas.</td>
                                                </tr>
                                            `}
                                        </tbody>
                                    </table>
                                </div>
                            ` : ''}

                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <span class="text-xs text-slate-400">
                                ${wizardContext 
                                    ? 'Una vez revisados los recursos, avanza al Paso 2 para configurar los datos y capacidad diaria de la obra.' 
                                    : 'Los cambios aplicados impactan inmediatamente en los selectores de tareas y partes diarios.'}
                            </span>
                            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                                ${wizardContext ? `
                                    <button type="button" class="btn-close-modal px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold">Cancelar</button>
                                    <button type="button" id="btn-wizard-next-step" class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer">
                                        <span>Siguiente: Parámetros de la Obra</span>
                                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                    </button>
                                ` : `
                                    <button type="button" class="btn-close-modal px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cerrar</button>
                                `}
                            </div>
                        </div>

                    </div>
                </div>
            `;

            this.modalRoot.innerHTML = html;
            document.body.classList.add('overflow-hidden');

            // Wire tabs
            this.modalRoot.querySelectorAll('.cat-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    activeTab = btn.dataset.tab;
                    editingItem = null;
                    renderModal();
                });
            });

            // Wire search
            const searchInput = document.getElementById('cat-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    searchTerm = e.target.value;
                    renderModal();
                });
            }

            // Wire Add button
            const addBtn = document.getElementById('btn-cat-add-item');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    editingItem = {
                        category: activeTab,
                        isNew: true,
                        item: activeTab === 'labor' 
                            ? { name: '', unit: 'HH', costPerHour: 20 }
                            : (activeTab === 'machinery' 
                                ? { name: '', _cat: 'machinery', unit: 'hs', costPerHour: 100 }
                                : { name: '', id: '', color: 'blue', icon: 'layers' })
                    };
                    renderModal();
                });
            }

            // Wire Edit buttons
            this.modalRoot.querySelectorAll('.btn-cat-edit').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cat = btn.dataset.cat;
                    const id = btn.dataset.id;
                    let foundItem = null;
                    if (cat === 'labor') {
                        foundItem = (this.store.getCatalogs().labor || []).find(r => r.id === id);
                    } else if (cat === 'machinery') {
                        foundItem = (this.store.getCatalogs().machinery || []).find(r => r.id === id);
                    } else if (cat === 'equipment') {
                        foundItem = (this.store.getCatalogs().equipment || []).find(r => r.id === id);
                    } else if (cat === 'disciplines') {
                        foundItem = (this.store.getDisciplines() || []).find(d => d.id === id);
                    }

                    if (foundItem) {
                        editingItem = {
                            category: cat,
                            isNew: false,
                            item: { ...foundItem, _cat: cat }
                        };
                        renderModal();
                    }
                });
            });

            // Wire Delete buttons
            this.modalRoot.querySelectorAll('.btn-cat-delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cat = btn.dataset.cat;
                    const id = btn.dataset.id;
                    const inUse = cat === 'disciplines' ? this.store.isDisciplineInUse(id) : this.store.isResourceInUse(id);

                    let msg = `¿Está seguro de eliminar este elemento (${id}) del catálogo?`;
                    if (inUse) {
                        msg = `⚠️ ATENCIÓN: Este elemento está actualmente ASIGNADO en tareas activas de la obra.\n\nSi lo elimina del catálogo, las tareas existentes conservarán sus horas cargadas, pero el recurso ya no figurará en los menús desplegables para nuevas asignaciones.\n\n¿Desea eliminarlo del catálogo de todos modos?`;
                    }

                    if (confirm(msg)) {
                        if (cat === 'disciplines') {
                            this.store.deleteDiscipline(id);
                        } else {
                            this.store.deleteCatalogItem(cat, id);
                        }
                        this.showToast('Elemento eliminado del catálogo', 'warning');
                        renderModal();
                    }
                });
            });

            // Close buttons
            this.modalRoot.querySelectorAll('.btn-close-modal').forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });

            // Wizard Next Step button
            if (wizardContext) {
                const wizardNextBtn = document.getElementById('btn-wizard-next-step');
                if (wizardNextBtn) {
                    wizardNextBtn.addEventListener('click', () => {
                        if (editingItem) {
                            if (!confirm('Tiene un registro de catálogo en edición sin guardar. ¿Desea descartar y avanzar al Paso 2?')) {
                                return;
                            }
                        }
                        this.openCreateProjectWizard(2, wizardContext.tempProjectData);
                    });
                }
            }

            // Wire Form events if form is displayed
            if (editingItem) {
                wireFormHandlers();
            }

            if (window.lucide) window.lucide.createIcons();
        };

        const renderFormHtml = (editing) => {
            const isLabor = editing.category === 'labor';
            const isMach = editing.category === 'machinery' || editing.category === 'equipment';
            const isDisc = editing.category === 'disciplines';
            const item = editing.item;

            return `
                <div class="bg-slate-800/90 p-5 rounded-2xl border border-amber-500/40 shadow-xl mb-4 animate-fade-in">
                    <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
                        <div class="flex items-center gap-2">
                            <i data-lucide="${editing.isNew ? 'plus-circle' : 'edit-3'}" class="w-5 h-5 text-amber-400"></i>
                            <h4 class="font-bold text-white text-sm">
                                ${editing.isNew ? 'Agregar Nuevo Registro al Catálogo' : `Editar: ${item.name}`}
                            </h4>
                        </div>
                        <button type="button" id="btn-cancel-cat-form" class="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg hover:bg-slate-700">
                            Volver al listado
                        </button>
                    </div>

                    <form id="form-cat-item" class="space-y-4 text-xs">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Nombre / Denominación *</label>
                                <input type="text" id="cat-field-name" value="${item.name || ''}" placeholder="Ej: Soldador Calificado 6G / Grúa 50T..." class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" required>
                            </div>

                            ${isDisc ? `
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Identificador / Tag (Slug) *</label>
                                    <input type="text" id="cat-field-id" value="${item.id || ''}" placeholder="ej: aislamiento" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none" ${!editing.isNew ? 'disabled' : ''} required>
                                </div>
                            ` : `
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Unidad de Medida</label>
                                    <input type="text" id="cat-field-unit" value="${item.unit || (isLabor ? 'HH' : 'hs')}" placeholder="HH, hs, día..." class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none">
                                </div>
                            `}
                        </div>

                        ${isMach ? `
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Categoría del Equipo</label>
                                    <select id="cat-field-category" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                                        <option value="machinery" ${(item._cat || editing.category) === 'machinery' ? 'selected' : ''}>Maquinaria Pesada (Grúas, Camiones, Elevadores)</option>
                                        <option value="equipment" ${(item._cat || editing.category) === 'equipment' ? 'selected' : ''}>Equipo de Montaje (Andamios, Generadores, Compresores)</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Costo Operativo Estimado ($/h o USD/h)</label>
                                    <input type="number" id="cat-field-cost" value="${item.costPerHour || 0}" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none">
                                </div>
                            </div>
                        ` : ''}

                        ${isLabor ? `
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Costo Horario Tarifa ($/HH o USD/HH)</label>
                                    <input type="number" id="cat-field-cost" value="${item.costPerHour || 0}" step="0.5" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none">
                                </div>
                            </div>
                        ` : ''}

                        ${isDisc ? `
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Color Temático</label>
                                    <select id="cat-field-color" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                                        <option value="cyan" ${item.color === 'cyan' ? 'selected' : ''}>Cian / Azul Eléctrico</option>
                                        <option value="blue" ${item.color === 'blue' ? 'selected' : ''}>Azul Clásico</option>
                                        <option value="amber" ${item.color === 'amber' ? 'selected' : ''}>Ámbar / Naranja</option>
                                        <option value="emerald" ${item.color === 'emerald' ? 'selected' : ''}>Esmeralda / Verde</option>
                                        <option value="purple" ${item.color === 'purple' ? 'selected' : ''}>Púrpura / Violeta</option>
                                        <option value="rose" ${item.color === 'rose' ? 'selected' : ''}>Rosa / Rojo Rubí</option>
                                        <option value="teal" ${item.color === 'teal' ? 'selected' : ''}>Turquesa / Teal</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-slate-300 font-semibold mb-1">Ícono Lucide</label>
                                    <select id="cat-field-icon" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                                        <option value="layers" ${item.icon === 'layers' ? 'selected' : ''}>layers (Capas)</option>
                                        <option value="git-branch" ${item.icon === 'git-branch' ? 'selected' : ''}>git-branch (Piping)</option>
                                        <option value="box" ${item.icon === 'box' ? 'selected' : ''}>box (Estructuras / Skids)</option>
                                        <option value="cpu" ${item.icon === 'cpu' ? 'selected' : ''}>cpu (Instrumentación / Eléctrico)</option>
                                        <option value="wrench" ${item.icon === 'wrench' ? 'selected' : ''}>wrench (Mecánico)</option>
                                        <option value="shield" ${item.icon === 'shield' ? 'selected' : ''}>shield (Seguridad / QA)</option>
                                        <option value="flame" ${item.icon === 'flame' ? 'selected' : ''}>flame (Soldadura / Tratamiento)</option>
                                    </select>
                                </div>
                            </div>
                        ` : ''}

                        <div class="pt-3 border-t border-slate-700 flex justify-end gap-2">
                            <button type="button" id="btn-cancel-cat-form-2" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">Cancelar</button>
                            <button type="button" id="btn-save-cat-item" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                                <i data-lucide="check" class="w-4 h-4"></i> Guardar en Catálogo
                            </button>
                        </div>
                    </form>
                </div>
            `;
        };

        const wireFormHandlers = () => {
            const cancelBtn = document.getElementById('btn-cancel-cat-form');
            const cancelBtn2 = document.getElementById('btn-cancel-cat-form-2');
            const closeForm = () => {
                editingItem = null;
                renderModal();
            };
            if (cancelBtn) cancelBtn.addEventListener('click', closeForm);
            if (cancelBtn2) cancelBtn2.addEventListener('click', closeForm);

            const saveBtn = document.getElementById('btn-save-cat-item');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const name = document.getElementById('cat-field-name')?.value.trim();
                    if (!name) {
                        alert('Por favor ingrese un nombre o denominación.');
                        return;
                    }

                    if (editingItem.category === 'disciplines') {
                        const idInput = document.getElementById('cat-field-id');
                        const id = idInput ? idInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') : '';
                        if (!id) {
                            alert('Por favor especifique un identificador único.');
                            return;
                        }
                        const color = document.getElementById('cat-field-color')?.value || 'blue';
                        const icon = document.getElementById('cat-field-icon')?.value || 'layers';

                        const discData = {
                            id,
                            name,
                            color,
                            icon,
                            badgeClass: `bg-${color}-500/10 text-${color}-400 border-${color}-500/30`
                        };

                        if (editingItem.isNew) {
                            this.store.addDiscipline(discData);
                        } else {
                            this.store.updateDiscipline(editingItem.item.id, discData);
                        }
                    } else if (editingItem.category === 'labor') {
                        const unit = document.getElementById('cat-field-unit')?.value.trim() || 'HH';
                        const cost = parseFloat(document.getElementById('cat-field-cost')?.value) || 0;
                        const laborData = {
                            name,
                            unit,
                            costPerHour: cost
                        };
                        if (editingItem.isNew) {
                            this.store.addCatalogItem('labor', laborData);
                        } else {
                            this.store.updateCatalogItem('labor', editingItem.item.id, laborData);
                        }
                    } else {
                        // Machinery or Equipment
                        const targetCategory = document.getElementById('cat-field-category')?.value || 'machinery';
                        const unit = document.getElementById('cat-field-unit')?.value.trim() || 'hs';
                        const cost = parseFloat(document.getElementById('cat-field-cost')?.value) || 0;
                        const machData = {
                            name,
                            unit,
                            costPerHour: cost
                        };

                        if (editingItem.isNew) {
                            this.store.addCatalogItem(targetCategory, machData);
                        } else {
                            const originalCat = editingItem.item._cat || editingItem.category;
                            if (originalCat === targetCategory) {
                                this.store.updateCatalogItem(targetCategory, editingItem.item.id, machData);
                            } else {
                                // Moved category from machinery to equipment or vice versa
                                this.store.deleteCatalogItem(originalCat, editingItem.item.id);
                                this.store.addCatalogItem(targetCategory, { id: editingItem.item.id, ...machData });
                            }
                        }
                    }

                    this.showToast('Catálogo actualizado exitosamente');
                    editingItem = null;
                    renderModal();
                });
            }
        };

        renderModal();
    }

    // ======================================================================
    // 8. MODAL: CREADOR LIMPIO DE TAREAS (SOPORTA MODO ASISTENTE PASO 3)
    // ======================================================================
    openTaskCreator(wizardContext = null) {
        const p = (wizardContext && wizardContext.createdProject) 
            ? wizardContext.createdProject 
            : this.store.getActiveProject();
        const disciplines = this.store.getDisciplines();
        const catalogs = this.store.getCatalogs();
        const laborCatalog = catalogs.labor || [];
        const machineryCatalog = [
            ...(catalogs.machinery || []).map(m => ({ ...m, _cat: 'machinery' })),
            ...(catalogs.equipment || []).map(e => ({ ...e, _cat: 'equipment' }))
        ];
        let tasksCreatedCount = (wizardContext && wizardContext.tasksCreatedCount) || 0;
        const isWizard = Boolean(wizardContext && wizardContext.createdProject);
        const isBacklogMode = Boolean(wizardContext && wizardContext.defaultToBacklog);

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="${isWizard ? 'list-plus' : (isBacklogMode ? 'inbox' : 'plus-square')}" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="text-base font-bold text-white">${isWizard ? 'Alta de Tareas de Montaje' : (isBacklogMode ? 'Nueva Tarea en Pendientes' : 'Nueva Tarea de Montaje')}</h3>
                                    ${isWizard ? `
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Paso 3 de 3: Tareas Iniciales</span>
                                    ` : (isBacklogMode ? `
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Bandeja de Pendientes</span>
                                    ` : '')}
                                </div>
                                <p class="text-xs text-slate-400">
                                    ${isWizard ? `Agregando tareas a la nueva obra: <strong class="text-white">${p ? `[${p.code}] ${p.name}` : ''}</strong>` : (isBacklogMode ? 'Crea una tarea sin fecha de inicio definida para asignarla al calendario cuando comience.' : 'Configura los parámetros, dotación y programación de la tarea')}
                                </p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    ${isWizard ? `
                        <!-- Stepper Navigation Bar -->
                        <div class="px-4 sm:px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2 flex-wrap">
                                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                    <span>Paso 1: Catálogo</span>
                                </div>
                                <span class="text-slate-600">➔</span>
                                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                    <span>Paso 2: Obra Creada</span>
                                </div>
                                <span class="text-slate-600">➔</span>
                                <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    <span class="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">3</span>
                                    <span>Paso 3: Crear Tareas (Activo)</span>
                                </div>
                            </div>
                            <span class="text-xs text-amber-400 font-bold hidden sm:inline">Tareas agregadas: <span id="wizard-tasks-count" class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">${tasksCreatedCount}</span></span>
                        </div>
                    ` : ''}

                    <form id="form-create-task" class="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-grow text-xs">
                        
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="sm:col-span-2">
                                <label class="block text-slate-300 font-semibold mb-1">Nombre de la Tarea *</label>
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
                                    ${disciplines.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
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
                                <label class="block text-slate-300 font-semibold mb-1">Fecha de Inicio Programada ${isBacklogMode ? '<span class="text-slate-500 font-normal">(Opcional)</span>' : ''}</label>
                                <input type="date" name="estimatedStart" value="${isBacklogMode ? '' : (p ? p.startDate : '2026-09-01')}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono" placeholder="Sin fecha definida">
                                ${isBacklogMode ? `<p class="text-[10px] text-slate-400 mt-1">Déjala vacía si aún no está definido el día de comienzo de la tarea.</p>` : ''}
                            </div>
                            <div>
                                <label class="block text-slate-300 font-semibold mb-1">Destino de la Tarea</label>
                                <select name="targetDestination" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-semibold">
                                    <option value="backlog" ${isBacklogMode ? 'selected' : ''}>Enviar a Bandeja de Pendientes (Sin fecha)</option>
                                    <option value="calendar" ${!isBacklogMode ? 'selected' : ''}>Programar directo en Calendario</option>
                                </select>
                            </div>
                        </div>

                        <!-- Mano de obra con Menú Desplegable -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-cyan-400">
                                    <i data-lucide="users" class="w-4 h-4"></i> Mano de Obra Estimada (Horas-Hombre)
                                </h4>
                                <button type="button" id="btn-create-add-labor" class="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all">
                                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> + Asignar Especialidad
                                </button>
                            </div>
                            <div id="create-task-labor-container" class="space-y-2">
                                <!-- Filas dinámicas -->
                            </div>
                        </div>

                        <!-- Maquinaria con Menú Desplegable -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-orange-400">
                                    <i data-lucide="truck" class="w-4 h-4"></i> Equipos y Maquinarias Estimadas
                                </h4>
                                <button type="button" id="btn-create-add-mach" class="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all">
                                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> + Asignar Equipo
                                </button>
                            </div>
                            <div id="create-task-mach-container" class="space-y-2">
                                <!-- Filas dinámicas -->
                            </div>
                        </div>

                        <div>
                            <label class="block text-slate-300 font-semibold mb-1">Notas Técnicas / Memoria de Montaje</label>
                            <textarea name="notes" rows="2" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none" placeholder="Especificaciones de soldadura, izajes o requerimientos de seguridad..."></textarea>
                        </div>

                    </form>

                    <!-- Footer -->
                    ${wizardContext ? `
                        <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <button type="button" id="btn-wizard-skip-tasks" class="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all cursor-pointer">
                                Finalizar Asistente
                            </button>
                            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button type="button" id="btn-save-and-add-another" class="px-4 py-2 text-xs font-bold rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                                    <i data-lucide="plus" class="w-4 h-4"></i> Guardar Tarea y Crear Otra
                                </button>
                                <button type="button" id="btn-save-new-task" class="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer">
                                    <i data-lucide="check-circle" class="w-4 h-4"></i> Guardar y Empezar Obra
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div class="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-2">
                            <button type="button" class="btn-close-modal px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">Cancelar</button>
                            <button type="button" id="btn-save-new-task" class="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer">
                                <i data-lucide="${isBacklogMode ? 'inbox' : 'check'}" class="w-4 h-4"></i> ${isBacklogMode ? 'Guardar en Pendientes' : 'Guardar Tarea'}
                            </button>
                        </div>
                    `}

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        // Renderizadores dinámicos para el creador
        const laborCont = document.getElementById('create-task-labor-container');
        const appendLabor = (resId = '', hours = 16) => {
            if (!laborCont) return;
            const row = document.createElement('div');
            row.className = 'create-labor-row flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700';
            const selectedId = resId || (laborCatalog[0]?.id || '');
            row.innerHTML = `
                <div class="flex-grow">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Especialidad</label>
                    <select class="labor-select-id w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-cyan-500 focus:outline-none">
                        ${laborCatalog.map(r => `<option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>${r.name} (${r.unit || 'HH'})</option>`).join('')}
                    </select>
                </div>
                <div class="w-28 flex-shrink-0">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Horas (HH)</label>
                    <input type="number" min="0" step="1" value="${hours}" class="labor-input-hours w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-center text-xs focus:border-cyan-500 focus:outline-none">
                </div>
                <div class="pt-3.5 flex-shrink-0">
                    <button type="button" class="btn-remove-row p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            laborCont.appendChild(row);
            row.querySelector('.btn-remove-row')?.addEventListener('click', () => row.remove());
            if (window.lucide) window.lucide.createIcons();
        };

        const machCont = document.getElementById('create-task-mach-container');
        const appendMach = (resId = '', hours = 4) => {
            if (!machCont) return;
            const row = document.createElement('div');
            row.className = 'create-mach-row flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700';
            const selectedId = resId || (machineryCatalog[0]?.id || '');
            row.innerHTML = `
                <div class="flex-grow">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Equipo / Maquinaria</label>
                    <select class="mach-select-id w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-orange-500 focus:outline-none">
                        ${machineryCatalog.map(r => `<option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>${r.name} (${r.unit || 'hs'})</option>`).join('')}
                    </select>
                </div>
                <div class="w-28 flex-shrink-0">
                    <label class="block text-[10px] text-slate-400 font-semibold mb-0.5">Horas</label>
                    <input type="number" min="0" step="1" value="${hours}" class="mach-input-hours w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-center text-xs focus:border-orange-500 focus:outline-none">
                </div>
                <div class="pt-3.5 flex-shrink-0">
                    <button type="button" class="btn-remove-row p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            machCont.appendChild(row);
            row.querySelector('.btn-remove-row')?.addEventListener('click', () => row.remove());
            if (window.lucide) window.lucide.createIcons();
        };

        // Filas iniciales por defecto
        if (laborCatalog.length > 0) {
            appendLabor(laborCatalog[0]?.id || 'supervisor', 8);
            if (laborCatalog.length > 1) appendLabor(laborCatalog[1]?.id || 'canista', 16);
        }

        document.getElementById('btn-create-add-labor')?.addEventListener('click', () => appendLabor('', 16));
        document.getElementById('btn-create-add-mach')?.addEventListener('click', () => appendMach('', 4));

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        const extractTaskFormData = () => {
            const form = document.getElementById('form-create-task');
            if (!form) return null;
            const formData = new FormData(form);
            const name = (formData.get('name') || '').trim();

            const labor = {};
            document.querySelectorAll('#create-task-labor-container .create-labor-row').forEach(row => {
                const sel = row.querySelector('.labor-select-id');
                const inp = row.querySelector('.labor-input-hours');
                if (sel && inp) {
                    const val = parseFloat(inp.value) || 0;
                    if (val > 0) labor[sel.value] = (labor[sel.value] || 0) + val;
                }
            });

            const machinery = {};
            const equipment = {};
            document.querySelectorAll('#create-task-mach-container .create-mach-row').forEach(row => {
                const sel = row.querySelector('.mach-select-id');
                const inp = row.querySelector('.mach-input-hours');
                if (sel && inp) {
                    const val = parseFloat(inp.value) || 0;
                    if (val > 0) {
                        const isEquip = (catalogs.equipment || []).some(e => e.id === sel.value);
                        if (isEquip) {
                            equipment[sel.value] = (equipment[sel.value] || 0) + val;
                        } else {
                            machinery[sel.value] = (machinery[sel.value] || 0) + val;
                        }
                    }
                }
            });

            const targetDest = formData.get('targetDestination');
            const startDate = (formData.get('estimatedStart') || '').trim();
            const addToBacklog = targetDest === 'backlog' || !startDate;

            return {
                name,
                addToBacklog,
                taskData: {
                    name: name || 'Nueva Tarea',
                    tag: (formData.get('tag') || '').trim(),
                    discipline: formData.get('discipline') || 'piping',
                    durationDays: parseInt(formData.get('durationDays')) || 3,
                    estimatedStart: addToBacklog ? null : startDate,
                    notes: (formData.get('notes') || '').trim(),
                    labor,
                    machinery,
                    equipment
                }
            };
        };

        // Guardar y agregar otra tarea (Modo Asistente)
        const addAnotherBtn = document.getElementById('btn-save-and-add-another');
        if (addAnotherBtn) {
            addAnotherBtn.addEventListener('click', () => {
                const form = document.getElementById('form-create-task');
                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const parsed = extractTaskFormData();
                if (!parsed || !parsed.name) {
                    alert('Por favor ingrese al menos el nombre de la tarea para guardarla.');
                    return;
                }

                this.store.createTask(parsed.taskData, parsed.addToBacklog);
                tasksCreatedCount++;
                const countBadge = document.getElementById('wizard-tasks-count');
                if (countBadge) countBadge.textContent = String(tasksCreatedCount);

                this.showToast(`Tarea "${parsed.name}" guardada exitosamente (${tasksCreatedCount} en total). Puedes agregar otra.`, 'success');

                // Limpiar campos para la siguiente tarea
                const nameInp = form.querySelector('input[name="name"]');
                const tagInp = form.querySelector('input[name="tag"]');
                const notesInp = form.querySelector('textarea[name="notes"]');
                if (nameInp) { nameInp.value = ''; nameInp.focus(); }
                if (tagInp) tagInp.value = '';
                if (notesInp) notesInp.value = '';
            });
        }

        // Omitir o finalizar sin agregar más tareas (Modo Asistente)
        const skipBtn = document.getElementById('btn-wizard-skip-tasks');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.showToast(`Configuración de obra finalizada (${tasksCreatedCount} tareas creadas).`, 'info');
                this.closeModal();
            });
        }

        // Botón principal de guardado
        const saveBtn = document.getElementById('btn-save-new-task');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const form = document.getElementById('form-create-task');
                const parsed = extractTaskFormData();

                if (wizardContext) {
                    if (parsed && parsed.name) {
                        this.store.createTask(parsed.taskData, parsed.addToBacklog);
                        tasksCreatedCount++;
                    }
                    this.showToast(`¡Obra y tareas configuradas exitosamente! (${tasksCreatedCount} tareas creadas)`, 'success');
                    this.closeModal();
                    return;
                }

                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                if (!parsed || !parsed.name) {
                    alert('Por favor ingrese el nombre de la tarea.');
                    return;
                }

                this.store.createTask(parsed.taskData, parsed.addToBacklog);
                this.showToast(parsed.addToBacklog ? 'Tarea creada y añadida a la bandeja de pendientes' : 'Tarea creada y programada en el calendario');
                this.closeModal();
            });
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 9. MODALES: SELECTOR DE INFORMES PDF Y CRONOGRAMAS HORIZONTALES
    // ======================================================================
    
    /**
     * Entrada principal al presionar el botón "Informe PDF": Despliega el selector de 4 opciones
     */
    openPrintReportModal() {
        this.openReportSelectorModal();
    }

    /**
     * Modal con las 4 opciones de emisión documental solicitadas por el usuario:
     * 1: Informe ejecutivo completo tal cual lo genera ahora (A4 Portrait)
     * 2: Cronograma Estimado (A4 Landscape)
     * 3: Cronograma Real o en Ejecución (A4 Landscape)
     * 4: Cronograma Comparativa / Control (A4 Landscape)
     */
    openReportSelectorModal() {
        const p = this.store.getActiveProject();
        if (!p) {
            alert('No hay una obra activa seleccionada para generar informes.');
            return;
        }

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
                    
                    <!-- Header -->
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div class="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <i data-lucide="printer" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white">Generar Informe / Exportar a PDF</h3>
                                <p class="text-xs text-slate-400">Selecciona el tipo de informe técnico o cronograma para la obra <strong class="text-slate-200">[${p.code}] ${p.name}</strong></p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- 4 Opciones de Informe -->
                    <div class="p-5 overflow-y-auto space-y-3 custom-scrollbar">
                        
                        <!-- Opción 1: Informe Ejecutivo Completo -->
                        <div class="report-option-card group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 rounded-xl p-4 transition-all cursor-pointer flex items-start gap-3.5 shadow-sm"
                             data-report-type="executive">
                            <div class="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                <i data-lucide="file-text" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between gap-2 mb-1">
                                    <h4 class="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                        1. Informe Ejecutivo Completo
                                    </h4>
                                    <span class="text-[10px] font-semibold bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                                        Vertical (A4 Portrait)
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 leading-relaxed mb-2">
                                    El informe gerencial con resumen de estado, KPIs clave (Avance ponderado, Horas-Hombre real vs plan, SPI, Presupuesto), tabla detallada de tareas programadas y firmas de conformidad comitente/inspección.
                                </p>
                                <span class="text-[11px] font-bold text-cyan-400 group-hover:text-amber-400 flex items-center gap-1">
                                    Abrir Informe Ejecutivo →
                                </span>
                            </div>
                        </div>

                        <!-- Opción 2: Cronograma Estimado -->
                        <div class="report-option-card group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 rounded-xl p-4 transition-all cursor-pointer flex items-start gap-3.5 shadow-sm"
                             data-report-type="estimated">
                            <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                <i data-lucide="calendar-days" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between gap-2 mb-1">
                                    <h4 class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                        2. Cronograma Estimado
                                    </h4>
                                    <span class="text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">
                                        Horizontal (A4 Landscape)
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 leading-relaxed mb-2">
                                    Documento en formato horizontal con título <strong>"Cronograma Estimado"</strong> y la cuadrícula completa de días con las barras de las tareas según su programación inicial planificada.
                                </p>
                                <span class="text-[11px] font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                                    Generar Cronograma Estimado →
                                </span>
                            </div>
                        </div>

                        <!-- Opción 3: Cronograma Real o en Ejecución -->
                        <div class="report-option-card group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl p-4 transition-all cursor-pointer flex items-start gap-3.5 shadow-sm"
                             data-report-type="real">
                            <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                <i data-lucide="activity" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between gap-2 mb-1">
                                    <h4 class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        3. Cronograma Real o en Ejecución
                                    </h4>
                                    <span class="text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                                        Horizontal (A4 Landscape)
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 leading-relaxed mb-2">
                                    Documento en formato horizontal con título <strong>"Cronograma Real o en Ejecución"</strong> y los días de obra con las barras en terreno, indicando el porcentaje (%) de avance físico ejecutado.
                                </p>
                                <span class="text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                                    Generar Cronograma Real →
                                </span>
                            </div>
                        </div>

                        <!-- Opción 4: Cronograma Comparativa / Control -->
                        <div class="report-option-card group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/60 rounded-xl p-4 transition-all cursor-pointer flex items-start gap-3.5 shadow-sm"
                             data-report-type="comparativa">
                            <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                <i data-lucide="git-compare" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between gap-2 mb-1">
                                    <h4 class="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                                        4. Cronograma Comparativa / Control
                                    </h4>
                                    <span class="text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                                        Horizontal (A4 Landscape)
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 leading-relaxed mb-2">
                                    Documento en formato horizontal con título <strong>"Cronograma Comparativa / Control"</strong> y los días de obra con doble barra (Línea Base Planificada vs Avance Real) y cómputo de desvíos en días.
                                </p>
                                <span class="text-[11px] font-bold text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                                    Generar Cronograma Comparativa →
                                </span>
                            </div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div class="p-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
                        <button class="btn-close-modal px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        this.modalRoot.querySelectorAll('.report-option-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.reportType;
                if (type === 'executive') {
                    this.openExecutiveReportModal();
                } else {
                    this.openGanttPrintModal(type);
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Opción 1: Informe Ejecutivo Completo (Existente, en formato vertical Portrait A4)
     */
    openExecutiveReportModal() {
        const p = this.store.getActiveProject();
        if (!p) return;

        this.setPrintPageOrientation('portrait');

        const kpis = this.store.getProjectKPIs();
        const balance = this.store.getResourceBalance();
        const allTasks = [...(p.tasks || [])];
        const isSupervision = this.store.state.isSupervisionMode;

        const html = `
            <div class="printable-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto print:bg-white print:p-0 print:static print:h-auto print:overflow-visible">
                <div class="printable-report-modal bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col print:bg-white print:text-slate-900 print:m-0 print:p-0 print:max-w-none print:shadow-none print:rounded-none">
                    
                    <!-- Header no imprimible -->
                    <div class="p-3 sm:p-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between print:hidden">
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-back-to-options px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer" title="Volver al menú de opciones">
                                <i data-lucide="arrow-left" class="w-4 h-4"></i> Volver a Opciones
                            </button>
                            <span class="font-bold text-slate-700 flex items-center gap-2 text-xs">
                                <i data-lucide="printer" class="w-4 h-4 text-amber-600"></i> Vista Previa de Informe Ejecutivo de Obra ${isSupervision ? '(Operativo)' : ''}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-trigger-print px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer">
                                <i data-lucide="printer" class="w-4 h-4"></i> Imprimir o Guardar PDF
                            </button>
                            <button type="button" class="btn-close-modal px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer">Cerrar</button>
                        </div>
                    </div>

                    <!-- Cuerpo Imprimible -->
                    <div class="printable-content-area p-8 space-y-6 overflow-y-auto text-xs leading-relaxed print:p-0">
                        
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

        const backBtn = this.modalRoot.querySelector('.btn-back-to-options');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.openReportSelectorModal());
        }

        this.modalRoot.querySelectorAll('.btn-trigger-print').forEach(b => {
            b.addEventListener('click', () => this.triggerPrint());
        });

        if (window.lucide) window.lucide.createIcons();
    }

    /**
     * Opciones 2, 3 y 4: Cronogramas Gantt en Formato Horizontal (A4 Landscape)
     * Contienen el título específico requerido y en el cuerpo del documento los días con las barras de las tareas.
     * @param {'estimated' | 'real' | 'comparativa'} reportType
     */
    openGanttPrintModal(reportType = 'estimated') {
        const p = this.store.getActiveProject();
        if (!p) return;

        this.setPrintPageOrientation('landscape');

        // Determinar título exacto solicitado por el usuario
        let docTitle = 'Cronograma Estimado';
        let docSubtitle = 'Planificación Inicial de Tareas';
        
        if (reportType === 'real') {
            docTitle = 'Cronograma Real o en Ejecución';
            docSubtitle = 'Avance Físico y Ejecución en Terreno';
        } else if (reportType === 'comparativa') {
            docTitle = 'Cronograma Comparativa / Control';
            docSubtitle = 'Línea Base vs Avance Real y Desvíos';
        }

        // Obtener rango de fechas del proyecto
        const startDateStr = p.startDate || '2026-09-01';
        const durationDays = p.durationDays || 28;
        const endDateStr = calculateEndDate(startDateStr, durationDays);
        const calendarDates = getDatesRange(startDateStr, endDateStr);
        const totalDays = calendarDates.length || 1;

        const tasks = [...(p.tasks || [])];
        const daysMap = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const disciplines = this.store.getDisciplines();

        // Construir filas de tareas y sus barras de Gantt
        const taskRowsHtml = tasks.map(task => {
            const discStyle = this.getDisciplineStyle(task.discipline);
            const startDayStr = (reportType === 'real') 
                ? (task.realStart || task.estimatedStart) 
                : task.estimatedStart;
            const endDayStr = (reportType === 'real')
                ? (task.realEnd || task.estimatedEnd)
                : task.estimatedEnd;

            let deltaDays = 0;
            if (task.estimatedEnd && task.realEnd) {
                const estTime = new Date(task.estimatedEnd).getTime();
                const realTime = new Date(task.realEnd).getTime();
                deltaDays = Math.round((realTime - estTime) / (1000 * 60 * 60 * 24));
            }

            const dur = Math.max(1, task.durationDays || 1);
            const startIndex = calendarDates.indexOf(startDayStr);
            const endIndex = endDayStr ? calendarDates.indexOf(endDayStr) : -1;
            const isPlaced = startIndex !== -1;

            const calendarSpan = (isPlaced && endIndex !== -1 && endIndex >= startIndex)
                ? (endIndex - startIndex + 1)
                : dur;

            let leftPct = 0;
            let widthPct = 0;
            if (isPlaced) {
                leftPct = (startIndex / totalDays) * 100;
                widthPct = Math.min(100 - leftPct, (calendarSpan / totalDays) * 100);
            }

            const taskDates = [];
            if (isPlaced) {
                for (let i = 0; i < calendarSpan; i++) {
                    const idx = startIndex + i;
                    if (idx < calendarDates.length) taskDates.push(calendarDates[idx]);
                }
            }
            const printNonWorkingOverlay = isPlaced ? `
                <div class="absolute inset-0 flex pointer-events-none z-10">
                    ${taskDates.map(d => {
                        const dayStatus = this.store.getDayStatus(d, p);
                        if (dayStatus.isHoliday && dayStatus.isPaid) {
                            return `
                                <div class="task-bar-pause-holiday-paid h-full flex flex-col items-center justify-center text-[7px] font-black text-purple-900 border-r border-purple-400"
                                     style="width: ${(1 / calendarSpan) * 100}%;"
                                     title="Feriado Pago: ${dayStatus.name}">
                                    <span>FER</span>
                                </div>
                            `;
                        }
                        if (dayStatus.isWeekend) {
                            return `
                                <div class="task-bar-pause-weekend h-full flex flex-col items-center justify-center text-[7px] font-bold text-slate-600 border-r border-slate-300"
                                     style="width: ${(1 / calendarSpan) * 100}%;"
                                     title="Fin de Semana">
                                    <span>FIN</span>
                                </div>
                            `;
                        }
                        return `<div class="h-full border-r border-transparent" style="width: ${(1 / calendarSpan) * 100}%;"></div>`;
                    }).join('')}
                </div>
            ` : '';

            return `
                <div class="print-gantt-row flex items-stretch border-b border-slate-200 text-xs min-h-[38px] hover:bg-slate-50">
                    <!-- Columna Izquierda: Información de Tarea -->
                    <div class="w-56 shrink-0 p-2 border-r-2 border-slate-300 flex flex-col justify-center bg-white">
                        <div class="flex items-center gap-1.5 truncate">
                            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 border"
                                  style="background-color: ${discStyle.tagBg} !important; color: ${discStyle.tagText} !important; border-color: ${discStyle.tagBorder} !important;">
                                ${task.tag || 'TSK'}
                            </span>
                            <span class="font-bold text-slate-900 truncate" title="${task.name}">
                                ${task.name}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                            <span class="uppercase font-bold" style="color: ${discStyle.borderHex} !important;">${discStyle.name.split(' ')[0]}</span>
                            <span>• ${task.durationDays}d lab (${calendarSpan}d)</span>
                            ${reportType !== 'estimated' ? `<span class="font-bold ${task.progress >= 100 ? 'text-blue-600' : 'text-emerald-700'}">${task.progress || 0}%</span>` : ''}
                        </div>
                    </div>

                    <!-- Columna Derecha: Cuadrícula de Días y Barra Gantt -->
                    <div class="flex-grow relative flex items-center bg-white">
                        
                        <!-- Celdas de guía de días de fondo -->
                        <div class="absolute inset-0 flex pointer-events-none">
                            ${calendarDates.map((dateStr) => {
                                const dayStatus = this.store.getDayStatus(dateStr, p);
                                const isPaidHol = dayStatus.isHoliday && dayStatus.isPaid;
                                const isWeekend = dayStatus.isWeekend;
                                const cellBg = isPaidHol 
                                    ? 'bg-purple-100/60 border-r border-purple-300/80' 
                                    : (isWeekend ? 'bg-slate-100/80 border-r border-slate-200' : 'border-r border-slate-200/80');
                                return `
                                    <div class="h-full ${cellBg}" 
                                         style="width: ${(1 / totalDays) * 100}%;"></div>
                                `;
                            }).join('')}
                        </div>

                        <!-- Barra de la tarea -->
                        ${isPlaced ? `
                            <div class="absolute inset-y-1 z-10 transition-all select-none"
                                 style="left: ${leftPct}%; width: ${widthPct}%;">
                                
                                ${reportType === 'estimated' ? `
                                    <!-- MODO ESTIMADO: BARRA PLANIFICADA CON COLOR DE DISCIPLINA EXACTO -->
                                    <div class="h-full rounded ${discStyle.bgClass} ${discStyle.textClass} border ${discStyle.borderClass} shadow-sm flex items-center justify-between px-2 text-[10px] overflow-hidden relative"
                                         style="background-color: ${discStyle.hex} !important; border-color: ${discStyle.borderHex} !important; color: ${discStyle.textHex} !important;">
                                        ${printNonWorkingOverlay}
                                        <span class="truncate relative z-20">${task.tag ? `${task.tag} ` : ''}${task.name}</span>
                                        <span class="font-mono text-[9px] shrink-0 pl-1 font-black relative z-20">${task.durationDays}d</span>
                                    </div>
                                ` : (reportType === 'real' ? `
                                    <!-- MODO REAL O EN EJECUCIÓN: BARRA CON AVANCE REAL -->
                                    <div class="h-full rounded bg-slate-200 border border-slate-400 overflow-hidden shadow-sm relative flex items-center">
                                        <div class="h-full ${task.progress >= 100 ? 'bg-blue-600' : 'bg-emerald-600'} transition-all"
                                             style="width: ${task.progress || 0}%;"></div>
                                        ${printNonWorkingOverlay}
                                        <div class="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold ${task.progress > 45 ? 'text-white' : 'text-slate-900'} relative z-20">
                                            <span class="truncate">${task.tag || ''} ${task.name}</span>
                                            <span class="font-mono shrink-0 pl-1 font-black">${task.progress || 0}%</span>
                                        </div>
                                    </div>
                                ` : `
                                    <!-- MODO COMPARATIVA / CONTROL: DOBLE BARRA (PLAN VS REAL) -->
                                    <div class="h-full rounded border border-slate-400 bg-slate-100 p-0.5 flex flex-col justify-between overflow-hidden shadow-sm relative">
                                        ${printNonWorkingOverlay}
                                        <!-- Barra Superior: Plan con color de disciplina -->
                                        <div class="h-[46%] rounded ${discStyle.bgClass} text-white flex items-center justify-between px-1.5 text-[8px] font-mono shadow-xs relative z-20"
                                             style="background-color: ${discStyle.hex} !important; color: ${discStyle.textHex} !important;">
                                            <span class="truncate font-semibold">Plan: ${task.durationDays}d</span>
                                            <span class="shrink-0 font-bold">${task.tag || ''}</span>
                                        </div>
                                        <!-- Barra Inferior: Real con Desvío -->
                                        <div class="h-[48%] relative rounded bg-slate-300 overflow-hidden border border-slate-400 z-20">
                                            <div class="h-full ${deltaDays > 0 ? 'bg-rose-600' : (task.progress >= 100 ? 'bg-blue-600' : 'bg-emerald-600')}"
                                                 style="width: ${task.progress || 0}%;"></div>
                                            <div class="absolute inset-0 flex items-center justify-between px-1.5 text-[8px] font-bold ${task.progress > 45 ? 'text-white' : 'text-slate-900'}">
                                                <span>Real: ${task.progress || 0}%</span>
                                                ${deltaDays !== 0 ? `
                                                    <span class="font-mono text-[7px] px-1 rounded ${deltaDays > 0 ? 'bg-red-900 text-white' : 'bg-emerald-900 text-white'}">
                                                        ${deltaDays > 0 ? `+${deltaDays}d` : `${deltaDays}d`}
                                                    </span>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `)}

                            </div>
                        ` : `
                            <span class="text-[10px] text-slate-400 italic pl-3 z-10">No asignada al calendario</span>
                        `}

                    </div>
                </div>
            `;
        }).join('');

        const html = `
            <div class="printable-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto print:bg-white print:p-0 print:static print:h-auto print:overflow-visible">
                <div class="printable-report-modal bg-white text-slate-900 rounded-2xl w-full max-w-[98vw] shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col print:bg-white print:text-slate-900 print:m-0 print:p-0 print:max-w-none print:shadow-none print:rounded-none">
                    
                    <!-- Header no imprimible -->
                    <div class="p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between print:hidden">
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-back-to-options px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer" title="Volver al menú de opciones">
                                <i data-lucide="arrow-left" class="w-4 h-4"></i> Volver a Opciones
                            </button>
                            <span class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                <i data-lucide="printer" class="w-4 h-4 text-amber-600"></i> Vista Previa de Impresión Horizontal (Landscape A4)
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-trigger-print px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer">
                                <i data-lucide="printer" class="w-4 h-4"></i> Imprimir o Guardar PDF
                            </button>
                            <button type="button" class="btn-close-modal px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer">
                                Cerrar
                            </button>
                        </div>
                    </div>

                    <!-- Cuerpo Imprimible (Orientación Horizontal A4) -->
                    <div class="printable-content-area p-6 space-y-4 overflow-x-auto overflow-y-auto text-xs print:p-0 print:space-y-3">
                        
                        <!-- Encabezado con el Título del Documento -->
                        <div class="border-b-2 border-slate-900 pb-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                    <h1 class="text-2xl font-black tracking-tight text-slate-950 uppercase leading-tight">
                                        ${docTitle.toUpperCase()}
                                    </h1>
                                    <p class="text-xs font-semibold text-slate-600">
                                        ${docSubtitle} • Obra: <strong class="text-slate-900">[${p.code}] ${p.name}</strong>
                                    </p>
                                </div>
                                <div class="text-right font-mono text-[11px] text-slate-600">
                                    <p>Cliente: <strong class="text-slate-900">${p.client || 'N/A'}</strong></p>
                                    <p>Fecha Inicio: <strong>${p.startDate}</strong> • Plazo: <strong>${p.durationDays} días</strong></p>
                                    <p class="text-[10px] text-slate-500">Emisión: ${new Date().toLocaleDateString('es-AR')}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Cuadrícula Gantt: Días con Barras de Tareas -->
                        <div class="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm" style="min-width: 850px;">
                            
                            <!-- Cabecera de Días -->
                            <div class="flex items-stretch bg-slate-100 border-b-2 border-slate-300 font-bold text-slate-700 select-none">
                                <div class="w-56 shrink-0 p-2.5 border-r-2 border-slate-300 text-[11px] uppercase tracking-wider flex items-center">
                                    Actividad / Tarea de Montaje
                                </div>
                                <div class="flex-grow flex">
                                    ${calendarDates.map((dateStr) => {
                                        const dObj = new Date(dateStr + 'T12:00:00');
                                        const dayLetter = daysMap[dObj.getDay()] || '';
                                        const dayNum = String(dObj.getDate()).padStart(2, '0');
                                        const dayStatus = this.store.getDayStatus(dateStr, p);
                                        const isPaidHol = dayStatus.isHoliday && dayStatus.isPaid;
                                        const isWeekend = dayStatus.isWeekend;
                                        const hdrClass = isPaidHol 
                                            ? 'bg-purple-100 text-purple-900 font-extrabold border-r border-purple-300' 
                                            : (isWeekend ? 'bg-slate-200/70 text-slate-500 border-r border-slate-300' : 'text-slate-800 border-r border-slate-300');
                                        return `
                                            <div class="flex flex-col items-center justify-center py-1 text-center ${hdrClass}"
                                                 style="width: ${(1 / totalDays) * 100}%;"
                                                 title="${dayStatus.name}">
                                                <span class="text-[7.5px] uppercase leading-none font-bold">${dayLetter}</span>
                                                <span class="text-[9.5px] font-black font-mono leading-tight">${dayNum}</span>
                                                ${isPaidHol ? `<span class="text-[6.5px] font-black text-purple-800 leading-none">FER</span>` : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- Filas de Tareas -->
                            <div class="divide-y divide-slate-200">
                                ${taskRowsHtml.length > 0 ? taskRowsHtml : `
                                    <div class="p-8 text-center text-slate-500 italic text-xs">
                                        No hay tareas cargadas en esta obra.
                                    </div>
                                `}
                            </div>

                        </div>

                        <!-- Leyenda Explicativa y Pie de Página -->
                        <div class="flex justify-between items-center pt-2 text-[10px] text-slate-500 flex-wrap gap-2 border-t border-slate-200">
                            <div class="flex items-center gap-3">
                                <span class="font-bold text-slate-700">Referencias:</span>
                                <span class="flex items-center gap-1 font-medium text-slate-600">
                                    <span class="w-2.5 h-2.5 rounded inline-block bg-slate-200 border border-slate-400"></span> Fin Sem
                                </span>
                                <span class="flex items-center gap-1 font-semibold text-purple-800">
                                    <span class="w-2.5 h-2.5 rounded inline-block bg-purple-200 border border-purple-400"></span> Feriado Pago ($)
                                </span>
                                ${reportType === 'estimated' ? `
                                    <div class="flex items-center flex-wrap gap-2.5">
                                        <span class="font-bold text-slate-800">Disciplinas:</span>
                                        ${disciplines.map(d => {
                                            const st = this.getDisciplineStyle(d.id);
                                            return `
                                                <span class="flex items-center gap-1 font-medium text-slate-700">
                                                    <span class="w-2.5 h-2.5 rounded inline-block shadow-xs border"
                                                          style="background-color: ${st.hex} !important; border-color: ${st.borderHex} !important;"></span>
                                                    ${d.name.split(' ')[0]}
                                                </span>
                                            `;
                                        }).join('')}
                                    </div>
                                ` : (reportType === 'real' ? `
                                    <span class="flex items-center gap-1">
                                        <span class="w-3 h-2 rounded bg-emerald-600 inline-block"></span> Relleno Verde/Azul: Avance físico real (%)
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <span class="w-3 h-2 rounded bg-slate-300 border border-slate-400 inline-block"></span> Barra Gris: Duración total
                                    </span>
                                ` : `
                                    <span class="flex items-center gap-1">
                                        <span class="w-3 h-2 rounded bg-slate-700 inline-block"></span> Barra Superior: Línea Base
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <span class="w-3 h-2 rounded bg-emerald-600 inline-block"></span> Relleno Inferior: Avance Real
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <span class="w-3 h-2 rounded bg-rose-600 inline-block"></span> Relleno Rojo: Atraso respecto a Línea Base
                                    </span>
                                `)}
                            </div>
                            <div class="font-mono text-slate-400 text-right">
                                ACHERO • Avance & Control de Obras • Documento Oficial de Montaje
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));
        
        const backBtn = this.modalRoot.querySelector('.btn-back-to-options');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.openReportSelectorModal());
        }

        this.modalRoot.querySelectorAll('.btn-trigger-print').forEach(b => {
            b.addEventListener('click', () => this.triggerPrint());
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ======================================================================
    // 10. MODAL: GESTIÓN DE BASE DE DATOS Y RESPALDOS (EXPORTAR / IMPORTAR)
    // ======================================================================
    openDatabaseModal() {
        const stats = this.store.getDatabaseStats();

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
                    
                    <!-- Header -->
                    <div class="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <i data-lucide="database" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
                                    Base de Datos y Respaldos de Obras
                                </h3>
                                <p class="text-[10px] text-slate-400">Exporta para transferir entre móvil y PC, o restaura respaldos</p>
                            </div>
                        </div>
                        <button type="button" class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Cuerpo scrollable -->
                    <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar text-xs">
                        
                        <!-- Panel de Estado del Almacenamiento Local -->
                        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-bold text-slate-300 flex items-center gap-1.5">
                                    <i data-lucide="hard-drive" class="w-3.5 h-3.5 text-cyan-400"></i> Estado Actual del Almacenamiento
                                </span>
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">Local-First (Activo)</span>
                            </div>
                            <div class="grid grid-cols-3 gap-2.5 text-center mt-2">
                                <div class="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2">
                                    <span class="text-[10px] text-slate-400 block">Obras Registradas</span>
                                    <span class="text-base font-extrabold text-white font-mono">${stats.projectsCount}</span>
                                </div>
                                <div class="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2">
                                    <span class="text-[10px] text-slate-400 block">Tareas Totales</span>
                                    <span class="text-base font-extrabold text-amber-400 font-mono">${stats.tasksCount}</span>
                                </div>
                                <div class="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2">
                                    <span class="text-[10px] text-slate-400 block">Espacio en Memoria</span>
                                    <span class="text-base font-extrabold text-emerald-400 font-mono">${stats.sizeKB} KB</span>
                                </div>
                            </div>
                        </div>

                        <!-- SECCIÓN 1: EXPORTAR / RESPALDAR -->
                        <div class="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div>
                                <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
                                    <i data-lucide="download" class="w-4 h-4 text-emerald-400"></i> 1. Exportar y Descargar Base de Datos
                                </h4>
                                <p class="text-[11px] text-slate-400 mt-1">
                                    Genera un archivo de respaldo con todas tus obras, tareas, partes diarios y catálogos. Puedes enviarlo por WhatsApp, email o guardarlo en tu computadora o celular para transferir toda la información.
                                </p>
                            </div>

                            <div class="flex items-center gap-2 pt-1">
                                <button type="button" id="btn-action-export-db" class="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all">
                                    <i data-lucide="download" class="w-4 h-4"></i>
                                    <span>Descargar Respaldo Completo (.db / .json)</span>
                                </button>
                            </div>
                        </div>

                        <!-- SECCIÓN 2: IMPORTAR / RESTAURAR -->
                        <div class="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div>
                                <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
                                    <i data-lucide="upload-cloud" class="w-4 h-4 text-cyan-400"></i> 2. Importar o Transferir Base de Datos
                                </h4>
                                <p class="text-[11px] text-slate-400 mt-1">
                                    Selecciona un archivo de respaldo (.json o .db) generado previamente para restaurar las obras en este dispositivo.
                                </p>
                            </div>

                            <!-- Selector de archivo oculto -->
                            <input type="file" id="input-import-db-file" accept=".json,.db" class="hidden">

                            <div id="drop-zone-db" class="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40">
                                <i data-lucide="file-up" class="w-7 h-7 mx-auto mb-1.5 text-cyan-400"></i>
                                <span class="text-xs font-semibold text-slate-200 block">Haz clic para seleccionar el archivo de respaldo</span>
                                <span class="text-[10px] text-slate-500">Formatos compatibles: .json o .db</span>
                            </div>

                            <!-- Caja de Previsualización tras seleccionar archivo -->
                            <div id="db-preview-container" class="hidden bg-slate-950 border border-cyan-500/40 rounded-xl p-3.5 space-y-2.5">
                                <div class="flex items-center justify-between text-xs font-bold text-cyan-300">
                                    <span class="flex items-center gap-1.5">
                                        <i data-lucide="file-check-2" class="w-4 h-4 text-emerald-400"></i> Archivo Reconocido con Éxito
                                    </span>
                                    <span id="db-preview-filename" class="text-[10px] font-mono text-slate-400 truncate max-w-[200px]"></span>
                                </div>
                                
                                <div id="db-preview-details" class="text-[11px] text-slate-300 space-y-1 pt-1.5 border-t border-slate-800 font-mono">
                                    <!-- Dinámico -->
                                </div>

                                <!-- Modos de Importación -->
                                <div class="pt-2 border-t border-slate-800 space-y-2">
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase">Modo de Restauración:</label>
                                    <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-amber-500 transition-colors">
                                        <input type="radio" name="db-import-mode" value="overwrite" checked class="mt-0.5 text-amber-500">
                                        <div>
                                            <span class="font-bold text-white block">Restauración Completa (Sobrescribir)</span>
                                            <span class="text-[10px] text-slate-400">Reemplaza el estado de este dispositivo con los datos exactos del archivo (Recomendado).</span>
                                        </div>
                                    </label>
                                    <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-cyan-500 transition-colors">
                                        <input type="radio" name="db-import-mode" value="merge" class="mt-0.5 text-cyan-500">
                                        <div>
                                            <span class="font-bold text-white block">Fusionar / Combinar Obras</span>
                                            <span class="text-[10px] text-slate-400">Agrega las obras del archivo sin eliminar las obras que ya tienes en este dispositivo.</span>
                                        </div>
                                    </label>
                                </div>

                                <button type="button" id="btn-confirm-import-db" class="w-full mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all">
                                    <i data-lucide="check" class="w-4 h-4"></i>
                                    <span>Confirmar e Importar Base de Datos</span>
                                </button>
                            </div>

                        </div>

                    </div>

                    <!-- Footer -->
                    <div class="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
                        <span class="text-[10px] text-slate-500">ACHERO • Base de Datos Portátil SQLite/JSON</span>
                        <button type="button" class="btn-close-modal px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cerrar</button>
                    </div>

                </div>
            </div>
        `;

        this.modalRoot.innerHTML = html;

        // Listeners de Cierre
        this.modalRoot.querySelectorAll('.btn-close-modal').forEach(b => b.addEventListener('click', () => this.closeModal()));

        // Listener de Exportar
        const btnExport = this.modalRoot.querySelector('#btn-action-export-db');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                const res = this.store.exportDatabase('json');
                this.showToast(`Base de datos descargada: ${res.fileName}`);
            });
        }

        // Listener de Selección de Archivo
        const dropZone = this.modalRoot.querySelector('#drop-zone-db');
        const fileInput = this.modalRoot.querySelector('#input-import-db-file');
        const previewContainer = this.modalRoot.querySelector('#db-preview-container');
        const previewFilename = this.modalRoot.querySelector('#db-preview-filename');
        const previewDetails = this.modalRoot.querySelector('#db-preview-details');
        const btnConfirmImport = this.modalRoot.querySelector('#btn-confirm-import-db');

        let loadedData = null;

        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const parsed = JSON.parse(event.target.result);
                        if (!parsed || !Array.isArray(parsed.projects)) {
                            throw new Error('El archivo no contiene un listado de obras válido.');
                        }

                        loadedData = parsed;
                        previewFilename.textContent = file.name;
                        
                        const projectNames = parsed.projects.map(p => p.name).slice(0, 3).join(', ');
                        const extraCount = parsed.projects.length > 3 ? ` y ${parsed.projects.length - 3} más` : '';
                        const totalTasks = parsed.projects.reduce((acc, p) => acc + (p.tasks ? p.tasks.length : 0) + (p.backlog ? p.backlog.length : 0), 0);

                        previewDetails.innerHTML = `
                            <div><strong>• Obras encontradas (${parsed.projects.length}):</strong> ${projectNames}${extraCount}</div>
                            <div><strong>• Tareas contenidas:</strong> ${totalTasks} tareas</div>
                            <div><strong>• Fecha de exportación:</strong> ${parsed.exportedAtLocale || parsed.exportedAt || 'Desconocida'}</div>
                            <div><strong>• Aplicación origen:</strong> ${parsed.app || 'ACHERO'}</div>
                        `;

                        previewContainer.classList.remove('hidden');
                        if (window.lucide) window.lucide.createIcons();
                    } catch (err) {
                        alert('Error al leer el archivo de base de datos: ' + err.message);
                        loadedData = null;
                        previewContainer.classList.add('hidden');
                    }
                };
                reader.readAsText(file);
            });
        }

        // Listener de Confirmar Importación
        if (btnConfirmImport) {
            btnConfirmImport.addEventListener('click', () => {
                if (!loadedData) return;

                const selectedMode = this.modalRoot.querySelector('input[name="db-import-mode"]:checked')?.value || 'overwrite';
                try {
                    const res = this.store.importDatabase(loadedData, selectedMode);
                    this.showToast(`Base de datos importada exitosamente (${res.importedProjectsCount} obras sincronizadas)`);
                    this.closeModal();
                } catch (err) {
                    alert('Error al importar la base de datos: ' + err.message);
                }
            });
        }

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
        this.activeTabTracker = null;
        
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
        this.updateDisciplineFilter();
    }

    updateDisciplineFilter() {
        const discFilter = document.getElementById('filter-discipline');
        if (discFilter) {
            const currentVal = discFilter.value || 'all';
            discFilter.innerHTML = `
                <option value="all">Todas las disciplinas</option>
                ${this.store.getDisciplines().map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            `;
            discFilter.value = currentVal;
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

        // Botón Crear Nueva Obra (Asistente por Pasos: 1. Catálogo -> 2. Parámetros y Capacidad)
        const btnCreateProject = document.getElementById('btn-open-create-project');
        if (btnCreateProject) {
            btnCreateProject.addEventListener('click', () => {
                this.modals.openCreateProjectWizard(1);
            });
        }

        // Botón Eliminar Obra Actual
        const btnDeleteProject = document.getElementById('btn-open-delete-project');
        if (btnDeleteProject) {
            btnDeleteProject.addEventListener('click', () => {
                this.modals.openDeleteProjectModal();
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

        // Botón Gestionar Catálogo (Mano de Obra, Equipos y Disciplinas)
        const btnCatalog = document.getElementById('btn-open-catalog');
        if (btnCatalog) {
            btnCatalog.addEventListener('click', () => {
                this.modals.openCatalogManagerModal();
            });
        }

        // Botón Base de Datos (Respaldar y Transferir Obras)
        const btnDatabase = document.getElementById('btn-open-database');
        if (btnDatabase) {
            btnDatabase.addEventListener('click', () => {
                this.modals.openDatabaseModal();
            });
        }

        // Toggle Bandeja de Pendientes (Lateral Izquierdo en Tab Real)
        const btnToggleBacklogReal = document.getElementById('btn-toggle-backlog-real');
        const backlogSidebar = document.getElementById('backlog-sidebar');
        if (btnToggleBacklogReal && backlogSidebar) {
            btnToggleBacklogReal.addEventListener('click', () => {
                const isHidden = backlogSidebar.classList.contains('hidden');
                if (isHidden) {
                    backlogSidebar.classList.remove('hidden');
                    backlogSidebar.classList.add('flex');
                    btnToggleBacklogReal.classList.add('bg-amber-600/30', 'text-amber-300', 'border-amber-500/60', 'ring-1', 'ring-amber-500/50');
                } else {
                    backlogSidebar.classList.add('hidden');
                    backlogSidebar.classList.remove('flex');
                    btnToggleBacklogReal.classList.remove('bg-amber-600/30', 'text-amber-300', 'border-amber-500/60', 'ring-1', 'ring-amber-500/50');
                }
            });
        }

        const btnCloseBacklog = document.getElementById('btn-close-backlog-sidebar');
        if (btnCloseBacklog && backlogSidebar) {
            btnCloseBacklog.addEventListener('click', () => {
                backlogSidebar.classList.add('hidden');
                backlogSidebar.classList.remove('flex');
                if (btnToggleBacklogReal) {
                    btnToggleBacklogReal.classList.remove('bg-amber-600/30', 'text-amber-300', 'border-amber-500/60', 'ring-1', 'ring-amber-500/50');
                }
            });
        }

        // Botón para crear nueva tarea directamente en Pendientes (sin fecha definida)
        const btnAddBacklogTask = document.getElementById('btn-add-backlog-task');
        if (btnAddBacklogTask) {
            btnAddBacklogTask.addEventListener('click', () => {
                if (window.appModals) {
                    window.appModals.openTaskCreator({ defaultToBacklog: true });
                }
            });
        }

        // Toggle Gaveta Lateral de Tareas de Montaje (Accesible en las 3 pestañas)
        const btnToggleTasksSidebar = document.getElementById('btn-toggle-tasks-sidebar');
        const montageTasksSidebar = document.getElementById('montage-tasks-sidebar');
        if (btnToggleTasksSidebar && montageTasksSidebar) {
            btnToggleTasksSidebar.addEventListener('click', () => {
                const isHidden = montageTasksSidebar.classList.contains('hidden');
                if (isHidden) {
                    montageTasksSidebar.classList.remove('hidden');
                    montageTasksSidebar.classList.add('flex');
                    btnToggleTasksSidebar.classList.add('bg-cyan-600/30', 'text-cyan-300', 'border-cyan-500/60', 'ring-1', 'ring-cyan-500/50');
                } else {
                    montageTasksSidebar.classList.add('hidden');
                    montageTasksSidebar.classList.remove('flex');
                    btnToggleTasksSidebar.classList.remove('bg-cyan-600/30', 'text-cyan-300', 'border-cyan-500/60', 'ring-1', 'ring-cyan-500/50');
                }
            });
        }

        const btnCloseMontage = document.getElementById('btn-close-montage-sidebar');
        if (btnCloseMontage && montageTasksSidebar) {
            btnCloseMontage.addEventListener('click', () => {
                montageTasksSidebar.classList.add('hidden');
                montageTasksSidebar.classList.remove('flex');
                if (btnToggleTasksSidebar) {
                    btnToggleTasksSidebar.classList.remove('bg-cyan-600/30', 'text-cyan-300', 'border-cyan-500/60', 'ring-1', 'ring-cyan-500/50');
                }
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

        // Delegación de eventos para botones globales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modals.activeModal) {
                this.modals.closeModal();
            }
        });
    }

    /**
     * Renderiza la aplicación completa ante cambios de estado
     */
    render(state) {
        this.updateProjectHeader(state);
        this.updateDisciplineFilter();
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

        // Control de visibilidad de las Gavetas Laterales según la pestaña
        const backlogSidebar = document.getElementById('backlog-sidebar');
        const montageSidebar = document.getElementById('montage-tasks-sidebar');
        const btnToggleBacklog = document.getElementById('btn-toggle-backlog-real') || document.getElementById('btn-toggle-backlog');
        const btnToggleTasks = document.getElementById('btn-toggle-tasks-sidebar');

        const tabChanged = this.activeTabTracker !== activeTab;
        this.activeTabTracker = activeTab;

        // El botón de Tareas Montaje permanece SIEMPRE disponible en las 3 pestañas
        if (btnToggleTasks) {
            btnToggleTasks.classList.remove('hidden');
            btnToggleTasks.classList.add('flex');
            if (tabChanged) {
                btnToggleTasks.classList.remove('bg-cyan-600/30', 'text-cyan-300', 'border-cyan-500/60', 'ring-1', 'ring-cyan-500/50');
            }
        }

        // Al cambiar de pestaña, ocultar gavetas para iniciar mostrando el calendario limpio
        if (tabChanged) {
            if (montageSidebar) {
                montageSidebar.classList.add('hidden');
                montageSidebar.classList.remove('flex');
            }
            if (backlogSidebar) {
                backlogSidebar.classList.add('hidden');
                backlogSidebar.classList.remove('flex');
            }
            if (btnToggleBacklog) {
                btnToggleBacklog.classList.remove('bg-amber-600/30', 'text-amber-300', 'border-amber-500/60', 'ring-1', 'ring-amber-500/50');
            }
        }

        if (activeTab === 'estimated' || activeTab === 'real') {
            // Pestañas Estimado y Real: Mostrar botón de Pendientes
            if (btnToggleBacklog) {
                btnToggleBacklog.classList.remove('hidden');
                btnToggleBacklog.classList.add('flex');
            }
        } else if (activeTab === 'comparativa') {
            // Pestaña Comparativa: Ocultar bandeja de pendientes
            if (backlogSidebar) {
                backlogSidebar.classList.add('hidden');
                backlogSidebar.classList.remove('flex');
            }
            if (btnToggleBacklog) {
                btnToggleBacklog.classList.add('hidden');
                btnToggleBacklog.classList.remove('flex');
            }
        }

        // Banner descriptivo según la pestaña activa
        const bannerEl = document.getElementById('tab-context-banner');
        const calendarLegendHtml = `
            <div class="flex items-center gap-3 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800 flex-wrap">
                <span class="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Calendario:</span>
                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Laborable</span>
                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-500"></span> Fin Sem</span>
                <span class="flex items-center gap-1.5 font-bold text-purple-300" title="Haz clic sobre cualquier fecha en la cabecera para configurar feriado o fin de semana"><span class="w-2 h-2 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50"></span> Feriado Pago ($)</span>
                <span class="text-[10px] text-slate-500 italic hidden lg:inline">(Clic en cabecera de día para configurar)</span>
            </div>
        `;

        if (bannerEl) {
            let tabInfoHtml = '';
            if (activeTab === 'estimated') {
                tabInfoHtml = `
                    <div class="flex items-center gap-2 text-xs text-slate-300">
                        <i data-lucide="calendar" class="w-4 h-4 text-blue-400"></i>
                        <span><strong>Pestaña 1: Estimado (Cronograma Base)</strong> — Calendario contractual oficial y tareas programadas en base a lo cotizado.</span>
                    </div>
                `;
            } else if (activeTab === 'real') {
                tabInfoHtml = `
                    <div class="flex items-center gap-2 text-xs text-slate-300">
                        <i data-lucide="activity" class="w-4 h-4 text-emerald-400"></i>
                        <span><strong>Pestaña 2: Real (Ejecución en Terreno)</strong> — Monitoreo efectivo de obra. Asienta partes diarios de avance y horas en cada tarea.</span>
                    </div>
                `;
            } else if (activeTab === 'comparativa') {
                tabInfoHtml = `
                    <div class="flex items-center gap-2 text-xs text-slate-300">
                        <i data-lucide="git-compare" class="w-4 h-4 text-amber-400"></i>
                        <span><strong>Pestaña 3: Comparativa / Control</strong> — Superposición de Línea de Base (arriba) vs. Avance Real (abajo). Cálculos automáticos de desviación en días y Horas-Hombre.</span>
                    </div>
                `;
            }

            bannerEl.innerHTML = `
                <div class="flex flex-wrap items-center justify-between gap-2.5">
                    ${tabInfoHtml}
                    ${calendarLegendHtml}
                </div>
            `;
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
                btnToggle.innerHTML = `<i data-lucide="shield" class="w-4 h-4 text-slate-400"></i> <span class="hidden sm:inline">Modo:</span> Interno`;
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
            'btn-open-delete-project',
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
        const holidaySubtextEl = document.getElementById('kpi-holiday-cost-subtext');
        const holidayLabelEl = document.getElementById('kpi-holiday-cost-label');

        if (costRealEl) costRealEl.textContent = `$${kpis.totalRealCost.toLocaleString()}`;
        if (contractBudgetEl) contractBudgetEl.textContent = `$${kpis.contractBudget.toLocaleString()}`;
        if (marginBadgeEl) {
            const isPositive = kpis.projectedGrossMargin >= 0;
            marginBadgeEl.textContent = `Margen: ${kpis.projectedGrossMarginPct}% ($${kpis.projectedGrossMargin.toLocaleString()})`;
            marginBadgeEl.className = `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`;
        }
        if (holidaySubtextEl && holidayLabelEl) {
            if (kpis.totalHolidayCost > 0) {
                holidaySubtextEl.classList.remove('hidden');
                holidayLabelEl.textContent = `Incluye $${Math.round(kpis.totalHolidayCost).toLocaleString()} en ${kpis.paidHolidaysCount} feriado(s) pago(s)`;
            } else {
                holidaySubtextEl.classList.add('hidden');
            }
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
                conflictsBadge.onclick = () => {
                    const conflicts = this.store.getConflicts();
                    const dates = Object.keys(conflicts.conflictsByDate || {});
                    const targetDate = dates.length > 0 ? dates[0] : this.store.getProjectCutoffDate();
                    this.modals.openConflictInspector(targetDate);
                };
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
