import { CommunityService } from './community-service.js';
import { createBrowserRepository } from './storage.js';

const service = new CommunityService(createBrowserRepository());
const page = location.pathname.split('/').pop() || 'index.html';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character]);

function addDemoBadge() {
  if (document.querySelector('.adc-demo-badge')) return;
  const badge = document.createElement('aside');
  badge.className = 'adc-demo-badge';
  badge.setAttribute('role', 'note');
  badge.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">science</span><span><strong>Prototipo MVP</strong><br>Datos ficticios guardados solo en este navegador.</span>';
  document.body.append(badge);
}

function setPageMetadata() {
  const labels = {
    'portal-vecino.html': 'Portal Vecinal',
    'login-staff.html': 'Acceso de Demostracion',
    'dashboard.html': 'Panel General',
    'talleres.html': 'Gestion de Talleres',
    'inscripciones.html': 'Inscripcion de Vecinos',
    'asistencia.html': 'Control de Asistencia',
    'inventario.html': 'Inventario',
    'reportes.html': 'Reportes',
    'configuracion.html': 'Configuracion'
  };
  document.title = `${labels[page] || 'Centro Comunitario'} | Alto del Carmen`;
}

function localizeBrandImages() {
  document.querySelectorAll('img[alt*="Logo"], img[alt*="logo"]').forEach((image) => {
    image.src = 'logo_araucaria_alto_del_carmen/screen.png';
    image.style.objectFit = 'contain';
  });
}

function statusRegion(form) {
  let region = form.querySelector('.adc-status');
  if (!region) {
    region = document.createElement('div');
    region.className = 'adc-status';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    form.prepend(region);
  }
  return region;
}

function showStatus(region, message, type = 'success') {
  region.textContent = message;
  region.className = `adc-status is-visible is-${type}`;
  region.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function sectorLabel(value) {
  return ({
    'san-felix': 'San Felix Centro',
    'las-pircas': 'Las Pircas',
    'el-transito': 'El Transito Centro',
    chanchoquin: 'Chanchoquin Chico',
    'los-perales': 'Los Perales',
    'la-majada': 'La Majada'
  })[value] || value;
}

function workshopOptions(select, selectedId = '') {
  if (!select) return;
  select.innerHTML = '<option value="">Seleccionar taller con cupo disponible...</option>';
  service.getWorkshops().forEach((workshop) => {
    const option = document.createElement('option');
    option.value = workshop.id;
    option.textContent = `${workshop.name} · ${workshop.startDate} (Cupos: ${workshop.available})`;
    option.disabled = workshop.available === 0 || workshop.status !== 'activo';
    option.selected = workshop.id === selectedId;
    select.append(option);
  });
}

function renderLocalNeighbors() {
  const tbody = document.querySelector('#vecinos-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const state = service.getState();
  const workshopMap = new Map(state.workshops.map((item) => [item.id, item.name]));
  state.neighbors.forEach((neighbor) => {
    const enrollment = state.enrollments.find((item) => item.neighborId === neighbor.id);
    const age = Math.max(0, new Date().getFullYear() - Number(neighbor.birthDate.slice(0, 4)));
    const row = document.createElement('tr');
    row.dataset.source = 'mvp';
    row.className = 'hover:bg-surface-container-low transition-colors';
    row.innerHTML = `
      <td class="py-3 px-space-md font-mono font-semibold">${escapeHtml(neighbor.rut)}</td>
      <td class="py-3 px-space-md"><strong>${escapeHtml(neighbor.name)}</strong><br><span class="text-on-surface-variant text-xs">${escapeHtml(neighbor.phone)} · Registro ficticio</span></td>
      <td class="py-3 px-space-md">${escapeHtml(sectorLabel(neighbor.sector))}</td>
      <td class="py-3 px-space-md">${age} años</td>
      <td class="py-3 px-space-md"><span class="inline-flex px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold">${escapeHtml(enrollment ? workshopMap.get(enrollment.workshopId) : 'Sin taller')}</span></td>
      <td class="py-3 px-space-md"><span class="text-xs text-on-surface-variant">Demostracion</span></td>
      <td class="py-3 px-space-md text-right"><span class="text-xs text-on-surface-variant">Local</span></td>`;
    tbody.prepend(row);
  });
  const activeLabel = [...document.querySelectorAll('span')].find((item) => item.textContent.trim() === 'PADRON ACTIVO' || item.textContent.trim() === 'PADRÓN ACTIVO');
  let activeCard = activeLabel;
  while (activeCard && !activeCard.querySelector?.('.font-display-lg')) activeCard = activeCard.parentElement;
  const activeValue = activeCard?.querySelector('.font-display-lg');
  if (activeValue) activeValue.textContent = String(state.neighbors.length);
  const kpiValues = document.querySelectorAll('.font-display-lg.text-display-lg');
  const olderNeighbors = state.neighbors.filter((neighbor) => new Date().getFullYear() - Number(neighbor.birthDate.slice(0, 4)) >= 60).length;
  if (kpiValues.length >= 4) {
    kpiValues[0].textContent = String(state.neighbors.length);
    kpiValues[1].textContent = String(state.enrollments.length);
    kpiValues[2].textContent = `${state.neighbors.length ? Math.round((olderNeighbors / state.neighbors.length) * 100) : 0}%`;
    kpiValues[3].textContent = String(new Set(state.enrollments.map((item) => item.neighborId)).size);
  }
  const rshClaim = [...document.querySelectorAll('span')].find((item) => item.textContent.includes('validados con Registro'));
  if (rshClaim) rshClaim.textContent = 'Datos ficticios almacenados localmente';
  const showing = [...document.querySelectorAll('span')].find((item) => item.textContent.includes('Mostrando') && item.textContent.includes('registros'));
  if (showing) showing.textContent = `Mostrando ${state.neighbors.length} de ${state.neighbors.length} registros ficticios`;
}

function initEnrollments() {
  const form = document.getElementById('form-vecino');
  if (!form) return;
  form.removeAttribute('onsubmit');
  const region = statusRegion(form);
  const workshopSelect = document.getElementById('taller-select');
  const selected = new URLSearchParams(location.search).get('taller') || '';
  workshopOptions(workshopSelect, selected);
  renderLocalNeighbors();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const result = service.registerAndEnroll({
        name: document.getElementById('nombre-completo').value,
        rut: document.getElementById('rut-vecino').value,
        birthDate: document.getElementById('fecha-nac').value,
        phone: document.getElementById('telefono-vecino').value,
        sector: document.getElementById('sector-select').value,
        address: document.getElementById('direccion-vecino').value,
        transportSupport: form.elements['transporte-rural'].checked,
        reducedMobility: form.elements['movilidad-reducida'].checked
      }, workshopSelect.value);
      const workshop = service.getWorkshops().find((item) => item.id === result.enrollment.workshopId);
      showStatus(region, `${result.neighbor.name} fue ${result.created ? 'registrado e ' : ''}inscrito en ${workshop.name}. Los datos son simulados.`);
      form.reset();
      workshopOptions(workshopSelect);
      renderLocalNeighbors();
    } catch (error) {
      showStatus(region, error.message, 'error');
    }
  });
}

