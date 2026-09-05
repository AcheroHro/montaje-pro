// ==========================================================================
// MODALS: MODALES DE EDICIÓN, PARTE DIARIO, CONFLICTOS E IMPORTADOR
// ==========================================================================

import { DISCIPLINES, RESOURCE_CATALOG } from './mockData.js';
import { parseBudgetText, parseJSONBudget, getAvailablePresets } from './parser.js';
import { getDatesRange, calculateEndDate } from './conflictEngine.js';

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
        if (orientation === 'landscape') {
            styleTag.textContent = `@media print { @page { size: landscape; margin: 6mm 8mm; } }`;
        } else {
            styleTag.textContent = `@media print { @page { size: portrait; margin: 8mm; } }`;
        }
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
                        ${(task.dailyLogs && task.dailyLogs.length > 0) ? `
                            <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                                <h5 class="font-bold text-slate-300 mb-2 flex items-center gap-1.5 text-xs text-emerald-400">
                                    <i data-lucide="history" class="w-3.5 h-3.5"></i> Historial de Partes Asentados (${task.dailyLogs.length})
                                </h5>
                                <div class="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                    ${task.dailyLogs.map(l => `
                                        <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
                                            <div class="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-0.5">
                                                <span class="text-emerald-300 font-bold">${l.date}</span>
                                                <span>Avance: <strong class="text-white">${l.progress}%</strong></span>
                                            </div>
                                            ${l.notes ? `<p class="text-slate-300 text-[11px] italic mb-1">"${l.notes}"</p>` : ''}
                                            <div class="flex flex-wrap gap-1 text-[9px] font-mono">
                                                ${Object.entries(l.labor || {}).map(([rId, h]) => `<span class="bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-800 text-cyan-300">${rId}: +${h}h</span>`).join(' ')}
                                                ${Object.entries(l.machinery || {}).map(([mId, h]) => `<span class="bg-orange-950/90 px-1.5 py-0.5 rounded border border-orange-800 text-orange-300">${mId}: +${h}hs</span>`).join(' ')}
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

        const html = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    
                    <div class="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="${wizardContext ? 'list-plus' : 'plus-square'}" class="w-5 h-5 text-amber-400"></i>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="text-base font-bold text-white">${wizardContext ? 'Alta de Tareas de Montaje' : 'Nueva Tarea de Montaje'}</h3>
                                    ${wizardContext ? `
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Paso 3 de 3: Tareas Iniciales</span>
                                    ` : ''}
                                </div>
                                <p class="text-xs text-slate-400">
                                    ${wizardContext ? `Agregando tareas a la nueva obra: <strong class="text-white">${p ? `[${p.code}] ${p.name}` : ''}</strong>` : 'Configura los parámetros, dotación y programación de la tarea'}
                                </p>
                            </div>
                        </div>
                        <button class="btn-close-modal text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    ${wizardContext ? `
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
                            <button type="button" id="btn-save-new-task" class="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                                <i data-lucide="check" class="w-4 h-4"></i> Guardar Tarea
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
            const startDate = formData.get('estimatedStart');
            const addToBacklog = targetDest === 'backlog';

            return {
                name,
                addToBacklog,
                taskData: {
                    name: name || 'Nueva Tarea',
                    tag: (formData.get('tag') || '').trim(),
                    discipline: formData.get('discipline') || 'piping',
                    durationDays: parseInt(formData.get('durationDays')) || 3,
                    estimatedStart: startDate,
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
            <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
                <div class="printable-report-modal bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col print:m-0 print:p-0 print:max-w-none print:shadow-none print:rounded-none">
                    
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
                            <button type="button" onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer">
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

        // Construir filas de tareas y sus barras de Gantt
        const taskRowsHtml = tasks.map(task => {
            const startDayStr = (reportType === 'real') 
                ? (task.realStart || task.estimatedStart) 
                : task.estimatedStart;
            const dur = Math.max(1, task.durationDays || 1);
            const startIndex = calendarDates.indexOf(startDayStr);
            const isPlaced = startIndex !== -1;

            let deltaDays = 0;
            if (task.estimatedEnd && task.realEnd) {
                const estTime = new Date(task.estimatedEnd).getTime();
                const realTime = new Date(task.realEnd).getTime();
                deltaDays = Math.round((realTime - estTime) / (1000 * 60 * 60 * 24));
            }

            let leftPct = 0;
            let widthPct = 0;
            if (isPlaced) {
                leftPct = (startIndex / totalDays) * 100;
                widthPct = Math.min(100 - leftPct, (dur / totalDays) * 100);
            }

            return `
                <div class="print-gantt-row flex items-stretch border-b border-slate-200 text-xs min-h-[38px] hover:bg-slate-50">
                    <!-- Columna Izquierda: Información de Tarea -->
                    <div class="w-56 shrink-0 p-2 border-r-2 border-slate-300 flex flex-col justify-center bg-white">
                        <div class="flex items-center gap-1.5 truncate">
                            <span class="text-[9px] font-mono px-1 py-0.2 rounded font-bold bg-slate-100 text-slate-800 border border-slate-300 shrink-0">
                                ${task.tag || 'TSK'}
                            </span>
                            <span class="font-bold text-slate-900 truncate" title="${task.name}">
                                ${task.name}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                            <span class="uppercase">${task.discipline}</span>
                            <span>• ${task.durationDays}d</span>
                            ${reportType !== 'estimated' ? `<span class="font-bold ${task.progress >= 100 ? 'text-blue-600' : 'text-emerald-700'}">${task.progress || 0}%</span>` : ''}
                        </div>
                    </div>

                    <!-- Columna Derecha: Cuadrícula de Días y Barra Gantt -->
                    <div class="flex-grow relative flex items-center bg-white">
                        
                        <!-- Celdas de guía de días de fondo -->
                        <div class="absolute inset-0 flex pointer-events-none">
                            ${calendarDates.map((dateStr) => {
                                const dObj = new Date(dateStr + 'T12:00:00');
                                const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;
                                return `
                                    <div class="h-full border-r border-slate-200/80 ${isWeekend ? 'bg-slate-50/70' : ''}" 
                                         style="width: ${(1 / totalDays) * 100}%;"></div>
                                `;
                            }).join('')}
                        </div>

                        <!-- Barra de la tarea -->
                        ${isPlaced ? `
                            <div class="absolute inset-y-1 z-10 transition-all select-none"
                                 style="left: ${leftPct}%; width: ${widthPct}%;">
                                
                                ${reportType === 'estimated' ? `
                                    <!-- MODO ESTIMADO: BARRA PLANIFICADA -->
                                    <div class="h-full rounded bg-blue-700 text-white border border-blue-900 shadow-sm flex items-center justify-between px-2 text-[10px] font-bold overflow-hidden">
                                        <span class="truncate">${task.tag || ''} ${task.name}</span>
                                        <span class="font-mono text-[9px] shrink-0 pl-1">${task.durationDays}d</span>
                                    </div>
                                ` : (reportType === 'real' ? `
                                    <!-- MODO REAL O EN EJECUCIÓN: BARRA CON AVANCE REAL -->
                                    <div class="h-full rounded bg-slate-200 border border-slate-400 overflow-hidden shadow-sm relative flex items-center">
                                        <div class="h-full ${task.progress >= 100 ? 'bg-blue-600' : 'bg-emerald-600'} transition-all"
                                             style="width: ${task.progress || 0}%;"></div>
                                        <div class="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold ${task.progress > 45 ? 'text-white' : 'text-slate-900'}">
                                            <span class="truncate">${task.tag || ''} ${task.name}</span>
                                            <span class="font-mono shrink-0 pl-1 font-black">${task.progress || 0}%</span>
                                        </div>
                                    </div>
                                ` : `
                                    <!-- MODO COMPARATIVA / CONTROL: DOBLE BARRA (PLAN VS REAL) -->
                                    <div class="h-full rounded border border-slate-400 bg-slate-100 p-0.5 flex flex-col justify-between overflow-hidden shadow-sm">
                                        <!-- Barra Superior: Plan -->
                                        <div class="h-[46%] rounded bg-slate-700 text-white flex items-center justify-between px-1.5 text-[8px] font-mono">
                                            <span class="truncate">Plan: ${task.durationDays}d</span>
                                            <span class="shrink-0 font-bold">${task.tag || ''}</span>
                                        </div>
                                        <!-- Barra Inferior: Real con Desvío -->
                                        <div class="h-[48%] relative rounded bg-slate-300 overflow-hidden border border-slate-400">
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
            <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
                <div class="printable-report-modal bg-white text-slate-900 rounded-2xl w-full max-w-[98vw] shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col print:m-0 print:p-0 print:max-w-none print:shadow-none print:rounded-none">
                    
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
                            <button type="button" onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer">
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
                                        const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;
                                        return `
                                            <div class="flex flex-col items-center justify-center py-1.5 border-r border-slate-300 text-center ${isWeekend ? 'bg-slate-200/70 text-slate-500' : 'text-slate-800'}"
                                                 style="width: ${(1 / totalDays) * 100}%;">
                                                <span class="text-[8px] uppercase leading-none font-bold">${dayLetter}</span>
                                                <span class="text-[10px] font-black font-mono leading-tight">${dayNum}</span>
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
                                ${reportType === 'estimated' ? `
                                    <span class="flex items-center gap-1">
                                        <span class="w-3 h-2 rounded bg-blue-700 inline-block"></span> Barra Azul: Plazo estimado planificado
                                    </span>
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
