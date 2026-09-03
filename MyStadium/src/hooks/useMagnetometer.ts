import { useState, useEffect } from 'react';
import { magnetometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';

/**
 * Devuelve el heading del dispositivo en grados (0 = norte magnético).
 * Usa un filtro paso-bajo para suavizar las lecturas.
 */
export default function useMagnetometer(): number {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let smoothX = 0;
    let smoothY = 0;
    const ALPHA = 0.15;

    setUpdateIntervalForType(SensorTypes.magnetometer, 100);

    const sub = magnetometer.subscribe(({ x, y }) => {
      smoothX = ALPHA * x + (1 - ALPHA) * smoothX;
      smoothY = ALPHA * y + (1 - ALPHA) * smoothY;
      const angle = Math.atan2(smoothX, smoothY) * (180 / Math.PI);
      setHeading((angle + 360) % 360);
    });

    return () => sub.unsubscribe();
  }, []);

  return heading;
}
