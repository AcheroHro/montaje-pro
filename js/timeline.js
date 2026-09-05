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
        this.columnWidth = 90; // Ancho en px de cada columna diaria en desktop
        this.todayStr = '2026-09-08'; // Fecha simulada de corte de obra
        this.draggedTaskId = null;
        this.montageSearchQuery = '';

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

        // Buscador interno en barra lateral de montaje
        const searchMontageInput = document.getElementById('input-search-montage-sidebar');
        if (searchMontageInput) {
            searchMontageInput.addEventListener('input', (e) => {
                this.montageSearchQuery = e.target.value.toLowerCase().trim();
                const project = this.store.getActiveProject();
                if (project) this.renderMontageTasksSidebar(project.tasks || []);
            });
        }
    }

    formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const dayName = days[d.getDay()];
        const dayNum = String(d.getDate()).padStart(2, '0');
        const monthName = months[d.getMonth()];
        return { dayName, dayNum, monthName, full: `${dayName} ${dayNum} ${monthName}` };
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
     * Render principal del Timeline, Backlog y Barra de Montaje
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

                    <!-- Botones de Acción Rápida -->
                    <div class="flex items-center gap-1.5 pt-1 border-t border-slate-700/60">
                        <button type="button" class="btn-sidebar-dailylog flex-1 px-2 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors" data-task-id="${task.id}">
                            <i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i> Parte Diario
                        </button>
                        <button type="button" class="btn-sidebar-edittask p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors" data-task-id="${task.id}" title="Editar tarea">
                            <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        this.montageContainer.innerHTML = html;

        // Listeners de los botones dentro de la barra
        this.montageContainer.querySelectorAll('.btn-sidebar-dailylog').forEach(b => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                const tid = b.dataset.taskId;
                if (window.appModals) window.appModals.openDailyLogModal(tid);
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
