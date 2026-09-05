// ==========================================================================
// CONFLICT ENGINE: DETECCIÓN Y ANÁLISIS DE CONFLICTOS DE RECURSOS
// ==========================================================================

import { RESOURCE_CATALOG } from './mockData.js';

/**
 * Genera un array de fechas (YYYY-MM-DD) entre startDate y endDate inclusive
 */
export function getDatesRange(startDateStr, endDateStr) {
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
export function calculateEndDate(startDateStr, durationDays) {
    if (!startDateStr) return null;
    const dur = Math.max(1, parseInt(durationDays) || 1);
    const start = new Date(startDateStr + 'T00:00:00');
    start.setDate(start.getDate() + (dur - 1));
    return start.toISOString().split('T')[0];
}

/**
 * Busca metadatos de un recurso en el catálogo (labor, machinery, equipment)
 */
export function getResourceMeta(resourceId) {
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
export function analyzeResourceConflicts(tasks, resourceLimits = {}, mode = 'estimated') {
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
