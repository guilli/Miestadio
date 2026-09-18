import { useState, useEffect } from "react";

/**
 * Devuelve el heading del dispositivo en grados (0 = norte magnético).
 *
 * Usa el magnetómetro de react-native-sensors en Android e iOS.
 * Si no hay magnetómetro disponible, devuelve 0 (la brújula apunta
 * siempre al bearing calculado).
 */
export default function useMagnetometer(): number {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    try {
      // require dinámico: el módulo lanza un Error si no hay módulos nativos,
      // así fallamos suave (heading = 0) en entornos sin sensor.
      const { magnetometer, setUpdateIntervalForType } = require("react-native-sensors");

      setUpdateIntervalForType("magnetometer", 100);

      let smoothX = 0;
      let smoothY = 0;
      let initialized = false;
      const ALPHA = 0.15;

      subscription = magnetometer.subscribe(
        (data: { x: number; y: number }) => {
          if (!initialized) {
            smoothX = data.x;
            smoothY = data.y;
            initialized = true;
          } else {
            smoothX = ALPHA * data.x + (1 - ALPHA) * smoothX;
            smoothY = ALPHA * data.y + (1 - ALPHA) * smoothY;
          }
          const angle = Math.atan2(smoothX, smoothY) * (180 / Math.PI);
          setHeading((angle + 360) % 360);
        },
        () => {
          // sensor no disponible: heading 0, la brújula usa el rumbo calculado
        },
      );
    } catch {
      // sin magnetómetro: heading 0, la brújula apunta con el rumbo calculado
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return heading;
}
