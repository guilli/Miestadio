import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { stadiums as allStadiums } from "../data/stadiums";
import { Division, Stadium } from "../types";
import { loadVisited, saveVisited } from "../storage/visitedStorage";

type Filter = "todos" | "visitados" | "pendientes";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "visitados", label: "Visitados" },
  { id: "pendientes", label: "Pendientes" },
];

const DIVISIONS: { id: Division; label: string }[] = [
  { id: "Primera", label: "Primera División" },
  { id: "Segunda", label: "Segunda División" },
];

function ProgressBar({ pct, height = 10, track = "#E8F5E9", fill = "#2E7D32" }: { pct: number; height?: number; track?: string; fill?: string }) {
  return (
    <View style={[styles.barTrack, { backgroundColor: track, height }]}>
      <View style={[styles.barFill, { backgroundColor: fill, width: `${Math.min(100, Math.max(0, pct))}%` }]} />
    </View>
  );
}

function StatTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1} ellipsizeMode="tail">{value}</Text>
    </View>
  );
}

export default function VisitedScreen() {
  const insets = useSafeAreaInsets();
  const [visited, setVisited] = useState<string[] | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => {
    let alive = true;
    loadVisited().then(ids => {
      if (alive) setVisited(ids);
    });
    return () => {
      alive = false;
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setVisited(prev => {
      if (!prev) return prev;
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveVisited(next);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reiniciar marcadores",
      "Se desmarcarán todos los campos visitados. ¿Quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: () => {
            setVisited([]);
            saveVisited([]);
          },
        },
      ],
    );
  }, []);

  const visitedSet = useMemo(() => new Set(visited ?? []), [visited]);

  const stats = useMemo(() => {
    const visitedStadiums = allStadiums.filter(s => visitedSet.has(s.id));
    const total = allStadiums.length;
    const count = visitedStadiums.length;
    const pct = total > 0 ? (count / total) * 100 : 0;

    const byDivision = DIVISIONS.map(d => {
      const all = allStadiums.filter(s => s.division === d.id);
      const done = all.filter(s => visitedSet.has(s.id)).length;
      return { ...d, done, total: all.length, pct: all.length > 0 ? (done / all.length) * 100 : 0 };
    });

    const allCities = new Set(allStadiums.map(s => s.city));
    const visitedCities = new Set(visitedStadiums.map(s => s.city));

    const capacity = visitedStadiums.reduce((sum, s) => sum + s.capacity, 0);

    const years = visitedStadiums.map(s => s.yearBuilt);
    const oldest = years.length > 0 ? Math.min(...years) : null;
    const newest = years.length > 0 ? Math.max(...years) : null;

    return {
      count,
      total,
      pct,
      byDivision,
      citiesVisited: visitedCities.size,
      citiesTotal: allCities.size,
      capacity,
      oldest,
      newest,
      visitedStadiums,
    };
  }, [visitedSet]);

  const matchesFilter = useCallback((s: Stadium) => {
    if (filter === "visitados") return visitedSet.has(s.id);
    if (filter === "pendientes") return !visitedSet.has(s.id);
    return true;
  }, [filter, visitedSet]);

  if (visited === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando tus marcadores…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Campos que has visitado</Text>
        <View style={styles.heroNumbers}>
          <Text style={styles.heroCount}>{stats.count}</Text>
          <Text style={styles.heroTotal}>/{stats.total}</Text>
        </View>
        <Text style={styles.heroPct}>{stats.pct.toFixed(0)}% completado</Text>
        <View style={styles.heroBarWrap}>
          <ProgressBar pct={stats.pct} height={12} track="rgba(255,255,255,0.25)" fill="#FFD700" />
        </View>

        <View style={styles.divisionBlock}>
          {stats.byDivision.map(d => (
            <View key={d.id} style={styles.divisionRow}>
              <View style={styles.divisionLabels}>
                <Text style={styles.divisionName}>{d.id === "Primera" ? "⭐ Primera" : "🌟 Segunda"}</Text>
                <Text style={styles.divisionCount}>{d.done}/{d.total}</Text>
              </View>
              <ProgressBar pct={d.pct} height={7} track="rgba(255,255,255,0.2)" fill="#A5D6A7" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatTile icon="🏙" label="Ciudades" value={`${stats.citiesVisited}/${stats.citiesTotal}`} />
        <StatTile icon="👥" label="Aforo acumulado" value={stats.capacity.toLocaleString("es-ES")} />
        <StatTile icon="📜" label="Más antiguo" value={stats.oldest != null ? String(stats.oldest) : "—"} />
        <StatTile icon="🏗" label="Más moderno" value={stats.newest != null ? String(stats.newest) : "—"} />
      </View>

      <View style={styles.filtersRow}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(f.id)}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.spacer} />
        <TouchableOpacity onPress={handleReset} style={styles.resetBtn} accessibilityRole="button">
          <Text style={styles.resetText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {DIVISIONS.map(d => {
        const list = allStadiums.filter(s => s.division === d.id && matchesFilter(s));
        const done = allStadiums.filter(s => s.division === d.id && visitedSet.has(s.id)).length;
        const total = allStadiums.filter(s => s.division === d.id).length;
        if (list.length === 0) return null;
        return (
          <View key={d.id}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{d.label}</Text>
              <Text style={styles.sectionCount}>{done}/{total}</Text>
            </View>
            {list.map(s => {
              const marked = visitedSet.has(s.id);
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.row, marked && styles.rowMarked]}
                  onPress={() => toggle(s.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: marked }}
                >
                  <View style={[styles.checkbox, marked && styles.checkboxOn]}>
                    {marked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.rowTexts}>
                    <Text style={[styles.rowName, marked && styles.rowNameOn]} numberOfLines={1}>{s.name}</Text>
                    <Text style={styles.rowSub} numberOfLines={1}>{s.teamName} · {s.city}</Text>
                  </View>
                  <Text style={styles.rowCapacity}>{Math.round(s.capacity / 1000)}k</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}

      {stats.count === stats.total && (
        <View style={styles.doneBox}>
          <Text style={styles.doneIcon}>🏆</Text>
          <Text style={styles.doneText}>¡Enhorabuena! Has visitado todos los campos de MyStadium.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F4F0" },
  content: { padding: 16, gap: 14 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F0F4F0", gap: 12 },
  loadingText: { color: "#666", fontSize: 14 },

  hero: { backgroundColor: "#1B5E20", borderRadius: 20, padding: 20, alignItems: "center" },
  heroTitle: { fontSize: 14, fontWeight: "800", color: "#A5D6A7", textTransform: "uppercase", letterSpacing: 1 },
  heroNumbers: { flexDirection: "row", alignItems: "flex-end", marginTop: 6 },
  heroCount: { fontSize: 56, fontWeight: "900", color: "#fff", lineHeight: 62 },
  heroTotal: { fontSize: 24, fontWeight: "700", color: "#A5D6A7", marginBottom: 8, marginLeft: 2 },
  heroPct: { fontSize: 13, color: "#FFD700", fontWeight: "700", marginBottom: 12 },
  heroBarWrap: { width: "100%" },
  divisionBlock: { width: "100%", marginTop: 18, gap: 12 },
  divisionRow: { gap: 5 },
  divisionLabels: { flexDirection: "row", justifyContent: "space-between" },
  divisionName: { fontSize: 12, color: "#C8E6C9", fontWeight: "700" },
  divisionCount: { fontSize: 12, color: "#fff", fontWeight: "800" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statTile: { backgroundColor: "#fff", borderRadius: 14, padding: 14, width: "47.5%", flexGrow: 1, elevation: 2 },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statLabel: { fontSize: 10, color: "#999", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  statValue: { fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginTop: 3 },

  filtersRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#C8E6C9" },
  chipActive: { backgroundColor: "#1B5E20", borderColor: "#1B5E20" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#2E7D32" },
  chipTextActive: { color: "#fff" },
  spacer: { flex: 1 },
  resetBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  resetText: { fontSize: 13, color: "#C62828", fontWeight: "700" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: "#1B5E20", textTransform: "uppercase", letterSpacing: 1 },
  sectionCount: { fontSize: 13, fontWeight: "800", color: "#999" },

  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8, gap: 12, elevation: 1 },
  rowMarked: { backgroundColor: "#E8F5E9", borderColor: "#C8E6C9", borderWidth: 1 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: "#C8E6C9", backgroundColor: "#FAFAFA", alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  checkmark: { color: "#fff", fontSize: 15, fontWeight: "900", lineHeight: 17 },
  rowTexts: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: "700", color: "#1A1A2E" },
  rowNameOn: { color: "#2E7D32" },
  rowSub: { fontSize: 12, color: "#777", marginTop: 2 },
  rowCapacity: { fontSize: 12, fontWeight: "700", color: "#999" },

  doneBox: { alignItems: "center", backgroundColor: "#FFF8E1", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "#FFE082", gap: 6 },
  doneIcon: { fontSize: 40 },
  doneText: { fontSize: 14, color: "#6D4C41", textAlign: "center", lineHeight: 20, fontWeight: "600" },

  barTrack: { width: "100%", borderRadius: 6, overflow: "hidden", backgroundColor: "#E8F5E9" },
  barFill: { height: "100%", borderRadius: 6 },
});
