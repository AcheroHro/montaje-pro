// ==========================================================================
// MODALS: MODALES DE EDICIÓN, PARTE DIARIO, CONFLICTOS E IMPORTADOR
// ==========================================================================

import { DISCIPLINES, RESOURCE_CATALOG } from './mockData.js';
import { parseBudgetText, parseJSONBudget, getAvailablePresets } from './parser.js';

export class ModalManager {
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
