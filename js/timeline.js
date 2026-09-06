// ==========================================================================
// TIMELINE: RENDERIZADO DE CRONOGRAMA GANTT, COMPARATIVA Y DRAG & DROP
// ==========================================================================

import { DISCIPLINES } from './mockData.js';
import { getDatesRange, calculateEndDate } from './conflictEngine.js';

export class TimelineRenderer {
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
