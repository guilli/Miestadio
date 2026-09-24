import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { stadiums as allStadiums } from "../data/stadiums";
import { SPORTS, SportLeague } from "../data/sports";
import { SportId, StadiumWithDistance } from "../types";
import useLocation from "../hooks/useLocation";
import useMagnetometer from "../hooks/useMagnetometer";
import Compass from "../components/Compass";

const PLACEHOLDER = "__none__";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { userLocation, locationError, enrichStadiums, refreshLocation } = useLocation();
  const heading = useMagnetometer();

  const [sportId, setSportId] = useState<SportId>("futbol");
  const [leagueId, setLeagueId] = useState<string>("spain_primera");
  const [teamId, setTeamId] = useState<string>(PLACEHOLDER);

  const sport = useMemo(() => SPORTS.find(s => s.id === sportId) ?? SPORTS[0], [sportId]);
  const isFootball = sport.id === "futbol";
  const currentLeague = useMemo<SportLeague>(
    () => sport.leagues.find(l => l.id === leagueId) ?? sport.leagues[0],
    [sport, leagueId],
  );

  // Equipos disponibles para la liga elegida
  const teams = useMemo<string[]>(() => {
    if (isFootball) {
      return allStadiums
        .filter(s => s.country === currentLeague.country && s.division === currentLeague.division)
        .map(s => s.teamName)
        .sort((a, b) => a.localeCompare(b));
    }
    return currentLeague.teams ?? [];
  }, [isFootball, currentLeague]);

  // Estadios enriquecidos con distancia/rumbo solo para fútbol (único deporte con datos reales)
  const filteredStadiums = useMemo<StadiumWithDistance[]>(() => {
    if (!isFootball) return [];
    const base = allStadiums.filter(
      s => s.country === currentLeague.country && s.division === currentLeague.division,
    );
    return enrichStadiums(base).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [isFootball, currentLeague, enrichStadiums]);

  const stadium = useMemo<StadiumWithDistance | null>(
    () =>
      teamId === PLACEHOLDER
        ? null
        : filteredStadiums.find(s => s.teamName === teamId) ?? null,
    [teamId, filteredStadiums],
  );

  const handleSportChange = (id: SportId) => {
    const next = SPORTS.find(s => s.id === id) ?? SPORTS[0];
    setSportId(next.id);
    setLeagueId(next.leagues[0].id);
    setTeamId(PLACEHOLDER);
  };

  const handleLeagueChange = (id: string) => {
    setLeagueId(id);
    setTeamId(PLACEHOLDER);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.selectorsRow}>
        {/* Selector de deporte · chips */}
        <View style={styles.pickerWrapRow}>
          <Text style={styles.pickerLabel}>{t("home.sport")}</Text>
          <View style={styles.chips}>
            {SPORTS.map(s => {
              const active = s.id === sport.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => handleSportChange(s.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {s.icon} {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selector de Liga */}
        <View style={styles.pickerWrapRow}>
          <Text style={styles.pickerLabel}>{t("home.league")}</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={currentLeague.id}
              onValueChange={v => handleLeagueChange(v as string)}
              style={styles.picker}
              dropdownIconColor="#2E7D32"
            >
              {sport.leagues.map(l => (
                <Picker.Item key={l.id} label={l.label} value={l.id} style={styles.pickerItem} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Selector de Equipo */}
        <View style={styles.pickerWrapRow}>
          <Text style={styles.pickerLabel}>{t("home.team")}</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={teamId}
              onValueChange={v => setTeamId(v as string)}
              style={styles.picker}
              dropdownIconColor="#2E7D32"
              mode="dropdown"
            >
              <Picker.Item label={t("home.chooseTeam")} value={PLACEHOLDER} color="#999" style={styles.pickerItem} />
              {teams.map(name => (
                <Picker.Item key={name} label={name} value={name} style={styles.pickerItem} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {locationError && (
        <TouchableOpacity style={styles.errorBanner} onPress={refreshLocation}>
          <Text style={styles.errorText}>⚠️ {t(locationError)}</Text>
          <Text style={styles.errorRetry}>{t("home.retry")}</Text>
        </TouchableOpacity>
      )}

      {!userLocation && !locationError && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#2E7D32" />
          <Text style={styles.loadingText}>{t("home.gettingLocation")}</Text>
        </View>
      )}

      {teamId === PLACEHOLDER ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🧭</Text>
          <Text style={styles.emptyText}>{t("home.empty")}</Text>
        </View>
      ) : stadium ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.compassSection}>
            <Text style={styles.sectionTitle}>{t("home.directionTo", { name: stadium.name })}</Text>
            <Compass bearing={stadium.bearing} heading={heading} distance={stadium.distance} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardStadiumName}>{stadium.name}</Text>
            <Text style={styles.cardTeam}>{stadium.teamName}</Text>
            <View style={styles.divider} />
            <Row icon="📍" label={t("home.city")} value={stadium.city} />
            <Row icon="🏆" label={t("home.league")} value={t(`home.leagueLabel.${stadium.division.toLowerCase()}`)} />
            <Row icon="👥" label={t("home.capacity")} value={stadium.capacity.toLocaleString("es-ES")} />
            <Row icon="📅" label={t("home.year")} value={t("home.inaugurated", { year: stadium.yearBuilt })} />
            {stadium.distance != null && (
              <Row icon="📏" label={t("compass.distance")} value={stadium.distance < 1 ? `${Math.round(stadium.distance * 1000)} m` : `${stadium.distance.toFixed(1)} km`} />
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{sport.icon}</Text>
          <Text style={styles.emptyText}>{t("home.soonTitle", { sport: sport.label })}</Text>
          <Text style={styles.emptySub}>{t("home.soonText", { sport: sport.label })}</Text>
        </View>
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
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  icon: { fontSize: 20, width: 32 },
  texts: { flex: 1 },
  label: { fontSize: 10, color: "#999", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 15, color: "#1A1A2E", fontWeight: "600", marginTop: 1 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F4F0" },

  selectorsRow: { backgroundColor: "#fff", paddingHorizontal: 12, paddingTop: 8, paddingBottom: Platform.OS === "ios" ? 8 : 6, borderBottomWidth: 1, borderBottomColor: "#E0E0E0", gap: 6 },
  pickerWrapRow: { width: "100%" },
  pickerLabel: { fontSize: 11, color: "#777", fontWeight: "700", marginLeft: 4, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.3 },
  pickerBox: { borderWidth: 1, borderColor: "#C8E6C9", borderRadius: 10, backgroundColor: "#E8F5E9", justifyContent: "center" },
  picker: { ...(Platform.OS === "ios" ? { height: 44 } : {}), fontSize: 15, fontWeight: "600", color: "#1B5E20", width: "100%" },
  pickerItem: { fontSize: 15 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingVertical: 2 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#C8E6C9" },
  chipActive: { backgroundColor: "#1B5E20", borderColor: "#1B5E20" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#2E7D32" },
  chipTextActive: { color: "#fff" },

  errorBanner: { backgroundColor: "#FFF3E0", borderLeftWidth: 4, borderLeftColor: "#FF6F00", padding: 12, margin: 12, borderRadius: 8 },
  errorText: { color: "#E65100", fontSize: 13 },
  errorRetry: { color: "#F57C00", fontSize: 12, marginTop: 2, textDecorationLine: "underline" },
  loadingRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#E8F5E9", paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#C8E6C9" },
  loadingText: { color: "#555", fontSize: 14 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 15, color: "#888", textAlign: "center", lineHeight: 24, fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#999", textAlign: "center", lineHeight: 20, marginTop: 8 },
  scroll: { paddingTop: 0 },
  compassSection: { backgroundColor: "#fff", alignItems: "center", paddingVertical: 24, borderBottomWidth: 2, borderBottomColor: "#C9A84C" },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#1B5E20", letterSpacing: 0.2, marginBottom: 12, textAlign: "center", paddingHorizontal: 16 },
  card: { backgroundColor: "#fff", margin: 16, borderRadius: 16, padding: 20, elevation: 4 },
  cardStadiumName: { fontSize: 20, fontWeight: "800", color: "#1A1A2E", marginBottom: 4 },
  cardTeam: { fontSize: 14, color: "#2E7D32", fontWeight: "600", marginBottom: 4 },
  divider: { height: 1, backgroundColor: "#EEEEEE", marginVertical: 12 },
});