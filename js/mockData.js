// ==========================================================================
// MOCK DATA: CATÁLOGO DE RECURSOS, PROYECTOS INDUSTRIALES Y PLANTILLAS
// ==========================================================================

export const RESOURCE_CATALOG = {
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

export const DISCIPLINES = [
    { id: 'piping', name: 'Cañería (Piping)', color: 'blue', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 'estructura', name: 'Estructuras Metálicas', color: 'amber', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'equipos', name: 'Montaje de Equipos', color: 'purple', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'soldadura', name: 'Soldadura Especial', color: 'orange', badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    { id: 'end', name: 'Ensayos No Destructivos (END)', color: 'emerald', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'pruebas', name: 'Pruebas y Comisionado', color: 'cyan', badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' }
];

export const INITIAL_PROJECTS = [
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

export const PRESET_IMPORT_TEMPLATES = [
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
