import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { stadiums as allStadiums } from '../data/stadiums';
import { Country, Division, StadiumWithDistance, RootStackParamList } from '../types';
import useLocation from '../hooks/useLocation';
import Compass from '../components/Compass';
import StadiumCard from '../components/StadiumCard';

// ─── Liga = "País + División" fusionados en un único valor ──────────────────
type LeagueId = 'spain_primera' | 'spain_segunda';

interface League {
  id: LeagueId;
  label: string;
  country: Country;
  division: Division;
}

const LEAGUES: League[] = [
  { id: 'spain_primera', label: 'España - 1ª Div', country: 'España', division: 'Primera' },
  { id: 'spain_segunda', label: 'España - 2ª Div', country: 'España', division: 'Segunda' },
];

const PLACEHOLDER_TEAM = '__placeholder__';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNav>();

  const [selectedLeagueId, setSelectedLeagueId] = useState<LeagueId>('spain_primera');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(PLACEHOLDER_TEAM);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);

  const { userLocation, locationError, enrichStadiums, refreshLocation } = useLocation();

  // Liga actualmente seleccionada
  const selectedLeague = useMemo<League>(
    () => LEAGUES.find(l => l.id === selectedLeagueId) ?? LEAGUES[0],
    [selectedLeagueId],
  );

  // Estadios filtrados por la liga seleccionada, enriquecidos con distancia/bearing
  const filteredStadiums = useMemo<StadiumWithDistance[]>(() => {
    const filtered = allStadiums.filter(
      s => s.country === selectedLeague.country && s.division === selectedLeague.division,
    );
    const enriched = enrichStadiums(filtered);
    return enriched.sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [selectedLeague, enrichStadiums]);

  // Resetear selección de equipo cuando cambia la liga
  useEffect(() => {
    setSelectedTeamId(PLACEHOLDER_TEAM);
  }, [selectedLeagueId]);

  // Estadio seleccionado actualmente
  const selectedStadium = useMemo<StadiumWithDistance | null>(() => {
    if (selectedTeamId === PLACEHOLDER_TEAM) return null;
    return filteredStadiums.find(s => s.teamId === selectedTeamId) ?? null;
  }, [selectedTeamId, filteredStadiums]);

  // Suscripción al magnetómetro para obtener el heading del dispositivo
  useEffect(() => {
    let subscription: any = null;

    // Low-pass filter para suavizar la lectura del sensor
    let smoothX = 0;
    let smoothY = 0;
    const ALPHA = 0.15;

    const startMagnetometer = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { magnetometer, setUpdateIntervalForType, SensorTypes } = require('react-native-sensors');

        try { setUpdateIntervalForType(SensorTypes.magnetometer, 16); } catch { /* ignorar */ }

        subscription = magnetometer.subscribe(
          ({ x, y }: { x: number; y: number; z: number }) => {
            smoothX = ALPHA * x + (1 - ALPHA) * smoothX;
            smoothY = ALPHA * y + (1 - ALPHA) * smoothY;
            const angle = Math.atan2(smoothX, smoothY) * (180 / Math.PI);
            setDeviceHeading((angle + 360) % 360);
          },
          () => { /* ignorar errores del sensor */ },
        );
      } catch {
        // Sensor no disponible en simulador
      }
    };

    startMagnetometer();
    return () => subscription?.unsubscribe?.();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Cabecera ────────────────────────────────────────────── */}
      <View style={styles.appHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>🏟️ MiEstadio</Text>
          <Text style={styles.appSubtitle}>Campos de fútbol de España</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Quiz')}
            accessibilityLabel="Ir al Quiz"
          >
            <Text style={styles.headerBtnIcon}>🧠</Text>
            <Text style={styles.headerBtnLabel}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Info')}
            accessibilityLabel="Información de la app"
          >
            <Text style={styles.headerBtnIcon}>ℹ️</Text>
            <Text style={styles.headerBtnLabel}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Selectores en columna: Liga encima, Equipo debajo ───── */}
      <View style={styles.selectorsColumn}>
        {/* Selector de Liga */}
        <View style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>Liga</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedLeagueId}
              onValueChange={v => setSelectedLeagueId(v as LeagueId)}
              style={styles.picker}
              dropdownIconColor="#2E7D32"
            >
              {LEAGUES.map(l => (
                <Picker.Item key={l.id} label={l.label} value={l.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Selector de Equipo */}
        <View style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>Equipo</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedTeamId}
              onValueChange={v => setSelectedTeamId(v as string)}
              style={styles.picker}
              dropdownIconColor="#2E7D32"
              mode="dropdown"
            >
              <Picker.Item
                label="— Selecciona un equipo —"
                value={PLACEHOLDER_TEAM}
                color="#999"
              />
              {filteredStadiums.map(s => (
                <Picker.Item key={s.teamId} label={s.teamName} value={s.teamId} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* ── Banner de error de ubicación ────────────────────────── */}
      {locationError && (
        <TouchableOpacity style={styles.errorBanner} onPress={refreshLocation}>
          <Text style={styles.errorText}>⚠️ {locationError}</Text>
          <Text style={styles.errorRetry}>Pulsa para reintentar</Text>
        </TouchableOpacity>
      )}

      {/* ── Cargando ubicación ──────────────────────────────────── */}
      {!userLocation && !locationError && (
        <View style={styles.loadingBanner}>
          <ActivityIndicator size="small" color="#2E7D32" />
          <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
        </View>
      )}

      {/* ── Contenido principal ─────────────────────────────────── */}
      {selectedTeamId === PLACEHOLDER_TEAM ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🧭</Text>
          <Text style={styles.emptyStateText}>
            Selecciona un equipo para ver{'\n'}la dirección y datos del estadio
          </Text>
        </View>
      ) : selectedStadium ? (
        <ScrollView
          contentContainerStyle={[styles.detailScroll, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Brújula */}
          <View style={styles.compassSection}>
            <Text style={styles.compassTitle}>Dirección a {selectedStadium.teamName}</Text>
            <Compass
              bearing={selectedStadium.bearing}
              heading={deviceHeading}
              stadiumName={selectedStadium.name}
              distance={selectedStadium.distance}
            />
          </View>

          {/* Datos del estadio */}
          <StadiumCard stadium={selectedStadium} />
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // ── Cabecera con botones Quiz e Info
  appHeader: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 11,
    color: '#A5D6A7',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 52,
  },
  headerBtnIcon: {
    fontSize: 18,
  },
  headerBtnLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
    letterSpacing: 0.3,
  },

  // ── Selectores apilados (ocupan todo el ancho)
  selectorsColumn: {
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 6 : 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 4,
  },
  pickerRow: {
    width: '100%',
  },
  pickerLabel: {
    fontSize: 11,
    color: '#888',
    marginLeft: 6,
    marginBottom: 1,
    fontWeight: '600',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F8E9',
    width: '100%',
  },
  picker: {
    height: 48,
    color: '#1B5E20',
    width: '100%',
  },

  // ── Banners
  errorBanner: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  errorText: {
    color: '#E65100',
    fontSize: 13,
  },
  errorRetry: {
    color: '#F57C00',
    fontSize: 12,
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },

  // ── Estado vacío
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },

  // ── Detalle del estadio seleccionado
  detailScroll: {
    paddingTop: 24,
  },
  compassSection: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#C9A84C',
  },
  compassTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2744',
    marginBottom: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
