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
    ],
  },
  {
    id: "baloncesto",
    icon: "🏀",
    label: "Baloncesto",
    leagues: [
      {
        id: "acb",
        label: "Liga ACB",
        teams: ["Real Madrid Baloncesto", "Barça Basket", "Valencia Basket", "Unicaja Málaga", "Cazoo Baskonia", "Gran Canaria", "UCAM Murcia", "Joventut", "Andorra", "Obradoiro"],
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