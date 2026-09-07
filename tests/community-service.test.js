import assert from 'node:assert/strict';
import test from 'node:test';
import { CommunityService, formatRut, isValidRut, normalizeRut } from '../assets/js/community-service.js';
import { createMemoryRepository } from '../assets/js/storage.js';

const validRut = '12.345.678-5';

test('normaliza, formatea y valida un RUT', () => {
  assert.equal(normalizeRut(validRut), '123456785');
  assert.equal(formatRut('123456785'), validRut);
  assert.equal(isValidRut(validRut), true);
  assert.equal(isValidRut('12.345.678-9'), false);
});

test('registra un vecino y lo inscribe en un taller', () => {
  const service = new CommunityService(createMemoryRepository());
  const result = service.registerAndEnroll({
    rut: validRut,
    name: 'Persona de Prueba',
    birthDate: '1980-01-01',
    phone: '+56 9 6000 0000',
    sector: 'san-felix'
  }, 'TLL-SF-01');
  assert.equal(result.created, true);
  assert.equal(service.getParticipants('TLL-SF-01').some((item) => item.id === '123456785'), true);
});

test('impide una segunda inscripcion al mismo taller', () => {
  const service = new CommunityService(createMemoryRepository());
  const input = { rut: validRut, name: 'Persona de Prueba', birthDate: '1980-01-01', phone: '+56 9 6000 0000', sector: 'san-felix' };
  service.registerAndEnroll(input, 'TLL-SF-01');
  assert.throws(() => service.registerAndEnroll(input, 'TLL-SF-01'), /ya esta inscrito/i);
});

test('lista vecinos disponibles y asigna un vecino existente', () => {
  const service = new CommunityService(createMemoryRepository());
  const availableBefore = service.getAvailableNeighbors('TLL-SF-01');
  assert.equal(availableBefore.some((item) => item.id === '222222222'), false);
  assert.equal(availableBefore.some((item) => item.id === '333333333'), true);
  service.enrollNeighbor('333333333', 'TLL-SF-01');
  assert.equal(service.getParticipants('TLL-SF-01').some((item) => item.id === '333333333'), true);
  assert.equal(service.getAvailableNeighbors('TLL-SF-01').some((item) => item.id === '333333333'), false);
});

test('calcula cupos según la fecha seleccionada', () => {
  const service = new CommunityService(createMemoryRepository());
  const firstDate = service.getWorkshopAvailability('TLL-SF-01', '2025-05-06');
  const otherDate = service.getWorkshopAvailability('TLL-SF-01', '2025-06-03');
  assert.equal(firstDate.enrolled, 1);
  assert.equal(firstDate.available, 19);
  assert.equal(otherDate.enrolled, 0);
  assert.equal(otherDate.available, 20);
});

test('guarda asistencia y actualiza el reporte', () => {
  const service = new CommunityService(createMemoryRepository());
  service.saveAttendance('TLL-ET-02', '2025-05-10', [
    { neighborId: '111111111', status: 'presente' },
    { neighborId: '444444444', status: 'ausente' }
  ]);
  const report = service.getReport();
  assert.equal(report.attendancePercent, 50);
  assert.equal(report.sessions, 1);
});

test('actualiza inventario y registra el movimiento', () => {
  const service = new CommunityService(createMemoryRepository());
  const item = service.updateInventory('MAT-CER-04', { quantity: 20, status: 'disponible' }, 'reposicion');
  const state = service.getState();
  assert.equal(item.quantity, 20);
  assert.equal(state.inventoryMovements.length, 1);
});
