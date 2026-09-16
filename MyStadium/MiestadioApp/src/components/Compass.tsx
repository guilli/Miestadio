import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

interface CompassProps {
  /** Bearing to stadium in degrees (0 = north, 90 = east) */
  bearing: number | null;
  /** Current device heading from magnetic north */
  heading: number;
  /** Stadium name for accessibility label */
  stadiumName?: string;
  /** Distance to stadium in km */
  distance?: number | null;
}

const COMPASS_SIZE = 210;
const MIDDLE_SIZE = COMPASS_SIZE - 26;
const THIN_SIZE   = MIDDLE_SIZE  - 16;
const INNER_RING_SIZE = THIN_SIZE - 14;
const INNER_SIZE  = INNER_RING_SIZE - 16;
const NEEDLE_WIDTH = 10;
const NEEDLE_HALF_HEIGHT = INNER_SIZE / 2 - 10;

const CARDINAL_LABELS = [
  { label: 'N', angle: 0,   major: true  },
  { label: 'NE', angle: 45,  major: false },
  { label: 'E', angle: 90,  major: true  },
  { label: 'SE', angle: 135, major: false },
  { label: 'S', angle: 180, major: true  },
  { label: 'SO', angle: 225, major: false },
  { label: 'O', angle: 270, major: true  },
  { label: 'NO', angle: 315, major: false },
];

/**
 * Calcula el camino más corto entre dos ángulos para evitar que la aguja
 * dé vueltas de más. Devuelve el nuevo ángulo acumulado a partir de `current`.
 */
function shortestRotation(current: number, target: number): number {
  const currentMod = ((current % 360) + 360) % 360;
  let delta = ((target - currentMod) + 360) % 360;
  if (delta > 180) delta -= 360;
  return current + delta;
}

