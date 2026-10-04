import { stadiums as allStadiums } from "./stadiums";
import { Country, Division, SportId } from "../types";

export interface SportLeague {
  id: string;
  label: string;
  country: Country;
  /** Solo el fútbol divide en Primera/Segunda. */
  division?: Division;
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
      { id: "acb", label: "Liga Endesa", country: "España" },
      { id: "leb_oro", label: "LEB Oro", country: "España" },
      { id: "nba", label: "NBA", country: "Estados Unidos" },
    ],
  },
  {
    id: "rugby",
    icon: "🏉",
    label: "Rugby",
    leagues: [
      { id: "division_honor", label: "División de Honor", country: "España" },
      { id: "top14", label: "Top 14 (Francia)", country: "Francia" },
    ],
  },
  {
    id: "sumo",
    icon: "🤼",
    label: "Sumo",
    leagues: [
      { id: "honbasho", label: "Torneos (Honbasho)", country: "Japón" },
      { id: "makuuchi", label: "Makuuchi · Rikishi", country: "Japón" },
    ],
  },
  {
    id: "futbolamericano",
    icon: "🏈",
    label: "Fútbol americano",
    leagues: [
      { id: "lnfa", label: "Liga Nacional (LNFA)", country: "España" },
      { id: "nfl", label: "NFL", country: "Estados Unidos" },
    ],
  },
];

export function getSport(id: SportId): SportDef {
  return SPORTS.find(s => s.id === id) ?? SPORTS[0];
}

export function getLeagueLabel(leagueId: string): string {
  for (const sport of SPORTS) {
    const league = sport.leagues.find(l => l.id === leagueId);
    if (league) return league.label;
  }
  return leagueId;
}

/** Chapters de un país, en el orden en que se declararon los deportes. */
export function getLeaguesByCountry(country: Country): { sport: SportDef; league: SportLeague }[] {
  return SPORTS.flatMap(sport => sport.leagues.filter(l => l.country === country).map(league => ({ sport, league })));
}

/** Recintos de una liga, ordenados por nombre de equipo. */
export function getLeagueVenues(leagueId: string) {
  return allStadiums.filter(s => s.leagueId === leagueId).sort((a, b) => a.teamName.localeCompare(b.teamName));
}
