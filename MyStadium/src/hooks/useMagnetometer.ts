import { useState, useEffect } from 'react';
import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';

/**
 * Devuelve el heading del dispositivo en grados (0 = norte magnético).
 *
 * En Android usa el módulo nativo RNSensors si está disponible.
 * Si no hay magnetómetro, devuelve 0 (la brújula apunta siempre al bearing calculado).
 */
export default function useMagnetometer(): number {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') { return; }

    const RNSensors = NativeModules.RNSensors;
    if (!RNSensors) { return; }

    let smoothX = 0;
    let smoothY = 0;
    const ALPHA = 0.15;

    try {
      RNSensors.startUpdates('magnetometer', 100);
    } catch { return; }

    const sub = DeviceEventEmitter.addListener('Magnetometer', (data: { x: number; y: number }) => {
      smoothX = ALPHA * data.x + (1 - ALPHA) * smoothX;
      smoothY = ALPHA * data.y + (1 - ALPHA) * smoothY;
      const angle = Math.atan2(smoothX, smoothY) * (180 / Math.PI);
      setHeading((angle + 360) % 360);
    });

    return () => {
      sub.remove();
      try { RNSensors.stopUpdates('magnetometer'); } catch { /* noop */ }
    };
  }, []);

  return heading;
}
