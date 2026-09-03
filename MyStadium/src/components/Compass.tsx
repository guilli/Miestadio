import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface CompassProps {
  bearing: number | null;
  heading: number;
  stadiumName?: string;
  distance?: number | null;
}

const SIZE = 220;
const INNER = SIZE - 60;
const NEEDLE_H = INNER / 2 - 12;
const NEEDLE_W = 10;

const CARDINALS = [
  { label: 'N', angle: 0, major: true },
  { label: 'NE', angle: 45, major: false },
  { label: 'E', angle: 90, major: true },
  { label: 'SE', angle: 135, major: false },
  { label: 'S', angle: 180, major: true },
  { label: 'SO', angle: 225, major: false },
  { label: 'O', angle: 270, major: true },
  { label: 'NO', angle: 315, major: false },
];

function shortestRotation(current: number, target: number): number {
  const mod = ((current % 360) + 360) % 360;
  let delta = ((target - mod) + 360) % 360;
  if (delta > 180) { delta -= 360; }
  return current + delta;
}

function formatDist(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export default function Compass({ bearing, heading, stadiumName, distance }: CompassProps) {
  const roseAnim = useRef(new Animated.Value(0)).current;
  const needleAnim = useRef(new Animated.Value(0)).current;
  const lastRose = useRef(0);
  const lastNeedle = useRef(0);

  useEffect(() => {
    const target = (-heading + 360) % 360;
    const next = shortestRotation(lastRose.current, target);
    lastRose.current = next;
    Animated.timing(roseAnim, { toValue: next, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [heading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (bearing === null) { return; }
    const target = (bearing - heading + 360) % 360;
    const next = shortestRotation(lastNeedle.current, target);
    lastNeedle.current = next;
    Animated.timing(needleAnim, { toValue: next, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [heading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    needleAnim.stopAnimation();
    needleAnim.setValue(0);
    lastNeedle.current = 0;
    if (bearing === null) { return; }
    const target = (bearing - heading + 360) % 360;
    const next = shortestRotation(0, target);
    lastNeedle.current = next;
    Animated.timing(needleAnim, { toValue: next, duration: 500, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }).start();
  }, [bearing]); // eslint-disable-line react-hooks/exhaustive-deps

  const roseSpin = roseAnim.interpolate({ inputRange: [-3600, 0, 3600], outputRange: ['-3600deg', '0deg', '3600deg'] });
  const needleSpin = needleAnim.interpolate({ inputRange: [-3600, 0, 3600], outputRange: ['-3600deg', '0deg', '3600deg'] });
  const relBearing = bearing !== null ? Math.round((bearing - heading + 360) % 360) : null;

  return (
    <View style={styles.container}>
      <View style={styles.outerRing}>
        <Animated.View style={[styles.rose, { transform: [{ rotate: roseSpin }] }]}>
          {Array.from({ length: 36 }).map((_, i) => (
            <View key={i} style={[styles.tick, i % 9 === 0 ? styles.tickMajor : i % 3 === 0 ? styles.tickMed : styles.tickMin, { transform: [{ rotate: `${i * 10}deg` }, { translateY: -(SIZE / 2 - 5) }] }]} />
          ))}
          {CARDINALS.map(({ label, angle, major }) => {
            const rad = (angle * Math.PI) / 180;
            const r = SIZE / 2 - 18;
            return (
              <View key={label} style={[styles.cardinalWrap, { transform: [{ translateX: r * Math.sin(rad) }, { translateY: -r * Math.cos(rad) }] }]}>
                <Text style={[styles.cardinal, major ? styles.cardinalMajor : styles.cardinalMinor]}>{label}</Text>
              </View>
            );
          })}
        </Animated.View>

        <View style={styles.innerCircle}>
          {bearing === null ? (
            <View style={styles.noData}>
              <Text style={styles.noDataIcon}>⚽</Text>
              <Text style={styles.noDataText}>Sin{'\n'}ubicación</Text>
            </View>
          ) : (
            <>
              <Animated.View style={[styles.needleWrap, { transform: [{ rotate: needleSpin }] }]}>
                <View style={styles.needleN} />
                <View style={styles.needleCenter} />
                <View style={styles.needleS} />
              </Animated.View>
              <View style={styles.pivot} />
            </>
          )}
        </View>
        <View style={styles.northDot} />
      </View>

      {bearing !== null && (
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>RUMBO</Text>
            <Text style={styles.infoVal}>{Math.round(bearing)}°</Text>
          </View>
          {distance != null && (
            <View style={[styles.infoCell, styles.infoCellCenter]}>
              <Text style={styles.infoLabel}>DISTANCIA</Text>
              <Text style={styles.infoVal}>{formatDist(distance)}</Text>
            </View>
          )}
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>RELATIVO</Text>
            <Text style={styles.infoVal}>{relBearing}°</Text>
          </View>
        </View>
      )}
      {stadiumName && bearing !== null && (
        <Text style={styles.stadiumLabel}>🏟 {stadiumName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 8 },
  outerRing: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: '#0D1B2A', borderWidth: 3, borderColor: '#C9A84C', alignItems: 'center', justifyContent: 'center', elevation: 10 },
  rose: { position: 'absolute', width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  tick: { position: 'absolute', width: 2, borderRadius: 1 },
  tickMajor: { height: 12, backgroundColor: '#FFD700' },
  tickMed: { height: 8, backgroundColor: '#C9A84C' },
  tickMin: { height: 4, backgroundColor: '#4A5568' },
  cardinalWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  cardinal: { fontWeight: '800' },
  cardinalMajor: { fontSize: 12, color: '#FFD700' },
  cardinalMinor: { fontSize: 8, color: '#7A8A9A' },
  innerCircle: { width: INNER, height: INNER, borderRadius: INNER / 2, backgroundColor: '#F8F8F8', borderWidth: 2, borderColor: '#2A3F6A', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  needleWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center', height: NEEDLE_H * 2, width: NEEDLE_W * 2 },
  needleN: { position: 'absolute', top: 0, alignSelf: 'center', width: 0, height: 0, borderLeftWidth: NEEDLE_W / 2, borderRightWidth: NEEDLE_W / 2, borderBottomWidth: NEEDLE_H, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#E53935' },
  needleCenter: { width: NEEDLE_W, height: NEEDLE_W, borderRadius: NEEDLE_W / 2, backgroundColor: '#C9A84C', zIndex: 2 },
  needleS: { position: 'absolute', bottom: 0, alignSelf: 'center', width: 0, height: 0, borderLeftWidth: NEEDLE_W / 2, borderRightWidth: NEEDLE_W / 2, borderTopWidth: NEEDLE_H, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#BDBDBD' },
  pivot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#C9A84C', borderWidth: 2, borderColor: '#FFD700', zIndex: 3 },
  northDot: { position: 'absolute', top: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD700' },
  noData: { alignItems: 'center' },
  noDataIcon: { fontSize: 30, marginBottom: 4 },
  noDataText: { fontSize: 10, color: '#888', textAlign: 'center', lineHeight: 15 },
  infoRow: { flexDirection: 'row', marginTop: 16, backgroundColor: '#0D1B2A', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 20, borderWidth: 1, borderColor: '#C9A84C', gap: 16 },
  infoCell: { alignItems: 'center', minWidth: 60 },
  infoCellCenter: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#C9A84C55', paddingHorizontal: 16 },
  infoLabel: { fontSize: 9, color: '#8A9BBE', fontWeight: '700', letterSpacing: 1 },
  infoVal: { fontSize: 17, color: '#FFD700', fontWeight: '700', marginTop: 2 },
  stadiumLabel: { marginTop: 8, fontSize: 12, color: '#555', fontWeight: '600', textAlign: 'center' },
});
