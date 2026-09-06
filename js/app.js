// ==========================================================================
// APP: BOOTSTRAP, ORQUESTADOR DE VISTAS, DASHBOARD KPI Y CONTROLADORES
// ==========================================================================

import { store } from './store.js';
import { TimelineRenderer } from './timeline.js';
import { ModalManager } from './modals.js';
import { DISCIPLINES } from './mockData.js';

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
