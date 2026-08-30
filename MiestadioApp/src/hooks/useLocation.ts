import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationCoords, Stadium, StadiumWithDistance } from '../types';

// ─── Haversine formula ────────────────────────────────────────────────────────
function haversineDistance(a: LocationCoords, b: LocationCoords): number {
  const R = 6371;

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── Bearing (initial) from user to stadium ──────────────────────────────────
function calculateBearing(from: LocationCoords, to: LocationCoords): number {
  const dLon = toRad(to.longitude - from.longitude);

  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const y = Math.sin(dLon) * Math.cos(lat2);

  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface UseLocationResult {
  userLocation: LocationCoords | null;
  locationError: string | null;
  enrichStadiums: (stadiums: Stadium[]) => StadiumWithDistance[];
  refreshLocation: () => void;
}

const useLocation = (): UseLocationResult => {
  const [userLocation, setUserLocation] =
    useState<LocationCoords | null>(null);

  const [locationError, setLocationError] =
    useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Permiso de ubicación denegado. Actívalo en Ajustes.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setLocationError(null);
    } catch (err) {
      console.log('GPS Error:', err);
      setLocationError('No se pudo obtener la ubicación. Comprueba el GPS.');
    }
  }, []);

  useEffect(() => {
    fetchLocation();

    const intervalId = setInterval(fetchLocation, 30000);

    return () => clearInterval(intervalId);
  }, [fetchLocation]);

  const enrichStadiums = useCallback(
    (stadiumList: Stadium[]): StadiumWithDistance[] => {
      return stadiumList.map(stadium => {
        if (!userLocation) {
          return {
            ...stadium,
            distance: null,
            bearing: null,
          };
        }

        const stadiumCoords: LocationCoords = {
          latitude: stadium.latitude,
          longitude: stadium.longitude,
        };

        return {
          ...stadium,
          distance: haversineDistance(userLocation, stadiumCoords),
          bearing: calculateBearing(userLocation, stadiumCoords),
        };
      });
    },
    [userLocation],
  );

  return {
    userLocation,
    locationError,
    enrichStadiums,
    refreshLocation: fetchLocation,
  };
};

export default useLocation;
