import { Stadium } from "../../types";

/**
 * Recintos de fútbol americano. Los de la NFL usan el estadio de la
 * franchise; los de la LNFA el campo municipal donde juegan en casa.
 */
export const FUTBOLAMERICANO: Stadium[] = [
  // ─── LNFA · ESPAÑA ────────────────────────────────────────────────────────
  { id: "complex-municipal-badalona", name: "Complejo Esportiu Municipal de Badalona", teamId: "dracs", teamName: "Badalona Dracs", city: "Badalona", country: "España", capacity: 4000, yearBuilt: 2000, sportId: "futbolamericano", leagueId: "lnfa", latitude: 41.4290, longitude: 2.1090 },
  { id: "estadio-el-soto", name: "Estadio Municipal El Soto", teamId: "osos-rivas", teamName: "Osos Rivas", city: "Rivas-Vaciamadrid", country: "España", capacity: 3000, yearBuilt: 1994, sportId: "futbolamericano", leagueId: "lnfa", latitude: 40.3960, longitude: -3.5390 },
  { id: "polideportivo-godella", name: "Polideportivo Municipal de Godella", teamId: "mariners-valencia", teamName: "Mariners de Valencia", city: "Godella", country: "España", capacity: 3000, yearBuilt: 1996, sportId: "futbolamericano", leagueId: "lnfa", latitude: 39.5990, longitude: -0.5160 },
  { id: "complejo-el-juncal", name: "Complejo Deportivo El Juncal", teamId: "coyotes-alcala", teamName: "Coyotes de Alcalá", city: "Alcalá de Henares", country: "España", capacity: 3000, yearBuilt: 2000, sportId: "futbolamericano", leagueId: "lnfa", latitude: 40.4740, longitude: -3.3590 },
  { id: "estadio-coslada", name: "Estadio Municipal de Coslada", teamId: "camioneros-coslada", teamName: "Camioneros de Coslada", city: "Coslada", country: "España", capacity: 3000, yearBuilt: 1998, sportId: "futbolamericano", leagueId: "lnfa", latitude: 40.4240, longitude: -3.5780 },
  { id: "stadium-lhospitalet", name: "Stadium Municipal de L'Hospitalet", teamId: "pioners", teamName: "L'Hospitalet Pioners", city: "L'Hospitalet de Llobregat", country: "España", capacity: 2000, yearBuilt: 2002, sportId: "futbolamericano", leagueId: "lnfa", latitude: 41.3610, longitude: 2.1080 },
  // ─── NFL · ESTADOS UNIDOS ─────────────────────────────────────────────────
  { id: "arrowhead", name: "GEHA Field at Arrowhead Stadium", teamId: "chiefs", teamName: "Kansas City Chiefs", city: "Kansas City", country: "Estados Unidos", capacity: 76416, yearBuilt: 1972, sportId: "futbolamericano", leagueId: "nfl", latitude: 39.0944, longitude: -94.4839 },
  { id: "lincoln-financial", name: "Lincoln Financial Field", teamId: "eagles", teamName: "Philadelphia Eagles", city: "Filadelfia", country: "Estados Unidos", capacity: 69796, yearBuilt: 2003, sportId: "futbolamericano", leagueId: "nfl", latitude: 39.9008, longitude: -75.1675 },
  { id: "levis-stadium", name: "Levi's Stadium", teamId: "49ers", teamName: "San Francisco 49ers", city: "Santa Clara", country: "Estados Unidos", capacity: 68500, yearBuilt: 2014, sportId: "futbolamericano", leagueId: "nfl", latitude: 37.4030, longitude: -121.9698 },
  { id: "att-stadium", name: "AT&T Stadium", teamId: "cowboys", teamName: "Dallas Cowboys", city: "Arlington", country: "Estados Unidos", capacity: 80000, yearBuilt: 2009, sportId: "futbolamericano", leagueId: "nfl", latitude: 32.7473, longitude: -97.0945 },
  { id: "highmark", name: "Highmark Stadium", teamId: "bills", teamName: "Buffalo Bills", city: "Orchard Park", country: "Estados Unidos", capacity: 64292, yearBuilt: 1998, sportId: "futbolamericano", leagueId: "nfl", latitude: 42.0638, longitude: -78.7890 },
  { id: "mt-bank", name: "M&T Bank Stadium", teamId: "ravens", teamName: "Baltimore Ravens", city: "Baltimore", country: "Estados Unidos", capacity: 70816, yearBuilt: 1998, sportId: "futbolamericano", leagueId: "nfl", latitude: 39.2780, longitude: -76.6228 },
];
