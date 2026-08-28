import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
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
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message:
              'MiEstadio necesita acceder a tu ubicación para localizar estadios cercanos.',
            buttonPositive: 'Permitir',
            buttonNegative: 'Cancelar',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationError(
            'Permiso de ubicación denegado. Actívalo en Ajustes.'
          );
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setLocationError(null);
        },
        error => {
          console.log('GPS Error:', error);

          setLocationError(
            'No se pudo obtener la ubicación. Comprueba el GPS.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    } catch (err) {
      console.log(err);
      setLocationError('Error solicitando permisos.');
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
          distance: haversineDistance(
            userLocation,
            stadiumCoords
          ),
          bearing: calculateBearing(
            userLocation,
            stadiumCoords
          ),
        };
      });
    },
    [userLocation]
  );

  return {
    userLocation,
    locationError,
    enrichStadiums,
    refreshLocation: fetchLocation,
  };
};

export default useLocation;