function workshopRow(workshop) {
  return `<tr class="hover:bg-surface-container-low/50 transition-colors" data-source="mvp" data-workshop-id="${escapeHtml(workshop.id)}">
    <td class="py-space-sm px-space-md"><strong>${escapeHtml(workshop.name)}</strong><br><span class="text-xs text-on-surface-variant">COD: ${escapeHtml(workshop.id)} · ${escapeHtml(workshop.category)}</span></td>
    <td class="py-space-sm px-space-md">${escapeHtml(workshop.venue)}<br><span class="text-xs text-on-surface-variant">${escapeHtml(workshop.room)}</span></td>
    <td class="py-space-sm px-space-md">${escapeHtml(workshop.schedule)}</td>
    <td class="py-space-sm px-space-md">${escapeHtml(workshop.monitor)}</td>
    <td class="py-space-sm px-space-md"><strong>${workshop.enrolled}/${workshop.capacity}</strong><br><span class="text-xs">${workshop.available} disponibles</span></td>
    <td class="py-space-sm px-space-md"><span class="inline-flex px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold">${escapeHtml(workshop.status)}</span></td>
    <td class="py-space-sm px-space-md text-right"><button type="button" data-action="view-participants" data-workshop-id="${escapeHtml(workshop.id)}" class="text-secondary font-bold hover:underline">Ver inscritos</button></td>
  </tr>`;
}

function renderWorkshops() {
  const tbody = document.querySelector('#workshops-table tbody');
  if (!tbody) return;
  tbody.innerHTML = service.getWorkshops().map(workshopRow).join('');
}

function initWorkshops() {
  const table = document.querySelector('table');
  if (!table) return;
  table.id = 'workshops-table';
  renderWorkshops();
  initWorkshopParticipants(table);
  const form = document.getElementById('form-taller');
  if (!form) return;
  form.removeAttribute('onsubmit');
  const region = statusRegion(form);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const workshop = service.createWorkshop(Object.fromEntries(new FormData(form)));
      renderWorkshops();
      form.reset();
      document.getElementById('modal-crear-taller').classList.add('hidden');
      showStatus(region, `${workshop.name} fue creado con datos simulados.`);
    } catch (error) {
      showStatus(region, error.message, 'error');
    }
  });
}

function workshopParticipantsDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'adc-dialog';
  dialog.id = 'workshop-participants-dialog';
  dialog.innerHTML = `<div class="adc-dialog-card" role="document">
    <div class="flex items-start justify-between gap-4 border-b border-surface-container-high pb-4">
      <div><p class="text-xs uppercase tracking-wider text-primary font-bold">Gestión de talleres</p><h2 id="participants-title" class="text-xl font-bold mt-1">Participantes del taller</h2><p id="participants-meta" class="text-sm text-on-surface-variant mt-1"></p></div>
      <button type="button" data-action="close-participants" aria-label="Cerrar participantes" class="p-2 rounded-lg hover:bg-surface-container-high text-on-surface">✕</button>
    </div>
    <div id="participants-status" class="adc-status mt-4" role="status" aria-live="polite"></div>
    <div class="mt-4 flex items-center justify-between gap-3 flex-wrap"><div><span class="text-xs uppercase text-on-surface-variant font-bold">Vecinos inscritos</span><p id="participants-count" class="text-sm text-on-surface-variant"></p></div><input id="participants-search" aria-label="Buscar participante" class="h-10 px-3 rounded-lg bg-surface-container-low border border-transparent" placeholder="Buscar por nombre o RUT"></div>
    <div id="participants-list" class="mt-3 max-h-56 overflow-auto border border-surface-container-high rounded-lg"></div>
    <div class="mt-6 pt-5 border-t border-surface-container-high"><h3 class="font-bold text-on-surface">Asignar vecino ya registrado</h3><p class="text-sm text-on-surface-variant mt-1">Selecciona una persona del padrón que todavía no pertenezca a este taller.</p><form id="assign-existing-form" class="flex flex-col sm:flex-row gap-3 mt-3"><label class="sr-only" for="existing-neighbor-select">Vecino registrado</label><select id="existing-neighbor-select" class="flex-1 h-11 px-3 rounded-lg bg-surface-container-low" required><option value="">Seleccionar vecino del padrón...</option></select><button class="h-11 px-4 rounded-lg bg-secondary text-white font-bold" type="submit">Asignar vecino</button></form></div>
    <div class="mt-6 pt-5 border-t border-surface-container-high"><details><summary class="cursor-pointer font-bold text-on-surface">Registrar e inscribir un vecino nuevo</summary><form id="new-neighbor-form" class="adc-form-grid mt-4"><label>Nombre completo<input name="name" required placeholder="Ej: Rosa Valenzuela"></label><label>RUT<input name="rut" required placeholder="12.345.678-5"></label><label>Fecha de nacimiento<input name="birthDate" type="date" required></label><label>Teléfono<input name="phone" type="tel" required placeholder="+56 9 1234 5678"></label><label>Sector<select name="sector" required><option value="">Seleccionar...</option><option value="san-felix">San Félix</option><option value="el-transito">El Tránsito</option><option value="las-pircas">Las Pircas</option><option value="chanchoquin">Chanchoquín Chico</option></select></label><label>Dirección<input name="address" placeholder="Opcional"></label><div class="sm:col-span-2 flex justify-end"><button class="h-11 px-4 rounded-lg bg-primary text-white font-bold" type="submit">Registrar e inscribir</button></div></form></details></div>
  </div>`;
  document.body.append(dialog);
  return dialog;
}

