import { Stadium } from "../../types";

/**
 * Pabellones de baloncesto. Cada equipo tiene su recinto con coordenadas
 * reales para que la brújula apunte a la sede.
 */
export const BALONCESTO: Stadium[] = [
  // ─── LIGA ENDESA · ACB ────────────────────────────────────────────────────
  { id: "fuente-san-luis", name: "Pabellón Fuente de San Luis", teamId: "valencia-basket", teamName: "Valencia Basket", city: "Valencia", country: "España", capacity: 11500, yearBuilt: 1986, sportId: "baloncesto", leagueId: "acb", latitude: 39.4690, longitude: -0.3720 },
  { id: "wizink-center", name: "WiZink Center", teamId: "real-madrid-basket", teamName: "Real Madrid Baloncesto", city: "Madrid", country: "España", capacity: 18044, yearBuilt: 1966, sportId: "baloncesto", leagueId: "acb", latitude: 40.4548, longitude: -3.6880 },
  { id: "palau-blaugrana", name: "Palau Blaugrana", teamId: "barca-basket", teamName: "Barça Basket", city: "Barcelona", country: "España", capacity: 7865, yearBuilt: 1971, sportId: "baloncesto", leagueId: "acb", latitude: 41.3810, longitude: 2.1225 },
  { id: "buesa-arena", name: "Buesa Arena", teamId: "baskonia", teamName: "Kosner Baskonia", city: "Vitoria-Gasteiz", country: "España", capacity: 15980, yearBuilt: 2015, sportId: "baloncesto", leagueId: "acb", latitude: 42.8400, longitude: -2.6790 },
  { id: "palau-municipal-badalona", name: "Palau Municipal de Badalona", teamId: "joventut", teamName: "ASISA Joventut", city: "Badalona", country: "España", capacity: 6000, yearBuilt: 1972, sportId: "baloncesto", leagueId: "acb", latitude: 41.4500, longitude: 2.2470 },
  { id: "martin-carpena", name: "Palacio Municipal Martín Carpena", teamId: "unicaja", teamName: "Unicaja Málaga", city: "Málaga", country: "España", capacity: 11500, yearBuilt: 2011, sportId: "baloncesto", leagueId: "acb", latitude: 36.6800, longitude: -4.4400 },
  { id: "palacio-deportes-murcia", name: "Palacio de Deportes de Murcia", teamId: "ucam-murcia", teamName: "UCAM Murcia", city: "Murcia", country: "España", capacity: 7000, yearBuilt: 1986, sportId: "baloncesto", leagueId: "acb", latitude: 37.9840, longitude: -1.1300 },
  { id: "palau-deportes-tenerife", name: "Palau de Deportes de Tenerife", teamId: "la-laguna", teamName: "La Laguna Tenerife", city: "San Cristóbal de La Laguna", country: "España", capacity: 5100, yearBuilt: 2004, sportId: "baloncesto", leagueId: "acb", latitude: 28.4870, longitude: -16.3160 },
  { id: "gran-canaria-arena", name: "Gran Canaria Arena", teamId: "dreamland-gran-canaria", teamName: "Dreamland Gran Canaria", city: "Las Palmas de Gran Canaria", country: "España", capacity: 12400, yearBuilt: 2003, sportId: "baloncesto", leagueId: "acb", latitude: 28.1000, longitude: -15.4400 },
  { id: "palacio-deportes-zaragoza", name: "Palacio de Deportes de Zaragoza", teamId: "casademont", teamName: "Casademont Zaragoza", city: "Zaragoza", country: "España", capacity: 10000, yearBuilt: 1992, sportId: "baloncesto", leagueId: "acb", latitude: 41.6480, longitude: -0.8890 },
  { id: "nou-congost", name: "Pavelló Nou Congost", teamId: "baxi-manresa", teamName: "BAXI Manresa", city: "Manresa", country: "España", capacity: 5000, yearBuilt: 1989, sportId: "baloncesto", leagueId: "acb", latitude: 41.5980, longitude: 1.5570 },
  { id: "palau-municipal-andorra", name: "Palau Municipal d'Andorra la Vella", teamId: "morabanc", teamName: "MoraBanc Andorra", city: "Andorra la Vella", country: "España", capacity: 3500, yearBuilt: 2014, sportId: "baloncesto", leagueId: "acb", latitude: 42.5060, longitude: 1.5310 },
  { id: "pazo-da-cultura", name: "Pazo da Cultura", teamId: "rio-breogan", teamName: "Río Breogán", city: "A Coruña", country: "España", capacity: 4000, yearBuilt: 1972, sportId: "baloncesto", leagueId: "acb", latitude: 43.3620, longitude: -8.4130 },
  { id: "pavello-el-campell", name: "Pavelló El Campell", teamId: "ilerna-lleida", teamName: "iLERNA Lleida", city: "Lleida", country: "España", capacity: 2500, yearBuilt: 1991, sportId: "baloncesto", leagueId: "acb", latitude: 41.6200, longitude: 0.6300 },
  { id: "sala-municipal-burgos", name: "Sala Municipal", teamId: "san-pablo-burgos", teamName: "Recoletas Salud San Pablo Burgos", city: "Burgos", country: "España", capacity: 3500, yearBuilt: 2005, sportId: "baloncesto", leagueId: "acb", latitude: 42.3400, longitude: -3.7000 },
  { id: "pavillon-multiusos-sarria", name: "Pavillón Multiusos de Sarria", teamId: "monbus-obradoiro", teamName: "Monbus Obradoiro", city: "Santiago de Compostela", country: "España", capacity: 4500, yearBuilt: 1975, sportId: "baloncesto", leagueId: "acb", latitude: 42.8700, longitude: -8.5500 },
  { id: "coliseum-coruna", name: "Coliseum da Coruña", teamId: "leyma-coruna", teamName: "Leyma Coruña", city: "A Coruña", country: "España", capacity: 4500, yearBuilt: 1994, sportId: "baloncesto", leagueId: "acb", latitude: 43.3620, longitude: -8.4060 },
  { id: "bilbao-arena", name: "Bilbao Arena", teamId: "surne-bilbao", teamName: "Surne Bilbao", city: "Barakaldo", country: "España", capacity: 10000, yearBuilt: 2008, sportId: "baloncesto", leagueId: "acb", latitude: 43.2650, longitude: -2.9480 },
  // ─── LEB ORO ──────────────────────────────────────────────────────────────
  { id: "bilbao-arena-leb", name: "Bilbao Arena", teamId: "bilbao-basket", teamName: "Bilbao Basket", city: "Barakaldo", country: "España", capacity: 10000, yearBuilt: 2008, sportId: "baloncesto", leagueId: "leb_oro", latitude: 43.2650, longitude: -2.9480 },
  { id: "palacio-deportes-comunidad", name: "Palacio de Deportes de la Comunidad", teamId: "estudiantes", teamName: "Estudiantes", city: "Madrid", country: "España", capacity: 6000, yearBuilt: 1966, sportId: "baloncesto", leagueId: "leb_oro", latitude: 40.4360, longitude: -3.6820 },
  { id: "sala-municipal-burgos-leb", name: "Sala Municipal", teamId: "san-pablo-burgos-leb", teamName: "San Pablo Burgos", city: "Burgos", country: "España", capacity: 3500, yearBuilt: 2005, sportId: "baloncesto", leagueId: "leb_oro", latitude: 42.3400, longitude: -3.7000 },
  { id: "pavillon-rosalia", name: "Pavillón de Rosalía", teamId: "ourense-basket", teamName: "Ourense", city: "Ourense", country: "España", capacity: 3500, yearBuilt: 1996, sportId: "baloncesto", leagueId: "leb_oro", latitude: 42.3350, longitude: -7.8650 },
  { id: "polideportivo-ciudad-valladolid", name: "Polideportivo de la Ciudad", teamId: "valladolid-basket", teamName: "Valladolid", city: "Valladolid", country: "España", capacity: 4000, yearBuilt: 2003, sportId: "baloncesto", leagueId: "leb_oro", latitude: 41.6500, longitude: -4.7300 },
];
