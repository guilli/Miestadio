export type Division = 'Primera' | 'Segunda';

export type Country = 'España';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  division: Division;
  country: Country;
}

export interface Stadium {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  city: string;
  population: number;
  country: Country;
  capacity: number;
  yearBuilt: number;
  division: Division;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface StadiumWithDistance extends Stadium {
  distance: number | null; // in kilometers
  bearing: number | null;  // degrees 0-360
}

export type RootStackParamList = {
  Home: undefined;
  StadiumDetail: { stadiumId: string };
  Quiz: undefined;
  Info: undefined;
};
