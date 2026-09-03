import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stadiums as allStadiums } from '../data/stadiums';
import { Division, StadiumWithDistance } from '../types';
import useLocation from '../hooks/useLocation';
import useMagnetometer from '../hooks/useMagnetometer';
import Compass from '../components/Compass';

type LeagueId = 'primera' | 'segunda';
const LEAGUES: { id: LeagueId; label: string; division: Division }[] = [
  { id: 'primera', label: '🥇 Primera División', division: 'Primera' },
  { id: 'segunda', label: '🥈 Segunda División', division: 'Segunda' },
];
const PLACEHOLDER = '__none__';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { userLocation, locationError, enrichStadiums, refreshLocation } = useLocation();
  const heading = useMagnetometer();

  const [leagueId, setLeagueId] = useState<LeagueId>('primera');
  const [teamId, setTeamId] = useState<string>(PLACEHOLDER);
  const league = useMemo(() => LEAGUES.find(l => l.id === leagueId)!, [leagueId]);

  const filteredStadiums = useMemo<StadiumWithDistance[]>(() => {
    const base = allStadiums.filter(s => s.division === league.division);
    return enrichStadiums(base).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [league, enrichStadiums]);

  useEffect(() => { setTeamId(PLACEHOLDER); }, [leagueId]);

  const stadium = useMemo<StadiumWithDistance | null>(
    () => teamId === PLACEHOLDER ? null : filteredStadiums.find(s => s.teamId === teamId) ?? null,
    [teamId, filteredStadiums],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏟 MyStadium</Text>
        <Text style={styles.headerSub}>Campos de fútbol · España</Text>
      </View>

      <View style={styles.selectors}>
        <View style={styles.pickerWrap}>
          <Text style={styles.pickerLabel}>Liga</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={leagueId} onValueChange={v => setLeagueId(v as LeagueId)} style={styles.picker} dropdownIconColor="#2E7D32">
              {LEAGUES.map(l => <Picker.Item key={l.id} label={l.label} value={l.id} />)}
            </Picker>
          </View>
        </View>
        <View style={styles.pickerWrap}>
          <Text style={styles.pickerLabel}>Equipo</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={teamId} onValueChange={v => setTeamId(v as string)} style={styles.picker} dropdownIconColor="#2E7D32" mode="dropdown">
              <Picker.Item label="— Elige un equipo —" value={PLACEHOLDER} color="#999" />
              {filteredStadiums.map(s => <Picker.Item key={s.teamId} label={s.teamName} value={s.teamId} />)}
            </Picker>
          </View>
        </View>
      </View>

      {locationError && (
        <TouchableOpacity style={styles.errorBanner} onPress={refreshLocation}>
          <Text style={styles.errorText}>⚠️ {locationError}</Text>
          <Text style={styles.errorRetry}>Toca para reintentar</Text>
        </TouchableOpacity>
      )}

      {!userLocation && !locationError && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#2E7D32" />
          <Text style={styles.loadingText}>Obteniendo ubicación…</Text>
        </View>
      )}

      {stadium === null ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🧭</Text>
          <Text style={styles.emptyText}>Selecciona una liga y un equipo{'\n'}para ver la brújula y los datos del estadio</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.compassSection}>
            <Text style={styles.sectionTitle}>DIRECCIÓN AL ESTADIO</Text>
            <Compass bearing={stadium.bearing} heading={heading} stadiumName={stadium.name} distance={stadium.distance} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardStadiumName}>{stadium.name}</Text>
            <Text style={styles.cardTeam}>{stadium.teamName}</Text>
            <View style={styles.divider} />
            <Row icon="📍" label="Ciudad" value={stadium.city} />
            <Row icon="🏆" label="Liga" value={stadium.division === 'Primera' ? 'Primera División' : 'Segunda División'} />
            <Row icon="👥" label="Aforo" value={stadium.capacity.toLocaleString('es-ES') + ' espectadores'} />
            <Row icon="📅" label="Año" value={`Inaugurado en ${stadium.yearBuilt}`} />
            {stadium.distance != null && (
              <Row icon="📏" label="Distancia" value={stadium.distance < 1 ? `${Math.round(stadium.distance * 1000)} m desde tu posición` : `${stadium.distance.toFixed(1)} km desde tu posición`} />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.icon}>{icon}</Text>
      <View style={rowStyles.texts}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  icon: { fontSize: 20, width: 32 },
  texts: { flex: 1 },
  label: { fontSize: 10, color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 15, color: '#1A1A2E', fontWeight: '600', marginTop: 1 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F4F0' },
  header: { backgroundColor: '#1B5E20', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  headerSub: { fontSize: 12, color: '#A5D6A7', marginTop: 2 },
  selectors: { backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 8 : 4, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', gap: 6 },
  pickerWrap: {},
  pickerLabel: { fontSize: 11, color: '#777', fontWeight: '700', marginLeft: 4, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.3 },
  pickerBox: { borderWidth: 1.5, borderColor: '#C8E6C9', borderRadius: 10, backgroundColor: '#F1F8E9', overflow: 'hidden' },
  picker: { height: 48, color: '#1B5E20' },
  errorBanner: { backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: '#FF6F00', padding: 12, margin: 12, borderRadius: 8 },
  errorText: { color: '#E65100', fontSize: 13 },
  errorRetry: { color: '#F57C00', fontSize: 12, marginTop: 2, textDecorationLine: 'underline' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 8, gap: 8, borderBottomWidth: 1, borderBottomColor: '#C8E6C9' },
  loadingText: { color: '#555', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 24 },
  scroll: { paddingTop: 0 },
  compassSection: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 24, borderBottomWidth: 2, borderBottomColor: '#C9A84C' },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#1B5E20', letterSpacing: 1.5, marginBottom: 12 },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 20, elevation: 4 },
  cardStadiumName: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  cardTeam: { fontSize: 14, color: '#2E7D32', fontWeight: '600', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 12 },
});
