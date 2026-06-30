export const BUSINESS = {
  name: 'Baterías Cali Saint',
  owner: 'Ing. Santiago Martínez Vásquez',
  phone: '3147691248',
  phoneDisplay: '314 769 1248',
  email: 'bateriventas@outlook.com',
  address: 'Carrera 15 # 36-80, Santiago de Cali',
  whatsappUrl: 'https://wa.me/573147691248',
  catalogUrl: 'https://www.bateriascali.es',
  schedule: 'Atención 24/7',
};

export const SERVICES = {
  deliveryPricePerCircuit: 20000,
  rechargeAtStore: 15000,
  recycleBuyPrice: 40000,
  recycleDiscount: 40000,
};

export { CATALOG_PRODUCTS as PRODUCTS } from './catalog-mac.js';

export const ACCESSORIES = [
  { name: 'Bornes', price: 15000 },
  { name: 'Soportes', price: 20000 },
];

export const BRAND_FILTERS = [
  'Todos',
  'DUNCAN',
  'MAC',
  'WILLARD',
  'VARTA',
  'Bosch',
  'AC Delco',
  'Motorcraft',
  'COEXITO',
  'Rocket',
  'Optima',
  'Magna',
  'Yuasa',
  'CSB',
  'Estacionaria',
  'Hankook',
  'Moto',
];

export const REFERENCE_GROUPS = [
  {
    id: 'ns40',
    label: 'NS40',
    description: 'Subcompactos y city cars — i10, Picanto, Spark, Celerio',
    match: (text) => /\bNS40\b|\bN40\b|\bB19\b/i.test(text) && !/\bNS60\b/i.test(text),
  },
  {
    id: 'ns60',
    label: 'NS60',
    description: 'Sedanes compactos y SUVs — Mazda 2, CRV, Civic, Sail',
    match: (text) => /\bNS60\b|\bN40\b.*NS60|\bB24\b/i.test(text),
  },
  {
    id: '42',
    label: '42',
    description: 'Medianos y camionetas — Hilux, D-Max, Frontier, L200',
    match: (text) => /\b42IST\b|\b42\s|\b42-/i.test(text),
  },
  {
    id: '22',
    label: '22',
    description: 'Motos, utilitarios y equipos compactos',
    match: (text) => /\b22-|\b22\s|\b22IST/i.test(text),
  },
  {
    id: '24',
    label: '24',
    description: 'Camionetas medianas y comerciales ligeros',
    match: (text) => /\b24RST\b|\b24-|\b24\s/i.test(text),
  },
  {
    id: '27',
    label: '27',
    description: 'SUVs, pick-ups y vans de carga',
    match: (text) => /\b27\s|\b27-|\b27R\b|\b27IST/i.test(text),
  },
  {
    id: '30',
    label: '30',
    description: 'Camiones ligeros y maquinaria agrícola',
    match: (text) => /\b30H\b|\b30-|\b30\s/i.test(text),
  },
  {
    id: '31',
    label: '31',
    description: 'Pick-ups full size y buses urbanos',
    match: (text) => /\b31T\b|\b31\s|\b31-|\b31H\b/i.test(text),
  },
  {
    id: '35',
    label: '35',
    description: 'Transporte comercial y maquinaria media',
    match: (text) => /\b35\s|\b35-|\b35IST/i.test(text),
  },
  {
    id: '36',
    label: '36',
    description: 'Camiones de reparto y equipos industriales',
    match: (text) => /\b36IST\b|\b36\s|\b36-/i.test(text),
  },
  {
    id: '47',
    label: '47',
    description: 'Camiones de carga y buses interurbanos',
    match: (text) => /\b47\s|\b47-|\b47IST/i.test(text),
  },
  {
    id: '48',
    label: '48',
    description: 'Maquinaria pesada y flotas de transporte',
    match: (text) => /\b48IST\b|\b48ST\b|\b48\s|\b48-/i.test(text),
  },
  {
    id: '49',
    label: '49',
    description: 'Buses, tracto-camiones y plantas móviles',
    match: (text) => /\b49ST\b|\b49\s|\b49-/i.test(text),
  },
  {
    id: '4d',
    label: '4D',
    description: 'Transporte de carga pesada y maquinaria industrial',
    match: (text) => /\b4DLT\b|\b4D\s|\b4D-/i.test(text),
  },
  {
    id: '8d',
    label: '8D',
    description: 'Camiones de alto tonelaje y generadores',
    match: (text) => /\b8D\s|\b8D-/i.test(text),
  },
  {
    id: 'agm',
    label: 'AGM',
    description: 'Tecnología AGM — vehículos con alto consumo eléctrico',
    match: (text) => /\bAGM\b|\bEFB\b/i.test(text),
  },
  {
    id: 'start-stop',
    label: 'Start-Stop',
    description: 'Sistemas Start-Stop e híbridos — VARTA EFB, MAC LN',
    match: (text) => /start.?stop|star.?stop|\bEFB\b|\bLN[0-9]/i.test(text),
  },
];

export const PRIORITY_BRANDS = [
  'VARTA',
  'MAC',
  'Bosch',
  'DUNCAN',
  'WILLARD',
  'AC Delco',
  'Rocket',
  'Optima',
  'Motorcraft',
  'COEXITO',
];
