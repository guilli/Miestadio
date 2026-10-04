export type Division = "Primera" | "Segunda";

export type Country =
  | "España"
  | "Inglaterra"
  | "Francia"
  | "Alemania"
  | "Portugal"
  | "Japón"
  | "Estados Unidos"
  | "Canadá";

export type SportId = "futbol" | "baloncesto" | "rugby" | "sumo" | "futbolamericano";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Stadium {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  sportId: SportId;
  /** Liga a la que pertenece, ver SportLeague.id en data/sports. */
  leagueId: string;
  city: string;
  country: Country;
  capacity: number;
  yearBuilt: number;
  /** Solo el fútbol divide en Primera/Segunda. */
  division?: Division;
  latitude: number;
  longitude: number;
}

export interface StadiumWithDistance extends Stadium {
  distance: number | null; // km
  bearing: number | null;  // grados 0-360
}

export type TabParamList = {
  Home: undefined;
  Quiz: undefined;
  Visited: undefined;
  Info: undefined;
};
