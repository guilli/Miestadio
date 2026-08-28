import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StadiumWithDistance } from '../types';

interface StadiumCardProps {
  stadium: StadiumWithDistance;
}

function formatDistance(km: number | null): string {
  if (km === null) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function formatNumber(n: number): string {
  return n.toLocaleString('es-ES');
}

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const StadiumCard: React.FC<StadiumCardProps> = ({ stadium }) => {
  return (
    <View style={styles.card} accessible accessibilityLabel={`Estadio ${stadium.name}`}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stadiumName} numberOfLines={2}>
          {stadium.name}
        </Text>
        <View style={[styles.divisionBadge, stadium.division === 'Primera' ? styles.primera : styles.segunda]}>
          <Text style={styles.divisionText}>{stadium.division}</Text>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.divider} />
      <Row label="⚽ Equipo" value={stadium.teamName} />
      <Row label="🏙️ Ciudad" value={stadium.city} />
      <Row label="🌍 País" value={stadium.country} />
      <Row label="🪑 Aforo" value={`${formatNumber(stadium.capacity)} espectadores`} />
      <Row label="🏗️ Año construcción" value={String(stadium.yearBuilt)} />
      <Row label="📏 Distancia" value={formatDistance(stadium.distance)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stadiumName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginRight: 8,
  },
  divisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  primera: {
    backgroundColor: '#1565C0',
  },
  segunda: {
    backgroundColor: '#6A1B9A',
  },
  divisionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});

export default StadiumCard;
