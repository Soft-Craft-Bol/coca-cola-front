// Coordenadas de las principales ciudades de Colombia (para el mapa de asistentes)
export const CITY_COORDS: Record<string, [number, number]> = {
  bogota: [4.711, -74.0721],
  medellin: [6.2442, -75.5812],
  cali: [3.4516, -76.532],
  barranquilla: [10.9685, -74.7813],
  cartagena: [10.391, -75.4794],
  bucaramanga: [7.1193, -73.1227],
  cucuta: [7.8939, -72.5078],
  pereira: [4.8133, -75.6961],
  manizales: [5.0703, -75.5138],
  'santa marta': [11.2408, -74.199],
  ibague: [4.4389, -75.2322],
  villavicencio: [4.142, -73.6266],
  pasto: [1.2136, -77.2811],
  monteria: [8.7479, -75.8814],
  neiva: [2.9273, -75.2819],
  armenia: [4.5339, -75.6811],
  popayan: [2.4419, -76.6063],
  valledupar: [10.4631, -73.2532],
  tunja: [5.5353, -73.3678],
  sincelejo: [9.3047, -75.3978],
  soacha: [4.5794, -74.2168],
  bello: [6.3373, -75.5579],
  envigado: [6.1759, -75.5917],
  itagui: [6.1846, -75.5991],
  palmira: [3.5394, -76.3036],
  buenaventura: [3.8801, -77.0312],
  rionegro: [6.1552, -75.3741],
}

const normalize = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

export const cityCoords = (name: string) => CITY_COORDS[normalize(name)]
