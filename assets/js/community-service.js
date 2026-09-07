export function normalizeRut(value = '') {
  return value.toUpperCase().replace(/[^0-9K]/g, '');
}

export function formatRut(value = '') {
  const normalized = normalizeRut(value);
  if (normalized.length < 2) return normalized;
  const body = normalized.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${normalized.slice(-1)}`;
}

export function isValidRut(value = '') {
  const rut = normalizeRut(value);
  if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;
  let sum = 0;
  let multiplier = 2;
  for (let index = rut.length - 2; index >= 0; index -= 1) {
    sum += Number(rut[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const result = 11 - (sum % 11);
  const expected = result === 11 ? '0' : result === 10 ? 'K' : String(result);
  return rut.at(-1) === expected;
}

export class CommunityService {
  constructor(repository) {
    this.repository = repository;
  }

  getState() {
    return this.repository.load();
  }

  getWorkshops() {
    const state = this.getState();
    return state.workshops.map((workshop) => ({
      ...workshop,
      enrolled: state.enrollments.filter((item) => item.workshopId === workshop.id && (item.date || workshop.startDate) === workshop.startDate).length,
      available: Math.max(0, workshop.capacity - state.enrollments.filter((item) => item.workshopId === workshop.id && (item.date || workshop.startDate) === workshop.startDate).length)
    }));
  }

  getWorkshopAvailability(workshopId, date) {
    const state = this.getState();
    const workshop = state.workshops.find((item) => item.id === workshopId);
    if (!workshop) return null;
    const enrolled = state.enrollments.filter((item) => item.workshopId === workshopId && (item.date || workshop.startDate) === date).length;
    return { capacity: workshop.capacity, enrolled, available: Math.max(0, workshop.capacity - enrolled) };
  }

  createWorkshop(input) {
    const state = this.getState();
    const capacity = Number(input.capacity);
    if (!input.name?.trim() || !input.venue?.trim() || !Number.isInteger(capacity) || capacity < 1) {
      throw new Error('Completa nombre, sede y un cupo valido.');
    }
    const prefix = input.venue.toLowerCase().includes('transito') ? 'ET' : 'SF';
    const next = state.workshops.length + 1;
    const workshop = {
      id: `TLL-${prefix}-${String(next).padStart(2, '0')}`,
      name: input.name.trim(),
      category: input.category?.trim() || 'Comunitario',
      venue: input.venue.trim(),
      room: input.room?.trim() || 'Por definir',
      schedule: input.schedule?.trim() || 'Por definir',
      monitor: input.monitor?.trim() || 'Por asignar',
      capacity,
      status: 'activo'
    };
    state.workshops.push(workshop);
    this.repository.save(state);
    return workshop;
  }

  registerNeighbor(input) {
    const state = this.getState();
    const id = normalizeRut(input.rut);
    if (!isValidRut(input.rut)) throw new Error('Ingresa un RUT chileno valido.');
    if (!input.name?.trim() || !input.birthDate || !input.phone?.trim() || !input.sector) {
      throw new Error('Completa todos los campos obligatorios del vecino.');
    }
    const existing = state.neighbors.find((neighbor) => neighbor.id === id);
    if (existing) return { neighbor: existing, created: false };
    const neighbor = {
      id,
      rut: formatRut(input.rut),
      name: input.name.trim(),
      birthDate: input.birthDate,
      phone: input.phone.trim(),
      sector: input.sector,
      address: input.address?.trim() || 'Sin direccion registrada',
      transportSupport: Boolean(input.transportSupport),
      reducedMobility: Boolean(input.reducedMobility),
      demo: true
    };
    state.neighbors.push(neighbor);
    this.repository.save(state);
    return { neighbor, created: true };
  }

  enrollNeighbor(neighborIdOrRut, workshopId, date) {
    const state = this.getState();
    const neighborId = normalizeRut(neighborIdOrRut);
    const neighbor = state.neighbors.find((item) => item.id === neighborId);
    const workshop = state.workshops.find((item) => item.id === workshopId);
    if (!neighbor) throw new Error('El vecino no esta registrado.');
    if (!workshop) throw new Error('Selecciona un taller valido.');
    const enrollmentDate = date || workshop.startDate;
    const id = `${neighborId}::${workshopId}::${enrollmentDate}`;
    if (state.enrollments.some((item) => item.neighborId === neighborId && item.workshopId === workshopId && (item.date || workshop.startDate) === enrollmentDate)) {
      throw new Error('El vecino ya esta inscrito en este taller.');
    }
    const enrolled = state.enrollments.filter((item) => item.workshopId === workshopId && (item.date || workshop.startDate) === enrollmentDate).length;
    if (enrolled >= workshop.capacity || workshop.status === 'completo') {
      throw new Error('El taller no tiene cupos disponibles.');
    }
    const enrollment = { id, neighborId, workshopId, date: enrollmentDate, createdAt: new Date().toISOString() };
    state.enrollments.push(enrollment);
    this.repository.save(state);
    return enrollment;
  }

  registerAndEnroll(neighborInput, workshopId, date) {
    const state = this.getState();
    const workshop = state.workshops.find((item) => item.id === workshopId);
    if (!workshop) throw new Error('Selecciona un taller valido.');
    const normalizedNeighborId = normalizeRut(neighborInput.rut);
    const enrollmentDate = date || workshop.startDate;
    if (state.enrollments.some((item) => item.neighborId === normalizedNeighborId && item.workshopId === workshopId && (item.date || workshop.startDate) === enrollmentDate)) {
      throw new Error('El vecino ya esta inscrito en este taller.');
    }
    if (state.enrollments.filter((item) => item.workshopId === workshopId && (item.date || workshop.startDate) === enrollmentDate).length >= workshop.capacity || workshop.status === 'completo') {
      throw new Error('El taller no tiene cupos disponibles.');
    }
    const registration = this.registerNeighbor(neighborInput);
    const enrollment = this.enrollNeighbor(registration.neighbor.id, workshopId, enrollmentDate);
    return { ...registration, enrollment };
  }

  getParticipants(workshopId) {
    const state = this.getState();
    return state.enrollments
      .filter((item) => item.workshopId === workshopId)
      .map((enrollment) => state.neighbors.find((neighbor) => neighbor.id === enrollment.neighborId))
      .filter(Boolean);
  }

  getAvailableNeighbors(workshopId) {
    const state = this.getState();
    const assignedIds = new Set(state.enrollments
      .filter((item) => item.workshopId === workshopId)
      .map((item) => item.neighborId));
    return state.neighbors.filter((neighbor) => !assignedIds.has(neighbor.id));
  }

  saveAttendance(workshopId, date, records, notes = '') {
    const state = this.getState();
    if (!state.workshops.some((item) => item.id === workshopId)) throw new Error('Selecciona un taller valido.');
    if (!date || !records.length || records.some((record) => !['presente', 'ausente', 'justificado'].includes(record.status))) {
      throw new Error('Marca la asistencia de todos los participantes.');
    }
    const id = `${workshopId}::${date}`;
    const session = { id, workshopId, date, records, notes: notes.trim(), updatedAt: new Date().toISOString(), simulated: true };
    const index = state.attendanceSessions.findIndex((item) => item.id === id);
    if (index >= 0) state.attendanceSessions[index] = session;
    else state.attendanceSessions.push(session);
    this.repository.save(state);
    return session;
  }

  updateInventory(itemId, changes, movementType = 'actualizacion') {
    const state = this.getState();
    const item = state.inventory.find((record) => record.id === itemId);
    if (!item) throw new Error('No se encontro el elemento de inventario.');
    const quantity = Number(changes.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error('La cantidad debe ser un numero entero positivo.');
    Object.assign(item, { quantity, status: changes.status, assignment: changes.assignment?.trim() || item.assignment });
    state.inventoryMovements.push({ id: `${itemId}-${Date.now()}`, itemId, type: movementType, quantity, status: item.status, createdAt: new Date().toISOString(), simulated: true });
    this.repository.save(state);
    return item;
  }

  createInventoryItem(input) {
    const state = this.getState();
    const id = input.id?.trim().toUpperCase();
    const quantity = Number(input.quantity);
    if (!id || state.inventory.some((item) => item.id === id)) throw new Error('Ingresa un codigo unico para el elemento.');
    if (!input.name?.trim() || !input.venue?.trim() || !Number.isInteger(quantity) || quantity < 0) throw new Error('Completa nombre, sede y cantidad valida.');
    const item = { id, name: input.name.trim(), category: input.category || 'Otros', venue: input.venue.trim(), quantity, status: input.status || 'disponible', assignment: 'Sin asignar' };
    state.inventory.push(item);
    this.repository.save(state);
    return item;
  }

  getReport() {
    const state = this.getState();
    const attendance = state.attendanceSessions.flatMap((session) => session.records);
    const present = attendance.filter((record) => record.status === 'presente').length;
    return {
      activeWorkshops: state.workshops.filter((item) => item.status === 'activo').length,
      neighbors: state.neighbors.length,
      enrollments: state.enrollments.length,
      attendancePercent: attendance.length ? Math.round((present / attendance.length) * 100) : 0,
      inventoryTotal: state.inventory.reduce((sum, item) => sum + item.quantity, 0),
      inventoryAlerts: state.inventory.filter((item) => ['mantencion', 'stock-critico', 'baja'].includes(item.status)).length,
      sessions: state.attendanceSessions.length
    };
  }
}
