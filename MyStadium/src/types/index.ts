export type Division = "Primera" | "Segunda";
export type Country = "España" | "Inglaterra" | "Francia" | "Alemania" | "Portugal";

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
  city: string;
  country: string;
  capacity: number;
  yearBuilt: number;
  division: Division;
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