function initWorkshopParticipants(table) {
  const dialog = workshopParticipantsDialog();
  let selectedWorkshopId = '';
  const title = dialog.querySelector('#participants-title');
  const meta = dialog.querySelector('#participants-meta');
  const count = dialog.querySelector('#participants-count');
  const list = dialog.querySelector('#participants-list');
  const search = dialog.querySelector('#participants-search');
  const select = dialog.querySelector('#existing-neighbor-select');
  const status = dialog.querySelector('#participants-status');
  const showMessage = (message, type = 'success') => showStatus(status, message, type);

  const render = () => {
    const workshop = service.getWorkshops().find((item) => item.id === selectedWorkshopId);
    if (!workshop) return;
    const participants = service.getParticipants(selectedWorkshopId);
    const query = search.value.trim().toLowerCase();
    const filtered = participants.filter((neighbor) => `${neighbor.name} ${neighbor.rut}`.toLowerCase().includes(query));
    title.textContent = `Participantes: ${workshop.name}`;
    meta.textContent = `${workshop.id} · ${workshop.venue} · ${workshop.schedule}`;
    count.textContent = `${workshop.enrolled} de ${workshop.capacity} cupos ocupados · ${workshop.available} disponibles`;
    list.innerHTML = filtered.length ? `<table class="w-full text-left text-sm"><thead class="bg-surface-container-low"><tr><th class="p-3">Vecino</th><th class="p-3">RUT</th><th class="p-3">Sector</th><th class="p-3">Contacto</th></tr></thead><tbody>${filtered.map((neighbor) => `<tr class="border-t border-surface-container-high"><td class="p-3 font-semibold">${escapeHtml(neighbor.name)}</td><td class="p-3 font-mono">${escapeHtml(neighbor.rut)}</td><td class="p-3">${escapeHtml(sectorLabel(neighbor.sector))}</td><td class="p-3">${escapeHtml(neighbor.phone)}</td></tr>`).join('')}</tbody></table>` : '<p class="p-5 text-center text-sm text-on-surface-variant">No hay participantes que coincidan con la búsqueda.</p>';
    const available = service.getAvailableNeighbors(selectedWorkshopId);
    select.innerHTML = '<option value="">Seleccionar vecino del padrón...</option>' + available.map((neighbor) => `<option value="${escapeHtml(neighbor.id)}">${escapeHtml(neighbor.name)} · ${escapeHtml(neighbor.rut)} · ${escapeHtml(sectorLabel(neighbor.sector))}</option>`).join('');
    select.disabled = workshop.available === 0 || available.length === 0;
    dialog.querySelector('#assign-existing-form button').disabled = select.disabled;
  };

  table.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action="view-participants"]');
    if (!action) return;
    selectedWorkshopId = action.dataset.workshopId;
    search.value = '';
    status.className = 'adc-status';
    render();
    dialog.showModal();
  });
  search.addEventListener('input', render);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('[data-action="close-participants"]')) dialog.close();
  });
  dialog.querySelector('#assign-existing-form').addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const neighbor = service.getState().neighbors.find((item) => item.id === select.value);
      service.enrollNeighbor(select.value, selectedWorkshopId);
      renderWorkshops();
      render();
      showMessage(`${neighbor.name} fue asignado correctamente al taller.`);
    } catch (error) { showMessage(error.message, 'error'); }
  });
  dialog.querySelector('#new-neighbor-form').addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const form = event.currentTarget;
      const result = service.registerAndEnroll(Object.fromEntries(new FormData(form)), selectedWorkshopId);
      renderWorkshops();
      render();
      form.reset();
      showMessage(`${result.neighbor.name} fue registrado e inscrito correctamente.`);
    } catch (error) { showMessage(error.message, 'error'); }
  });
}

function attendanceButton(status, active = false) {
  const activeClass = status === 'presente'
    ? 'bg-primary-container text-on-primary-container'
    : status === 'ausente' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
  return `<button type="button" data-status="${status}" class="status-btn ${active ? `active font-bold ${activeClass}` : 'text-on-surface-variant hover:bg-surface-container-high'} px-3 py-1.5 rounded-lg font-label-md transition-all">${status[0].toUpperCase() + status.slice(1)}</button>`;
}

