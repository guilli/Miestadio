import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import i18n, { SUPPORTED_LANGUAGES, getAppLanguage, setAppLanguage } from "../i18n";

const FEATURES: { icon: string; titleKey: string; descKey: string }[] = [
  { icon: "🧭", titleKey: "info.features.compass.title", descKey: "info.features.compass.desc" },
  { icon: "📋", titleKey: "info.features.card.title", descKey: "info.features.card.desc" },
  { icon: "🧠", titleKey: "info.features.quiz.title", descKey: "info.features.quiz.desc" },
  { icon: "✅", titleKey: "info.features.visited.title", descKey: "info.features.visited.desc" },
  { icon: "📲", titleKey: "info.features.share.title", descKey: "info.features.share.desc" },
];

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const currentLang = getAppLanguage();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🏟</Text>
          <Text style={styles.heroTitle}>MyStadium</Text>
          <Text style={styles.heroVersion}>{t("info.heroVersion")}</Text>
          <Text style={styles.heroTagline}>{t("info.heroTagline")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("info.whatDoes")}</Text>
        {FEATURES.map(f => (
          <View key={f.titleKey} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
              <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t("info.howCompass")}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>{t("info.howCompassText")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("info.stadiumsCovered")}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>{t("info.stadiumsCoveredText")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("info.partners")}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>{t("info.partnersText")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("info.languageSection")}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>{t("info.languageSub")}</Text>
          <View style={styles.langChips}>
            {SUPPORTED_LANGUAGES.map(code => {
              const active = currentLang === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.langChip, active && styles.langChipActive]}
                  onPress={() => setAppLanguage(code)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.langChipText, active && styles.langChipTextActive]}>
                    {i18n.t(`languages.${code}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.footer}>{t("info.footer")}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F4F0" },
  content: { padding: 20 },
  hero: { alignItems: "center", backgroundColor: "#1B5E20", borderRadius: 20, paddingVertical: 32, paddingHorizontal: 20, marginBottom: 28 },
  heroIcon: { fontSize: 64, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  heroVersion: { fontSize: 12, color: "#A5D6A7", marginTop: 2, marginBottom: 12 },
  heroTagline: { fontSize: 14, color: "#C8E6C9", textAlign: "center", lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: "#1B5E20", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  featureCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, gap: 14, elevation: 2 },
  featureIcon: { fontSize: 28, marginTop: 2 },
  featureTexts: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A2E", marginBottom: 4 },
  featureDesc: { fontSize: 13, color: "#666", lineHeight: 20 },
  infoBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#2E7D32" },
  infoBoxText: { fontSize: 14, color: "#444", lineHeight: 22 },
  langChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  langChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F1F8E9", borderWidth: 1, borderColor: "#C8E6C9" },
  langChipActive: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  langChipText: { fontSize: 13, fontWeight: "700", color: "#2E7D32" },
  langChipTextActive: { color: "#fff" },
  footer: { textAlign: "center", fontSize: 12, color: "#999", marginTop: 8 },
});