// ==========================================================================
// STORE: GESTIÓN DE ESTADO REACTIVO, PERSISTENCIA Y CÁLCULOS KPI
// ==========================================================================

import { INITIAL_PROJECTS, RESOURCE_CATALOG, DISCIPLINES } from './mockData.js';
import { analyzeResourceConflicts, calculateEndDate, getResourceMeta, formatDateLocal, getDatesRange } from './conflictEngine.js';

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

export const store = new ProjectStore();