function updateAttendanceMetrics() {
  const rows = [...document.querySelectorAll('#attendanceTable tbody tr')];
  const statuses = rows.map((row) => row.querySelector('.status-btn.active')?.dataset.status).filter(Boolean);
  const present = statuses.filter((status) => status === 'presente').length;
  const justified = statuses.filter((status) => status === 'justificado').length;
  const absent = statuses.filter((status) => status === 'ausente').length;
  const percent = rows.length ? Math.round((present / rows.length) * 100) : 0;
  document.getElementById('statAttendancePercent').textContent = `${percent}%`;
  document.getElementById('statProgressBar').style.width = `${percent}%`;
  document.getElementById('statPresentCount').textContent = String(present);
  document.getElementById('statJustifiedCount').textContent = String(justified);
  document.getElementById('statUnjustifiedCount').textContent = String(absent);
}

function renderAttendance() {
  const select = document.getElementById('tallerSelector');
  const tbody = document.querySelector('#attendanceTable tbody');
  if (!select || !tbody) return;
  const participants = service.getParticipants(select.value);
  tbody.innerHTML = participants.map((neighbor) => `<tr class="hover:bg-surface-container-low" data-rut="${escapeHtml(neighbor.id)}">
    <td class="py-3 px-space-lg font-mono font-semibold">${escapeHtml(neighbor.rut)}</td>
    <td class="py-3 px-space-md"><strong>${escapeHtml(neighbor.name)}</strong><br><span class="text-xs text-on-surface-variant">${escapeHtml(sectorLabel(neighbor.sector))}</span></td>
    <td class="py-3 px-space-md">${escapeHtml(neighbor.phone)}</td>
    <td class="py-3 px-space-md"><span class="text-on-surface-variant">Sin historial previo</span></td>
    <td class="py-3 px-space-lg"><div class="status-btn-group flex items-center justify-center gap-1.5">${attendanceButton('presente', true)}${attendanceButton('ausente')}${attendanceButton('justificado')}</div></td>
  </tr>`).join('');
  if (!participants.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-on-surface-variant">Este taller aun no tiene participantes inscritos en los datos de demostracion.</td></tr>';
  }
  updateAttendanceMetrics();
}

