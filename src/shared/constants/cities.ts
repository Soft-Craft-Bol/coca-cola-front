// Coordenadas de Cochabamba (municipios del departamento) y de las demás capitales de Bolivia, para el mapa de asistentes
export const CITY_COORDS: Record<string, [number, number]> = {
  cochabamba: [-17.3935, -66.157],
  quillacollo: [-17.3979, -66.2793],
  sacaba: [-17.3987, -66.0397],
  tiquipaya: [-17.3379, -66.2166],
  colcapirhua: [-17.3924, -66.2332],
  vinto: [-17.3934, -66.3074],
  'sipe sipe': [-17.4442, -66.3552],
  punata: [-17.5461, -65.8333],
  cliza: [-17.59, -65.9367],
  'villa tunari': [-16.9733, -65.4189],
  'santa cruz de la sierra': [-17.7833, -63.1821],
  'santa cruz': [-17.7833, -63.1821],
  'la paz': [-16.4897, -68.1193],
  'el alto': [-16.5047, -68.1633],
  sucre: [-19.0196, -65.2619],
  oruro: [-17.9647, -67.106],
  potosi: [-19.5836, -65.7531],
  tarija: [-21.5355, -64.7296],
  trinidad: [-14.8333, -64.9],
  cobija: [-11.0267, -68.7692],
}

const normalize = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

export const cityCoords = (name: string) => CITY_COORDS[normalize(name)]