const Compass: React.FC<CompassProps> = ({ bearing, heading, stadiumName, distance }) => {
  const ringValue   = useRef(new Animated.Value(0)).current;
  const needleValue = useRef(new Animated.Value(0)).current;

  const lastRingDeg   = useRef(0);
  const lastNeedleDeg = useRef(0);

  // ── Girar la rosa de los vientos al contrario del heading del dispositivo ──
  useEffect(() => {
    const ringTarget = (-heading + 360) % 360;
    const next = shortestRotation(lastRingDeg.current, ringTarget);
    lastRingDeg.current = next;
    Animated.timing(ringValue, {
      toValue: next,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [heading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actualizar la aguja cuando cambia el heading del dispositivo ───────────
  useEffect(() => {
    if (bearing === null) return;
    const needleTarget = (bearing - heading + 360) % 360;
    const next = shortestRotation(lastNeedleDeg.current, needleTarget);
    lastNeedleDeg.current = next;
    Animated.timing(needleValue, {
      toValue: next,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [heading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reiniciar la aguja cuando cambia el equipo (nuevo bearing) ────────────
  useEffect(() => {
    // Cancelar cualquier animación en curso y resetear a 0
    needleValue.stopAnimation();
    needleValue.setValue(0);
    lastNeedleDeg.current = 0;

    if (bearing === null) return;

    const needleTarget = (bearing - heading + 360) % 360;
    const next = shortestRotation(0, needleTarget);
    lastNeedleDeg.current = next;
    Animated.timing(needleValue, {
      toValue: next,
      duration: 500,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, [bearing]); // eslint-disable-line react-hooks/exhaustive-deps

  const ringSpin = ringValue.interpolate({
    inputRange: [-3600, 0, 3600],
    outputRange: ['-3600deg', '0deg', '3600deg'],
  });

  const needleSpin = needleValue.interpolate({
    inputRange: [-3600, 0, 3600],
    outputRange: ['-3600deg', '0deg', '3600deg'],
  });

  function formatDist(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  const relativeBearing = bearing !== null ? Math.round((bearing - heading + 360) % 360) : null;

  // ─── Estado sin ubicación ─────────────────────────────────────────────────
  if (bearing === null) {
    return (
      <View style={styles.container}>
        <View style={styles.outerRing}>
          <View style={styles.compassRose}>
            {CARDINAL_LABELS.map(({ label, angle, major }) => {
              const rad = (angle * Math.PI) / 180;
              const r   = COMPASS_SIZE / 2 - 16;
              return (
                <View
                  key={label}
                  style={[
                    styles.cardinalContainer,
                    { transform: [{ translateX: r * Math.sin(rad) }, { translateY: -r * Math.cos(rad) }] },
                  ]}
                >
                  <Text style={[styles.cardinal, major ? styles.cardinalMajor : styles.cardinalMinor]}>
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.middleRing}>
            <View style={styles.thinRing}>
              <View style={styles.innerRing}>
                <View style={styles.innerCircle}>
                  <Text style={styles.noDataIcon}>⚽</Text>
                  <Text style={styles.noDataLabel}>Obteniendo{'\n'}ubicación...</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ─── Brújula normal ───────────────────────────────────────────────────────
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={
        stadiumName
          ? `Brújula: el estadio ${stadiumName} está a ${relativeBearing}° relativo a tu posición`
          : `Brújula apuntando a ${relativeBearing} grados`
      }
    >
      <View style={styles.outerRing}>
        {/* Rosa giratoria */}
        <Animated.View style={[styles.compassRose, { transform: [{ rotate: ringSpin }] }]}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.tickMark,
                {
                  transform: [
                    { rotate: `${i * 30}deg` },
                    { translateY: -(COMPASS_SIZE / 2 - 6) },
                  ],
                },
                i % 3 === 0 ? styles.tickMajor : styles.tickMinor,
              ]}
            />
          ))}
          {CARDINAL_LABELS.map(({ label, angle, major }) => {
            const rad = (angle * Math.PI) / 180;
            const r   = COMPASS_SIZE / 2 - 16;
            return (
              <View
                key={label}
                style={[
                  styles.cardinalContainer,
                  { transform: [{ translateX: r * Math.sin(rad) }, { translateY: -r * Math.cos(rad) }] },
                ]}
              >
                <Text style={[styles.cardinal, major ? styles.cardinalMajor : styles.cardinalMinor]}>
                  {label}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Anillos interiores */}
        <View style={styles.middleRing}>
          <View style={styles.thinRing}>
            <View style={styles.innerRing}>
              <View style={styles.innerCircle}>
                {/* Aguja */}
                <Animated.View style={[styles.needleWrapper, { transform: [{ rotate: needleSpin }] }]}>
                  <View style={styles.needleNorth} />
                  <View style={styles.needleCenter} />
                  <View style={styles.needleSouth} />
                </Animated.View>
                {/* Pivote central */}
                <View style={styles.pivot} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Fila de datos debajo */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>RUMBO</Text>
          <Text style={styles.infoValue}>{Math.round(bearing)}°</Text>
        </View>
        {distance != null && (
          <View style={[styles.infoItem, styles.infoItemCenter]}>
            <Text style={styles.infoLabel}>DISTANCIA</Text>
            <Text style={styles.infoValue}>{formatDist(distance)}</Text>
          </View>
        )}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>RELATIVO</Text>
          <Text style={styles.infoValue}>{relativeBearing}°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  outerRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#1A2744',
    borderWidth: 4,
    borderColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  compassRose: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickMark: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#C9A84C',
    borderRadius: 1,
  },
  tickMajor: {
    height: 10,
    width: 2.5,
    backgroundColor: '#FFD700',
  },
  tickMinor: {
    height: 5,
    backgroundColor: '#8A7A50',
  },
  cardinalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinal: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardinalMajor: {
    fontSize: 11,
    color: '#FFD700',
  },
  cardinalMinor: {
    fontSize: 8,
    color: '#A89060',
  },
  middleRing: {
    width: MIDDLE_SIZE,
    height: MIDDLE_SIZE,
    borderRadius: MIDDLE_SIZE / 2,
    backgroundColor: '#1A2744',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thinRing: {
    width: THIN_SIZE,
    height: THIN_SIZE,
    borderRadius: THIN_SIZE / 2,
    backgroundColor: '#1A2744',
    borderWidth: 2,
    borderColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: INNER_RING_SIZE,
    height: INNER_RING_SIZE,
    borderRadius: INNER_RING_SIZE / 2,
    backgroundColor: '#1A2744',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A3F6A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  needleWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: NEEDLE_HALF_HEIGHT * 2,
    width: NEEDLE_WIDTH * 2,
  },
  needleNorth: {
    width: 0,
    height: 0,
    borderLeftWidth: NEEDLE_WIDTH / 2,
    borderRightWidth: NEEDLE_WIDTH / 2,
    borderBottomWidth: NEEDLE_HALF_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E53935',
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  needleCenter: {
    width: NEEDLE_WIDTH * 0.8,
    height: NEEDLE_WIDTH * 0.8,
    borderRadius: NEEDLE_WIDTH * 0.4,
    backgroundColor: '#C9A84C',
    zIndex: 2,
  },
  needleSouth: {
    width: 0,
    height: 0,
    borderLeftWidth: NEEDLE_WIDTH / 2,
    borderRightWidth: NEEDLE_WIDTH / 2,
    borderTopWidth: NEEDLE_HALF_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ECEFF1',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  pivot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9A84C',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    zIndex: 3,
  },
  noDataIcon: {
    fontSize: 28,
    marginBottom: 3,
  },
  noDataLabel: {
    fontSize: 10,
    color: '#8A9BBE',
    textAlign: 'center',
    lineHeight: 14,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: '#1A2744',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#C9A84C',
    gap: 12,
  },
  infoItem: {
    alignItems: 'center',
    minWidth: 64,
  },
  infoItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#C9A84C44',
    paddingHorizontal: 14,
  },
  infoLabel: {
    fontSize: 9,
    color: '#8A9BBE',
    fontWeight: '700',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});

export default Compass;