function initAttendance() {
  const select = document.getElementById('tallerSelector');
  if (!select) return;
  select.innerHTML = service.getWorkshops().filter((item) => item.status === 'activo').map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} (${escapeHtml(item.venue)})</option>`).join('');
  const preferred = service.getWorkshops().find((item) => item.id === 'TLL-ET-02');
  if (preferred) select.value = preferred.id;
  select.addEventListener('change', renderAttendance);
  renderAttendance();

  document.getElementById('btnMarkAll')?.addEventListener('click', () => {
    document.querySelectorAll('#attendanceTable [data-status="presente"]').forEach((button) => button.click());
  });
  document.getElementById('btnResetAttendance')?.addEventListener('click', () => {
    document.querySelectorAll('#attendanceTable .status-btn').forEach((button) => button.classList.remove('active', 'font-bold', 'bg-primary-container', 'text-on-primary-container', 'bg-error-container', 'text-on-error-container', 'bg-tertiary-fixed', 'text-on-tertiary-fixed-variant'));
    updateAttendanceMetrics();
  });

  const oldSave = document.getElementById('btnSaveBook');
  const save = oldSave.cloneNode(true);
  oldSave.replaceWith(save);
  save.addEventListener('click', () => {
    try {
      const records = [...document.querySelectorAll('#attendanceTable tbody tr[data-rut]')].map((row) => ({
        neighborId: row.dataset.rut,
        status: row.querySelector('.status-btn.active')?.dataset.status
      }));
      service.saveAttendance(select.value, new Date().toISOString().slice(0, 10), records, document.getElementById('sessionNotes').value);
      window.ADCShowToast?.('Asistencia guardada localmente', 'La sesion quedo registrada como dato simulado en este navegador.');
    } catch (error) {
      window.ADCShowToast?.('No se pudo guardar', error.message);
    }
  });
}

function inventoryStatusLabel(status) {
  return ({ disponible: 'Disponible', asignado: 'Asignado', mantencion: 'En mantencion', 'stock-critico': 'Stock critico', baja: 'De baja' })[status] || status;
}

function renderInventory() {
  const tbody = document.querySelector('#inventory-table tbody');
  if (!tbody) return;
  tbody.innerHTML = service.getState().inventory.map((item) => `<tr data-item-id="${escapeHtml(item.id)}" class="hover:bg-surface-container-low/60">
    <td class="py-space-sm px-space-md"><strong>${escapeHtml(item.name)}</strong><br><span class="font-mono text-xs text-on-surface-variant">${escapeHtml(item.id)} · ${escapeHtml(item.category)}</span></td>
    <td class="py-space-sm px-space-sm">${escapeHtml(item.venue)}</td>
    <td class="py-space-sm px-space-sm"><select aria-label="Estado de ${escapeHtml(item.name)}" class="adc-inventory-status bg-surface-container-low rounded-lg p-2">${['disponible', 'asignado', 'mantencion', 'stock-critico', 'baja'].map((status) => `<option value="${status}" ${status === item.status ? 'selected' : ''}>${inventoryStatusLabel(status)}</option>`).join('')}</select></td>
    <td class="py-space-sm px-space-sm"><input aria-label="Cantidad de ${escapeHtml(item.name)}" class="adc-inventory-quantity w-20 bg-surface-container-low rounded-lg p-2" type="number" min="0" value="${item.quantity}"></td>
    <td class="py-space-sm px-space-sm">${escapeHtml(item.assignment)}</td>
    <td class="py-space-sm px-space-md text-right"><button type="button" data-action="save-inventory" class="px-3 py-2 rounded-lg bg-primary text-on-primary font-bold">Guardar</button></td>
  </tr>`).join('');
  const state = service.getState();
  const cards = [...document.querySelectorAll('section')].find((section) => section.textContent.includes('Total de Bienes'))?.children;
  if (cards?.length >= 4) {
    cards[0].querySelector('.font-display-lg').textContent = String(state.inventory.length);
    cards[1].querySelector('.font-display-lg').textContent = String(state.inventory.filter((item) => item.status === 'disponible').reduce((sum, item) => sum + item.quantity, 0));
    cards[2].querySelector('.font-display-lg').textContent = String(state.inventory.filter((item) => item.status === 'asignado').reduce((sum, item) => sum + item.quantity, 0));
    cards[3].querySelector('.font-display-lg').textContent = String(state.inventory.filter((item) => ['mantencion', 'stock-critico', 'baja'].includes(item.status)).length);
  }
}

function inventoryDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'adc-dialog';
  dialog.innerHTML = `<form method="dialog" class="adc-dialog-card" id="inventory-create-form">
    <div class="flex items-center justify-between mb-5"><div><p class="text-xs uppercase text-primary font-bold">Datos simulados</p><h2 class="text-xl font-bold">Registrar elemento de inventario</h2></div><button value="cancel" aria-label="Cerrar" class="p-2">✕</button></div>
    <div class="adc-status" role="status" aria-live="polite"></div>
    <div class="adc-form-grid">
      <label>Codigo<input name="id" required placeholder="EQ-NUEVO-01"></label>
      <label>Nombre<input name="name" required></label>
      <label>Categoria<select name="category"><option>Tecnologia</option><option>Herramientas</option><option>Consumibles</option><option>Otros</option></select></label>
      <label>Sede<input name="venue" required></label>
      <label>Cantidad<input name="quantity" type="number" min="0" required value="1"></label>
      <label>Estado<select name="status"><option value="disponible">Disponible</option><option value="mantencion">En mantencion</option><option value="stock-critico">Stock critico</option></select></label>
    </div>
    <div class="flex justify-end gap-3 mt-6"><button value="cancel" class="px-4 py-2 rounded-lg bg-surface-container-high">Cancelar</button><button value="default" class="px-4 py-2 rounded-lg bg-primary text-white font-bold">Registrar</button></div>
  </form>`;
  document.body.append(dialog);
  return dialog;
}

function initInventory() {
  const table = document.querySelector('table');
  if (!table) return;
  table.id = 'inventory-table';
  const header = table.querySelector('thead tr');
  header.innerHTML = '<th class="py-space-sm px-space-md">Bien y codigo</th><th class="py-space-sm px-space-sm">Sede</th><th class="py-space-sm px-space-sm">Estado</th><th class="py-space-sm px-space-sm">Cantidad</th><th class="py-space-sm px-space-sm">Asignacion</th><th class="py-space-sm px-space-md text-right">Acciones</th>';
  renderInventory();
  table.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="save-inventory"]');
    if (!button) return;
    const row = button.closest('[data-item-id]');
    try {
      const item = service.updateInventory(row.dataset.itemId, {
        quantity: row.querySelector('.adc-inventory-quantity').value,
        status: row.querySelector('.adc-inventory-status').value
      });
      button.textContent = 'Actualizado';
      setTimeout(() => { button.textContent = 'Guardar'; }, 1800);
      button.setAttribute('aria-label', `${item.name} actualizado localmente`);
    } catch (error) {
      alert(error.message);
    }
  });

  const createButton = [...document.querySelectorAll('button')].find((button) => button.textContent.includes('Registrar Nuevo'));
  const dialog = inventoryDialog();
  createButton?.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('form').addEventListener('submit', (event) => {
    const submitter = event.submitter;
    if (submitter?.value === 'cancel') return;
    event.preventDefault();
    const form = event.currentTarget;
    try {
      service.createInventoryItem(Object.fromEntries(new FormData(form)));
      renderInventory();
      form.reset();
      dialog.close();
    } catch (error) {
      showStatus(form.querySelector('.adc-status'), error.message, 'error');
    }
  });
}

function renderReport() {
  const report = service.getReport();
  const anchor = document.querySelector('main > div, main div');
  if (!anchor || document.getElementById('adc-live-report')) return;
  const section = document.createElement('section');
  section.id = 'adc-live-report';
  section.className = 'bg-surface-container-low p-space-lg rounded-xl';
  section.innerHTML = `<div class="flex flex-col sm:flex-row justify-between gap-3 mb-4"><div><span class="text-xs uppercase tracking-wider text-primary font-bold">Resumen conectado</span><h2 class="text-xl font-bold text-on-surface">Indicadores de la demostracion local</h2></div><span class="text-sm text-on-surface-variant">No corresponde a una rendicion oficial</span></div>
    <div class="adc-report-grid">
      <article class="adc-report-card"><span>Talleres activos</span><strong>${report.activeWorkshops}</strong></article>
      <article class="adc-report-card"><span>Vecinos ficticios</span><strong>${report.neighbors}</strong><small>${report.enrollments} inscripciones</small></article>
      <article class="adc-report-card"><span>Asistencia registrada</span><strong>${report.attendancePercent}%</strong><small>${report.sessions} sesiones locales</small></article>
      <article class="adc-report-card"><span>Unidades en inventario</span><strong>${report.inventoryTotal}</strong><small>${report.inventoryAlerts} alertas</small></article>
    </div>`;
  anchor.prepend(section);
}

function downloadDemoReport(fileName) {
  const report = service.getReport();
  const content = `REPORTE DE DEMOSTRACION - CENTRO COMUNITARIO ALTO DEL CARMEN\nNo es un documento oficial.\n\n${JSON.stringify(report, null, 2)}`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  link.download = fileName.replace(/\.(pdf|xlsx)$/i, '.txt');
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadEnrollmentPdf(result, workshop, date) {
  const ascii = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, '');
  const lines = [
    'CENTRO COMUNITARIO ALTO DEL CARMEN',
    'COMPROBANTE DE INSCRIPCION - DATOS DE DEMOSTRACION',
    '',
    `Codigo: ${result.enrollment.id}`,
    `Participante: ${result.neighbor.name}`,
    `RUT: ${result.neighbor.rut}`,
    `Telefono: ${result.neighbor.phone}`,
    `Sector: ${sectorLabel(result.neighbor.sector)}`,
    '',
    `Taller: ${workshop.name}`,
    `Fecha: ${date}`,
    `Horario: ${workshop.schedule}`,
    `Sede: ${workshop.venue}`,
    `Sala: ${workshop.room}`,
    `Direccion: ${workshop.address}`,
    `Monitor: ${workshop.monitor}`,
    '',
    'Importante: este comprobante fue generado por un prototipo local.',
    'La inscripcion no fue enviada a un sistema municipal oficial.'
  ].map(ascii);
  const escapePdf = (value) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const text = ['BT', '/F1 11 Tf', '50 790 Td', ...lines.flatMap((line, index) => [index ? '0 -21 Td' : '', `(${escapePdf(line)}) Tj`]).filter(Boolean), 'ET'].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  link.download = `comprobante-inscripcion-${result.enrollment.id.replace(/[^a-zA-Z0-9-]/g, '-')}.pdf`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function initReports() {
  renderReport();
  const historicalMetric = [...document.querySelectorAll('span')].find((item) => item.textContent.includes('Asistencias Verificadas'));
  const historicalGrid = historicalMetric?.closest('.grid');
  historicalGrid?.insertAdjacentHTML('beforebegin', '<p class="text-xs text-on-surface-variant -mb-3"><strong>Referencia visual histórica:</strong> las tarjetas siguientes conservan contenido ilustrativo del diseño original y no representan datos oficiales.</p>');
  const historicalHeading = [...document.querySelectorAll('h2')].find((heading) => heading.textContent.includes('Comparativa de Asistencia'));
  if (historicalHeading) {
    historicalHeading.insertAdjacentHTML('afterend', '<p class="mt-2 text-xs text-on-surface-variant">Visualizacion historica ilustrativa del prototipo; no se actualiza desde una fuente oficial.</p>');
  }
  window.triggerDownload = downloadDemoReport;
  const oldGenerate = document.getElementById('btnGenerateAll');
  if (oldGenerate) {
    const generate = oldGenerate.cloneNode(true);
    oldGenerate.replaceWith(generate);
    generate.addEventListener('click', () => {
      downloadDemoReport('resumen-demostracion.txt');
      window.showToast?.('Resumen de demostracion generado', 'Se descargo un TXT con indicadores locales, sin validez oficial.');
    });
  }
  const oldDispatch = document.getElementById('btnDispatch');
  if (oldDispatch) {
    const dispatch = oldDispatch.cloneNode(true);
    oldDispatch.replaceWith(dispatch);
    dispatch.addEventListener('click', () => window.showToast?.('Funcion pendiente de backend', 'El prototipo no envia datos ni notificaciones a organismos externos.'));
  }
}

function initPortal() {
  const cards = [...document.querySelectorAll('.workshop-card')];
  const workshopIds = ['TLL-ET-03', 'TLL-ET-02', 'TLL-SF-01', 'TLL-ET-06', 'TLL-SF-05', 'TLL-SF-04'];
  const workshops = service.getWorkshops();
  const headerNav = document.querySelector('header nav');
  const headerActions = headerNav?.parentElement;
  if (headerActions && !document.getElementById('mobile-menu-button')) {
    const menuButton = document.createElement('button');
    menuButton.id = 'mobile-menu-button';
    menuButton.type = 'button';
    menuButton.className = 'adc-mobile-menu-button';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'mobile-citizen-menu');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    menuButton.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">menu</span>';
    headerActions.prepend(menuButton);
    const mobileMenu = document.createElement('nav');
    mobileMenu.id = 'mobile-citizen-menu';
    mobileMenu.className = 'adc-mobile-menu';
    mobileMenu.setAttribute('aria-label', 'Navegación ciudadana');
    mobileMenu.innerHTML = '<a href="#inicio">Inicio</a><a href="#talleres-section">Talleres</a><a href="#sectores">Sedes</a><a href="#noticias">Avisos</a><button type="button" data-action="my-enrollments">Mis inscripciones</button><a href="#ayuda-ciudadana">Necesito ayuda</a>';
    document.body.append(mobileMenu);
    menuButton.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) mobileMenu.classList.remove('is-open');
      if (event.target.closest('[data-action="my-enrollments"]')) showMyEnrollments();
    });
  }

  const resultCount = document.getElementById('workshop-result-count');
  const updateResultCount = () => {
    if (resultCount) resultCount.textContent = `Mostrando ${cards.filter((card) => card.style.display !== 'none').length} talleres disponibles`;
  };
  cards.forEach((card, index) => {
    const id = workshopIds[index];
    card.dataset.workshopId = id;
    const workshop = workshops.find((item) => item.id === id);
    const button = card.querySelector('button');
    if (!button) return;
    button.type = 'button';
    button.setAttribute('aria-label', `Quiero inscribirme en ${workshop?.name || 'este taller'}`);
    button.querySelector('span')?.replaceChildren(document.createTextNode(workshop?.available === 0 ? 'Anotarme en lista de espera' : 'Quiero inscribirme'));
    if (workshop?.available === 0) button.classList.add('opacity-75');
    button.addEventListener('click', () => {
      if (workshop?.available === 0) {
        window.alert('Este taller está completo. La lista de espera quedará disponible cuando se implemente el backend.');
        return;
      }
      openCitizenEnrollment(id);
    });
  });
  updateResultCount();
  document.querySelectorAll('.filter-pill').forEach((pill) => pill.addEventListener('click', () => setTimeout(updateResultCount, 0)));
  document.getElementById('searchInput')?.addEventListener('input', () => setTimeout(updateResultCount, 0));
  addCitizenHelpLink();
}

function citizenDialog(title, content) {
  const dialog = document.createElement('dialog');
  dialog.className = 'adc-dialog';
  dialog.innerHTML = `<div class="adc-dialog-card" role="document"><div class="flex items-start justify-between gap-4 border-b border-surface-container-high pb-4"><div><p class="text-xs uppercase tracking-wider text-primary font-bold">Centro Comunitario</p><h2 class="text-xl font-bold mt-1">${title}</h2></div><button type="button" data-action="close" aria-label="Cerrar" class="p-2 rounded-lg hover:bg-surface-container-high">✕</button></div>${content}</div>`;
  document.body.append(dialog);
  dialog.addEventListener('click', (event) => { if (event.target === dialog || event.target.closest('[data-action="close"]')) dialog.close(); });
  dialog.addEventListener('close', () => dialog.remove());
  return dialog;
}

function openCitizenEnrollment(workshopId) {
  const workshop = service.getWorkshops().find((item) => item.id === workshopId);
  if (!workshop) return;
  const dialog = citizenDialog('Solicitar inscripción', `<p class="text-sm text-on-surface-variant mt-4">Taller seleccionado: <strong>${escapeHtml(workshop.name)}</strong><br><span id="citizen-workshop-location">${escapeHtml(workshop.venue)} · ${escapeHtml(workshop.schedule)}</span><br><strong id="citizen-availability">${workshop.available} cupos disponibles</strong></p><div class="adc-stepper" aria-label="Pasos de inscripción"><span class="is-active">1. Identificación</span><span>2. Fecha y contacto</span><span>3. Confirmación</span></div><form id="citizen-enrollment-form" class="mt-4"><div class="adc-citizen-step is-active" data-step="1"><label>Nombre completo<input name="name" required autocomplete="name" placeholder="Ej: Rosa Valenzuela"></label><label>RUT<input name="rut" required autocomplete="off" placeholder="12.345.678-5"></label><button type="button" data-action="next" class="adc-primary-button">Continuar</button></div><div class="adc-citizen-step" data-step="2"><label>Fecha de inicio del taller<input name="sessionDate" type="date" required value="${escapeHtml(workshop.startDate)}" min="${escapeHtml(workshop.startDate)}"></label><p id="citizen-date-help" class="text-xs text-on-surface-variant -mt-2">Los cupos se calculan para la fecha seleccionada.</p><label>Fecha de nacimiento<input name="birthDate" type="date" required></label><label>Teléfono de contacto<input name="phone" type="tel" required autocomplete="tel" placeholder="+56 9 1234 5678"></label><label>Sector<select name="sector" required><option value="">Seleccionar sector...</option><option value="san-felix">San Félix</option><option value="el-transito">El Tránsito</option><option value="las-pircas">Las Pircas</option><option value="chanchoquin">Chanchoquín Chico</option></select></label><div class="flex gap-3"><button type="button" data-action="back" class="adc-secondary-button">Atrás</button><button type="button" data-action="next" class="adc-primary-button">Revisar</button></div></div><div class="adc-citizen-step" data-step="3"><div id="citizen-summary" class="adc-summary"></div><p class="text-xs text-on-surface-variant mt-3">Al confirmar, se guardará una demostración local en este navegador. No se enviará información a la municipalidad.</p><div class="flex gap-3"><button type="button" data-action="back" class="adc-secondary-button">Atrás</button><button type="submit" class="adc-primary-button">Confirmar inscripción</button></div></div><div class="adc-status" role="status" aria-live="polite"></div></form>`);
  const form = dialog.querySelector('form');
  const steps = [...dialog.querySelectorAll('.adc-citizen-step')];
  const stepLabels = [...dialog.querySelectorAll('.adc-stepper span')];
  const status = dialog.querySelector('.adc-status');
  let currentStep = 1;
  const dateInput = form.elements.sessionDate;
  const availability = dialog.querySelector('#citizen-availability');
  const updateAvailability = () => {
    const result = service.getWorkshopAvailability(workshopId, dateInput.value);
    availability.textContent = result ? `${result.available} cupos disponibles para el ${dateInput.value}` : 'Fecha no disponible';
  };
  dateInput.addEventListener('change', updateAvailability);
  updateAvailability();
  const showStep = (step) => {
    currentStep = step;
    steps.forEach((item) => item.classList.toggle('is-active', Number(item.dataset.step) === step));
    stepLabels.forEach((item, index) => item.classList.toggle('is-active', index + 1 === step));
  };
  dialog.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'back') showStep(Math.max(1, currentStep - 1));
    if (action === 'next') {
      const visibleStep = steps.find((step) => Number(step.dataset.step) === currentStep);
      const visibleControls = [...visibleStep.querySelectorAll('input, select, textarea')];
      if (!visibleControls.every((control) => control.reportValidity())) return;
      if (currentStep === 1) showStep(2);
      else { dialog.querySelector('#citizen-summary').innerHTML = `<strong>Nombre:</strong> ${escapeHtml(form.elements.name.value)}<br><strong>RUT:</strong> ${escapeHtml(form.elements.rut.value)}<br><strong>Fecha del taller:</strong> ${escapeHtml(form.elements.sessionDate.value)}<br><strong>Horario:</strong> ${escapeHtml(workshop.schedule)}<br><strong>Sede:</strong> ${escapeHtml(workshop.venue)}<br><strong>Dirección:</strong> ${escapeHtml(workshop.address)}<br><strong>Sala:</strong> ${escapeHtml(workshop.room)}<br><strong>Monitor:</strong> ${escapeHtml(workshop.monitor)}<br><strong>Contacto:</strong> ${escapeHtml(form.elements.phone.value)}<br><strong>Sector:</strong> ${escapeHtml(sectorLabel(form.elements.sector.value))}<br><strong>Cupos disponibles:</strong> ${escapeHtml(availability.textContent)}`; showStep(3); }
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const values = Object.fromEntries(new FormData(form));
      const result = service.registerAndEnroll(values, workshopId, values.sessionDate);
      const updatedWorkshop = service.getWorkshops().find((item) => item.id === workshopId);
      dialog.querySelector('.adc-dialog-card').innerHTML = `<div class="adc-confirmation"><div class="adc-confirmation-icon">✓</div><p class="text-xs uppercase tracking-wider text-primary font-bold">Inscripción confirmada</p><h2 class="text-2xl font-bold mt-1">${escapeHtml(result.neighbor.name)}, ya tienes tu cupo</h2><p class="text-sm text-on-surface-variant mt-2">Presenta este comprobante al llegar. Código de inscripción: <strong>${escapeHtml(result.enrollment.id)}</strong></p><div class="adc-confirmation-details"><div><span>Taller</span><strong>${escapeHtml(updatedWorkshop.name)}</strong></div><div><span>Fecha y horario</span><strong>${escapeHtml(values.sessionDate)} · ${escapeHtml(updatedWorkshop.schedule)}</strong></div><div><span>Lugar</span><strong>${escapeHtml(updatedWorkshop.venue)} · ${escapeHtml(updatedWorkshop.room)}</strong><small>${escapeHtml(updatedWorkshop.address)}</small></div><div><span>Monitor</span><strong>${escapeHtml(updatedWorkshop.monitor)}</strong></div><div><span>Participante</span><strong>${escapeHtml(result.neighbor.name)} · ${escapeHtml(result.neighbor.rut)}</strong><small>${escapeHtml(result.neighbor.phone)} · ${escapeHtml(sectorLabel(result.neighbor.sector))}</small></div></div><p class="text-xs text-on-surface-variant mt-4">Datos simulados guardados en este navegador. El comprobante no reemplaza una notificación municipal oficial.</p><button type="button" id="download-enrollment-pdf" class="adc-primary-button mt-4">Descargar comprobante PDF</button><button type="button" data-action="close" class="adc-secondary-button mt-3 w-full">Cerrar</button></div>`;
      dialog.querySelector('#download-enrollment-pdf').addEventListener('click', () => downloadEnrollmentPdf(result, updatedWorkshop, values.sessionDate));
    } catch (error) { showStatus(status, error.message, 'error'); }
  });
  dialog.showModal();
}

function showMyEnrollments() {
  const dialog = citizenDialog('Mis inscripciones', '<p class="text-sm text-on-surface-variant mt-4">Ingresa tu RUT para consultar las inscripciones guardadas en esta demostración.</p><form id="lookup-enrollments" class="mt-4"><label>RUT<input name="rut" required placeholder="12.345.678-5"></label><button class="adc-primary-button mt-4" type="submit">Consultar</button><div class="adc-status mt-3" role="status" aria-live="polite"></div></form>');
  const form = dialog.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const state = service.getState();
    const id = form.elements.rut.value.toUpperCase().replace(/[^0-9K]/g, '');
    const neighbor = state.neighbors.find((item) => item.id === id);
    const enrollments = state.enrollments.filter((item) => item.neighborId === id).map((item) => state.workshops.find((workshop) => workshop.id === item.workshopId)).filter(Boolean);
    const result = enrollments.length ? enrollments.map((workshop) => `${workshop.name} · ${workshop.venue} · ${workshop.schedule}`).join('<br>') : 'No encontramos inscripciones para este RUT.';
    const region = form.querySelector('.adc-status');
    region.innerHTML = neighbor ? `<strong>${escapeHtml(neighbor.name)}</strong><br>${result}` : 'No encontramos un vecino con ese RUT en los datos de demostración.';
    region.className = 'adc-status is-visible ' + (neighbor ? 'is-success' : 'is-error');
  });
  dialog.showModal();
}

function addCitizenHelpLink() {
  const help = [...document.querySelectorAll('section')].find((section) => section.textContent.includes('Oficina de Apoyo al Postulante'));
  if (help) help.id = 'ayuda-ciudadana';
}

function exposeAttendanceToast() {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  window.ADCShowToast = (title, message) => {
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastDesc').textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
  };
}

function initDashboard() {
  const destinations = [
    ['Nueva Inscripcion', 'inscripciones.html'],
    ['Nueva Inscripción', 'inscripciones.html'],
    ['Asistencia', 'asistencia.html'],
    ['Inventario', 'inventario.html'],
    ['Reporte', 'reportes.html']
  ];
  document.querySelectorAll('button').forEach((button) => {
    const destination = destinations.find(([label]) => button.textContent.includes(label))?.[1];
    if (destination) button.addEventListener('click', () => { location.href = destination; });
  });
}

setPageMetadata();
localizeBrandImages();
addDemoBadge();
exposeAttendanceToast();

if (page === 'portal-vecino.html') initPortal();
if (page === 'inscripciones.html') initEnrollments();
if (page === 'talleres.html') initWorkshops();
if (page === 'asistencia.html') initAttendance();
if (page === 'inventario.html') initInventory();
if (page === 'reportes.html') initReports();
if (page === 'dashboard.html') initDashboard();

window.ADC = { service };
