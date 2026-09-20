import { useState, useEffect, useCallback, useRef } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { LocationCoords, Stadium, StadiumWithDistance } from "../types";

interface GeolocationLike {
  getCurrentPosition: (
    success: (pos: { coords: { latitude: number; longitude: number } }) => void,
    error?: () => void,
    options?: Record<string, unknown>,
  ) => void;
}

function loadGeolocation(): GeolocationLike | null {
  try {
    const mod = require("@react-native-community/geolocation") as
      | { default?: GeolocationLike }
      | GeolocationLike;
    return mod && typeof mod === "object" && "default" in mod && mod.default
      ? mod.default
      : (mod as GeolocationLike);
  } catch {
    return null;
  }
}

function toRad(deg: number): number { return (deg * Math.PI) / 180; }
function toDeg(rad: number): number { return (rad * 180) / Math.PI; }

function haversineDistance(a: LocationCoords, b: LocationCoords): number {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function calculateBearing(from: LocationCoords, to: LocationCoords): number {
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

async function requestAndroidPermission(): Promise<boolean> {
  if (Platform.OS !== "android") { return true; }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Permiso de ubicación",
      message: "MyStadium necesita tu ubicación para localizar estadios.",
      buttonPositive: "Aceptar",
      buttonNegative: "Cancelar",
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

interface UseLocationResult {
  userLocation: LocationCoords | null;
  locationError: string | null;
  enrichStadiums: (list: Stadium[]) => StadiumWithDistance[];
  refreshLocation: () => void;
}

export default function useLocation(): UseLocationResult {
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  // Evita peticiones superpuestas (permisos apilados o dos getCurrentPosition
  // a la vez) al arrancar, que en algunos móviles dejaban la app sin respuesta.
  const inFlight = useRef(false);

  const fetchLocation = useCallback(async () => {
    if (inFlight.current) { return; }
    inFlight.current = true;
    const done = () => { inFlight.current = false; };

    try {
      const Geolocation = loadGeolocation();
      if (!Geolocation) {
        done();
        setLocationError("Ubicación no disponible en este dispositivo.");
        return;
      }
      if (Platform.OS === "android") {
        const ok = await requestAndroidPermission();
        if (!ok) {
          done();
          setLocationError("Permiso de ubicación denegado. Actívalo en Ajustes.");
          return;
        }
      }
      const onSuccess = (latitude: number, longitude: number) => {
        done();
        setUserLocation({ latitude, longitude });
        setLocationError(null);
      };
      const onFailure = () => {
        Geolocation.getCurrentPosition(
          pos => onSuccess(pos.coords.latitude, pos.coords.longitude),
          () => {
            done();
            setLocationError("No se pudo obtener la ubicación. Comprueba el GPS.");
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 },
        );
      };
      Geolocation.getCurrentPosition(
        pos => onSuccess(pos.coords.latitude, pos.coords.longitude),
        onFailure,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch {
      done();
      setLocationError("No se pudo obtener la ubicación.");
    }
  }, []);

  useEffect(() => {
    fetchLocation();
    const id = setInterval(fetchLocation, 30000);
    return () => clearInterval(id);
  }, [fetchLocation]);

  const enrichStadiums = useCallback(
    (list: Stadium[]): StadiumWithDistance[] =>
      list.map(s => {
        if (!userLocation) { return { ...s, distance: null, bearing: null }; }
        const coords = { latitude: s.latitude, longitude: s.longitude };
        return { ...s, distance: haversineDistance(userLocation, coords), bearing: calculateBearing(userLocation, coords) };
      }),
    [userLocation],
  );

  return { userLocation, locationError, enrichStadiums, refreshLocation: fetchLocation };
}
