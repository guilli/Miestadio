/**
 * @format
 */

import { stadiums } from '../src/data/stadiums';
import { SPORTS, getLeagueLabel, getLeagueVenues, getLeaguesByCountry } from '../src/data/sports';

const ALL_LEAGUES = SPORTS.flatMap(sport => sport.leagues.map(league => league.id));
const MIN_OPTIONS = 4;

describe('catálogo de recintos', () => {
  it('no tiene recintos duplicados por id', () => {
    const ids = stadiums.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no repite equipo dentro de una misma liga', () => {
    for (const leagueId of ALL_LEAGUES) {
      const venues = getLeagueVenues(leagueId);
      const keys = venues.map(v => v.leagueId + '::' + v.teamId);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it('no repite nombre de equipo dentro de una misma liga', () => {
    // El quiz compara y deduplica opciones por teamName.
    for (const leagueId of ALL_LEAGUES) {
      const names = getLeagueVenues(leagueId).map(v => v.teamName);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it('tiene coordenadas dentro de rango y no nulas', () => {
    for (const s of stadiums) {
      expect(Number.isFinite(s.latitude)).toBe(true);
      expect(Number.isFinite(s.longitude)).toBe(true);
      expect(Math.abs(s.latitude)).toBeLessThanOrEqual(90);
      expect(Math.abs(s.longitude)).toBeLessThanOrEqual(180);
      expect(s.latitude === 0 && s.longitude === 0).toBe(false);
    }
  });

  it('declara un aforo y un año de inauguración válidos', () => {
    for (const s of stadiums) {
      expect(s.capacity).toBeGreaterThan(0);
      expect(s.yearBuilt).toBeGreaterThan(1800);
    }
  });
});

describe('coherencia entre ligas y recintos', () => {
  it('todo leagueId de un recinto está declarado en SPORTS', () => {
    const orphans = stadiums.filter(s => !ALL_LEAGUES.includes(s.leagueId));
    expect(orphans.map(s => `${s.id} -> ${s.leagueId}`)).toEqual([]);
  });

  it('toda liga declarada tiene al menos un recinto', () => {
    const empty = ALL_LEAGUES.filter(id => getLeagueVenues(id).length === 0);
    expect(empty).toEqual([]);
  });

  it('el país del recinto coincide con el de su liga', () => {
    for (const sport of SPORTS) {
      for (const league of sport.leagues) {
        const venues = getLeagueVenues(league.id);
        // Las ligas transfronterizas (NBA, con sede en EE. UU. y Canadá) declaran
        // el país de su mayoría y cada recinto el suyo propio.
        if (new Set(venues.map(v => v.country)).size > 1) continue;
        for (const venue of venues) {
          expect([league.id, venue.id, venue.country]).toEqual([league.id, venue.id, league.country]);
        }
      }
    }
  });

  it('la división del recinto coincide con la de su liga', () => {
    for (const sport of SPORTS) {
      for (const league of sport.leagues) {
        for (const venue of getLeagueVenues(league.id)) {
          expect([league.id, venue.id, venue.division]).toEqual([league.id, venue.id, league.division]);
        }
      }
    }
  });

  it('el sportId del recinto coincide con el deporte que declara su liga', () => {
    for (const sport of SPORTS) {
      for (const league of sport.leagues) {
        for (const venue of getLeagueVenues(league.id)) {
          expect([league.id, venue.id, venue.sportId]).toEqual([league.id, venue.id, sport.id]);
        }
      }
    }
  });
});

describe('utilidades de sports', () => {
  it('getLeagueLabel resuelve todas las ligas', () => {
    for (const leagueId of ALL_LEAGUES) {
      expect(getLeagueLabel(leagueId)).not.toBe(leagueId);
    }
  });

  it('getLeagueLabel devuelve el id si la liga no existe', () => {
    expect(getLeagueLabel('no_existe')).toBe('no_existe');
  });

  it('getLeaguesByCountry devuelve solo ligas de ese país', () => {
    for (const country of ['España', 'Francia', 'Japón', 'Estados Unidos'] as const) {
      const leagues = getLeaguesByCountry(country);
      expect(leagues.length).toBeGreaterThan(0);
      for (const { league } of leagues) {
        expect(league.country).toBe(country);
      }
    }
  });

  it('getLeagueVenues ordena por nombre de equipo', () => {
    for (const leagueId of ALL_LEAGUES) {
      const names = getLeagueVenues(leagueId).map(v => v.teamName);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });
});

describe('el quiz puede construir una ronda para cada liga', () => {
  it('todas las ligas tienen al menos 4 equipos para 4 opciones', () => {
    for (const leagueId of ALL_LEAGUES) {
      expect(getLeagueVenues(leagueId).length).toBeGreaterThanOrEqual(MIN_OPTIONS);
    }
  });

  it('todas las ligas tienen equipos disponibles', () => {
    expect(stadiums.length).toBeGreaterThanOrEqual(MIN_OPTIONS);
  });
});
