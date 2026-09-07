export const seedState = {
  schemaVersion: 2,
  metadata: {
    source: 'Datos ficticios de demostracion',
    period: '2025'
  },
  workshops: [
    { id: 'TLL-SF-01', name: 'Alfareria Diaguita y Esmaltado', category: 'Oficios tradicionales', venue: 'Sede San Felix', address: 'Camino Principal s/n, San Felix', room: 'Taller de Ceramica', schedule: 'Martes y jueves, 15:30 a 17:30', startDate: '2025-05-06', monitor: 'Elena Morales', capacity: 20, status: 'activo' },
    { id: 'TLL-ET-02', name: 'Gimnasia Adaptada para Personas Mayores', category: 'Bienestar', venue: 'Sede El Transito', address: 'Ruta C-495 km 34, El Transito', room: 'Gimnasio techado', schedule: 'Lunes y miercoles, 10:00 a 11:30', startDate: '2025-05-05', monitor: 'Rodrigo Campillay', capacity: 25, status: 'activo' },
    { id: 'TLL-ET-03', name: 'Alfabetizacion Digital', category: 'Digital', venue: 'Sede El Transito', address: 'Ruta C-495 km 34, El Transito', room: 'Laboratorio Digital', schedule: 'Miercoles, 16:00 a 18:30', startDate: '2025-05-07', monitor: 'Karina Araya', capacity: 15, status: 'activo' },
    { id: 'TLL-SF-04', name: 'Huerto Comunitario y Riego Eficiente', category: 'Agroecologia', venue: 'Sede San Felix', address: 'Camino Principal s/n, San Felix', room: 'Invernadero Municipal', schedule: 'Viernes, 10:00 a 13:00', startDate: '2025-05-09', monitor: 'Manuel Villegas', capacity: 20, status: 'activo' },
    { id: 'TLL-SF-05', name: 'Tejido a Telar y Rescate Textil', category: 'Oficios tradicionales', venue: 'Sede San Felix', address: 'Camino Principal s/n, San Felix', room: 'Sala Textil', schedule: 'Miercoles, 14:00 a 17:00', startDate: '2025-05-07', monitor: 'Marta Quilodran', capacity: 18, status: 'activo' },
    { id: 'TLL-ET-06', name: 'Cocina Saludable y Conservas Locales', category: 'Gastronomia', venue: 'Sede El Transito', address: 'Ruta C-495 km 34, El Transito', room: 'Cocina Comunitaria', schedule: 'Sabados, 10:00 a 13:00', startDate: '2025-05-10', monitor: 'Ana Rojas', capacity: 16, status: 'completo' }
  ],
  neighbors: [
    { id: '111111111', rut: '11.111.111-1', name: 'Elena Godoy Campillay', birthDate: '1961-05-18', phone: '+56 9 6111 1111', sector: 'el-transito', address: 'Direccion ficticia 101', demo: true },
    { id: '222222222', rut: '22.222.222-2', name: 'Rosa Perez Araya', birthDate: '1974-11-02', phone: '+56 9 6222 2222', sector: 'san-felix', address: 'Direccion ficticia 202', demo: true },
    { id: '333333333', rut: '33.333.333-3', name: 'Manuel Rojas Vega', birthDate: '1982-03-14', phone: '+56 9 6333 3333', sector: 'las-pircas', address: 'Direccion ficticia 303', demo: true },
    { id: '444444444', rut: '44.444.444-4', name: 'Teresa Morales Soto', birthDate: '1958-09-25', phone: '+56 9 6444 4444', sector: 'chanchoquin', address: 'Direccion ficticia 404', demo: true }
  ],
  enrollments: [
    { id: '111111111::TLL-ET-02', neighborId: '111111111', workshopId: 'TLL-ET-02', createdAt: '2025-04-02T10:00:00.000Z' },
    { id: '222222222::TLL-SF-01', neighborId: '222222222', workshopId: 'TLL-SF-01', createdAt: '2025-04-03T11:00:00.000Z' },
    { id: '333333333::TLL-SF-04', neighborId: '333333333', workshopId: 'TLL-SF-04', createdAt: '2025-04-04T12:00:00.000Z' },
    { id: '444444444::TLL-ET-02', neighborId: '444444444', workshopId: 'TLL-ET-02', createdAt: '2025-04-05T13:00:00.000Z' }
  ],
  attendanceSessions: [],
  inventory: [
    { id: 'EQ-PROY-01', name: 'Proyector Epson PowerLite X49', category: 'Tecnologia', venue: 'Sede San Felix', quantity: 1, status: 'mantencion', assignment: 'DIDECO Tecnico' },
    { id: 'HERR-TEL-03', name: 'Telar tradicional de pie', category: 'Herramientas', venue: 'Sede El Transito', quantity: 3, status: 'asignado', assignment: 'Taller de Tejido' },
    { id: 'EQ-COMP-01', name: 'Carro movil de laptops Lenovo', category: 'Tecnologia', venue: 'Casa Central', quantity: 12, status: 'disponible', assignment: 'Sin asignar' },
    { id: 'MAT-CER-04', name: 'Pasta ceramica terracota', category: 'Consumibles', venue: 'Sede San Felix', quantity: 2, status: 'stock-critico', assignment: 'Taller de Alfareria' },
    { id: 'EQ-AUD-02', name: 'Parlante Bluetooth JBL EON 715', category: 'Tecnologia', venue: 'Casa Central', quantity: 2, status: 'disponible', assignment: 'Sin asignar' },
    { id: 'MAT-LAN-12', name: 'Lana de oveja hilada artesanal', category: 'Consumibles', venue: 'Sede El Transito', quantity: 3, status: 'stock-critico', assignment: 'Taller de Tejido' }
  ],
  inventoryMovements: []
};
