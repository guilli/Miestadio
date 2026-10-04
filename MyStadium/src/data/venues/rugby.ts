import { Stadium } from "../../types";

/**
 * Recintos de rugby. Los campos de la División de Honor siguen la tabla de
 * sede de la RFER; la Top 14 usa el estadio de club.
 */
export const RUGBY: Stadium[] = [
  // ─── DIVISIÓN DE HONOR · ESPAÑA ───────────────────────────────────────────
  { id: "pepe-rojo-valladolid", name: "Campos de Pepe Rojo", teamId: "vrac", teamName: "VRAC Quesos Entrepinares", city: "Valladolid", country: "España", capacity: 5000, yearBuilt: 1990, sportId: "rugby", leagueId: "division_honor", latitude: 41.6450, longitude: -4.7370 },
  { id: "pepe-rojo-el-salvador", name: "Campos de Pepe Rojo", teamId: "el-salvador", teamName: "INEXO El Salvador", city: "Valladolid", country: "España", capacity: 5000, yearBuilt: 1990, sportId: "rugby", leagueId: "division_honor", latitude: 41.6450, longitude: -4.7370 },
  { id: "baldiri-aleu", name: "Estadi Baldiri Aleu", teamId: "santboiana", teamName: "UE Santboiana", city: "Sant Boi de Llobregat", country: "España", capacity: 3500, yearBuilt: 1999, sportId: "rugby", leagueId: "division_honor", latitude: 41.3460, longitude: 2.0760 },
  { id: "la-cartuja-rugby", name: "Instalaciones Deportivas La Cartuja", teamId: "real-ciencias", teamName: "Cajasol Real Ciencias", city: "Sevilla", country: "España", capacity: 3000, yearBuilt: 1999, sportId: "rugby", leagueId: "division_honor", latitude: 37.3570, longitude: -5.9700 },
  { id: "estadio-altamira", name: "Estadio Municipal de Altamira", teamId: "ordizia", teamName: "AMPO Ordizia R. E.", city: "Ordizia", country: "España", capacity: 2000, yearBuilt: 2000, sportId: "rugby", leagueId: "division_honor", latitude: 43.0440, longitude: -2.1800 },
  { id: "las-terrazas", name: "Campo de Rugby Las Terrazas", teamId: "alcobendas", teamName: "Silicius Alcobendas Rugby", city: "Alcobendas", country: "España", capacity: 2000, yearBuilt: 2011, sportId: "rugby", leagueId: "division_honor", latitude: 40.5480, longitude: -3.6380 },
  { id: "estadio-urbieta", name: "Estadio Urbieta", teamId: "hernani", teamName: "Hernani CRE", city: "Hernani", country: "España", capacity: 10000, yearBuilt: 1948, sportId: "rugby", leagueId: "division_honor", latitude: 43.3120, longitude: -1.9800 },
  { id: "el-batallon", name: "Campo de Rugby El Batallón", teamId: "bucaneros", teamName: "Bucaneros Rugby", city: "Castilla la Nueva", country: "España", capacity: 5000, yearBuilt: 2001, sportId: "rugby", leagueId: "division_honor", latitude: 38.9850, longitude: -3.9250 },
  // ─── TOP 14 · FRANCIA ─────────────────────────────────────────────────────
  { id: "ernest-wallon", name: "Stade Ernest-Wallon", teamId: "toulouse", teamName: "Stade Toulousain", city: "Toulouse", country: "Francia", capacity: 13500, yearBuilt: 1967, sportId: "rugby", leagueId: "top14", latitude: 43.5833, longitude: 1.4333 },
  { id: "jean-bouin", name: "Stade Jean-Bouin", teamId: "stade-francais", teamName: "Stade Français", city: "París", country: "Francia", capacity: 20000, yearBuilt: 1972, sportId: "rugby", leagueId: "top14", latitude: 48.8430, longitude: 2.2530 },
  { id: "yves-du-manoir", name: "Stade Yves-du-Manoir", teamId: "racing-92", teamName: "Racing 92", city: "Colombes", country: "Francia", capacity: 14000, yearBuilt: 1927, sportId: "rugby", leagueId: "top14", latitude: 48.9240, longitude: 2.2500 },
  { id: "marcel-deflandre", name: "Stade Marcel-Deflandre", teamId: "la-rochelle", teamName: "La Rochelle", city: "La Rochelle", country: "Francia", capacity: 25000, yearBuilt: 1927, sportId: "rugby", leagueId: "top14", latitude: 46.1480, longitude: -1.1400 },
  { id: "stade-mayol", name: "Stade Mayol", teamId: "toulon", teamName: "Toulon", city: "Tolón", country: "Francia", capacity: 16000, yearBuilt: 1955, sportId: "rugby", leagueId: "top14", latitude: 43.1240, longitude: 5.9300 },
  { id: "andre-moga", name: "Stade André-Moga", teamId: "bordeaux-begles", teamName: "Bordeaux-Bègles", city: "Bègles", country: "Francia", capacity: 12000, yearBuilt: 1990, sportId: "rugby", leagueId: "top14", latitude: 44.8480, longitude: -0.5480 },
];
