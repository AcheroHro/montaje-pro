// ==========================================================================
// STORE: GESTIÓN DE ESTADO REACTIVO, PERSISTENCIA Y CÁLCULOS KPI
// ==========================================================================

import { INITIAL_PROJECTS, RESOURCE_CATALOG } from './mockData.js';
import { analyzeResourceConflicts, calculateEndDate, getResourceMeta } from './conflictEngine.js';

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
            history.replaceState(null, '', newHash);
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

export const store = new ProjectStore();
