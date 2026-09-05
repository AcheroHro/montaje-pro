// ==========================================================================
// PARSER: IMPORTACIÓN DE PRESUPUESTOS Y LISTAS DE TAREAS (EXCEL, CSV, TEXTO)
// ==========================================================================

import { DISCIPLINES, PRESET_IMPORT_TEMPLATES } from './mockData.js';

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
export function parseBudgetText(rawText) {
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
export function parseJSONBudget(jsonString) {
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
export function getAvailablePresets() {
    return PRESET_IMPORT_TEMPLATES;
}
