export const CITIES = [
  { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Alcobendas', lat: 40.5473, lng: -3.6416 },
  { name: 'Getafe', lat: 40.3082, lng: -3.7324 },
  { name: 'Barcelona', lat: 41.3874, lng: 2.1686 },
  { name: 'Badalona', lat: 41.4502, lng: 2.2475 },
  { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
  { name: 'Bilbao', lat: 43.263, lng: -2.935 },
  { name: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Murcia', lat: 37.9922, lng: -1.1307 },
  { name: 'A Coruña', lat: 43.3623, lng: -8.4115 },
] as const

export type City = (typeof CITIES)[number]['name']

export function findCity(name: string | undefined) {
  if (!name) return undefined
  return CITIES.find((city) => city.name.toLowerCase() === name.toLowerCase())
}
