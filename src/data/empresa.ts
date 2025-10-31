export const EMPRESA_EMAIL = 'crsetsolutions@gmail.com';

export const empresa = {
  nome: 'CRSET Solutions',
  telefone: '+351 914 423 688',
  whatsapp: 'https://wa.me/351914423688?text=Quero%20demo%20CRSET',
  email: 'crsetsolutions@gmail.com',
  morada: 'Vila Nova de Gaia, Portugal',
  maps: 'https://maps.google.com/?q=Vila Nova de Gaia, Portugal',
  horario: 'Seg–Sex, 9h–18h'
} as const; export type Empresa = typeof empresa;