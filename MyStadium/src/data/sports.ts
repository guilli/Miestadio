import { Country, Division, SportId } from "../types";

export interface SportLeague {
  id: string;
  label: string;
  /** Solo disponible en fútbol por ahora: mapea a los datos reales de stadiums. */
  country?: Country;
  division?: Division;
  /** Equipos de muestra para los deportes sin datos reales todavía. */
  teams?: string[];
}

export interface SportDef {
  id: SportId;
  icon: string;
  label: string;
  leagues: SportLeague[];
}

export const SPORTS: SportDef[] = [
  {
    id: "futbol",
    icon: "⚽",
    label: "Fútbol",
    leagues: [
      { id: "spain_primera", label: "España · 1ª División", country: "España", division: "Primera" },
      { id: "spain_segunda", label: "España · 2ª División", country: "España", division: "Segunda" },
      { id: "england_premier", label: "Inglaterra · Premier League", country: "Inglaterra", division: "Primera" },
      { id: "france_ligue1", label: "Francia · Ligue 1", country: "Francia", division: "Primera" },
      { id: "germany_bundesliga", label: "Alemania · Bundesliga", country: "Alemania", division: "Primera" },
      { id: "portugal_primeira", label: "Portugal · Primeira Liga", country: "Portugal", division: "Primera" },
    ],
  },
  {
    id: "baloncesto",
    icon: "🏀",
    label: "Baloncesto",
    leagues: [
      {
        id: "acb",
        label: "Liga Endesa",
        teams: ["Valencia Basket", "Real Madrid Baloncesto", "Barça Basket", "Kosner Baskonia", "ASISA Joventut", "Unicaja Málaga", "UCAM Murcia", "La Laguna Tenerife", "Dreamland Gran Canaria", "Casademont Zaragoza", "BAXI Manresa", "MoraBanc Andorra", "Río Breogán", "iLERNA Lleida", "Recoletas Salud San Pablo Burgos", "Monbus Obradoiro", "Leyma Coruña", "Surne Bilbao"],
      },
      {
        id: "leb_oro",
        label: "LEB Oro",
        teams: ["Bilbao Basket", "Estudiantes", "San Pablo Burgos", "Ourense", "Valladolid"],
      },
    ],
  },
  {
    id: "rugby",
    icon: "🏉",
    label: "Rugby",
    leagues: [
      {
        id: "division_honor",
        label: "División de Honor",
        teams: ["VRAC Quesos Entrepinares", "SilverStorm El Salvador", "UE Santboiana", "Ciencias Rugby", "Ordizia RE", "Alcobendas Rugby", "Bucaners Rugby", "Hernani CRE"],
      },
      {
        id: "top14",
        label: "Top 14 (Francia)",
        teams: ["Stade Toulousain", "Stade Français", "Racing 92", "La Rochelle", "Toulon", "Bordeaux-Bègles"],
      },
    ],
  },
  {
    id: "sumo",
    icon: "🤼",
    label: "Sumo",
    leagues: [
      {
        id: "honbasho",
        label: "Torneos (Honbasho)",
        teams: ["Hatsu Basho · Tokio", "Haru Basho · Osaka", "Natsu Basho · Tokio", "Nagoya Basho · Nagoya", "Aki Basho · Tokio", "Kyushu Basho · Fukuoka"],
      },
      {
        id: "makuuchi",
        label: "Makuuchi · Rikishi",
        teams: ["Terunofuji", "Ōnosato", "Takakeishō", "Hōshōryū", "Kirishima", "Midorifuji"],
      },
    ],
  },
  {
    id: "futbolamericano",
    icon: "🏈",
    label: "Fútbol americano",
    leagues: [
      {
        id: "lnfa",
        label: "Liga Nacional (LNFA)",
        teams: ["Badalona Dracs", "Osos Rivas", "Mariners de Valencia", "Coyotes de Alcalá", "Camioneros de Coslada", "L'hospitalet Pioners"],
      },
      {
        id: "nfl",
        label: "NFL",
        teams: ["Kansas City Chiefs", "Philadelphia Eagles", "San Francisco 49ers", "Dallas Cowboys", "Buffalo Bills", "Baltimore Ravens"],
      },
    ],
  },
];

export function getSport(id: SportId): SportDef {
  return SPORTS.find(s => s.id === id) ?? SPORTS[0];
}