import React from "react";
import { createBottomTabNavigator, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import HomeScreen from "../screens/HomeScreen";
import QuizScreen from "../screens/QuizScreen";
import VisitedScreen from "../screens/VisitedScreen";
import InfoScreen from "../screens/InfoScreen";
import { TabParamList } from "../types";

const Tab = createBottomTabNavigator<TabParamList>();

const TABS: { name: keyof TabParamList; emoji: string; labelKey: string }[] = [
  { name: "Home", emoji: "🧭", labelKey: "tabs.home" },
  { name: "Quiz", emoji: "🧠", labelKey: "tabs.quiz" },
  { name: "Visited", emoji: "✅", labelKey: "tabs.visited" },
  { name: "Info", emoji: "ℹ️", labelKey: "tabs.info" },
];

function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  return (
    <SafeAreaView edges={["top"]} style={styles.barSafe}>
      <View style={styles.bar}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>🏟 MyStadium</Text>
          <Text style={styles.titleSub}>{t("tabs.subtitle")}</Text>
        </View>
        <View style={styles.buttons}>
          {TABS.map((tab, i) => {
            const focused = state.index === i;
            const label = t(tab.labelKey);
            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.btn, focused && styles.btnActive]}
                onPress={() => navigation.navigate(tab.name)}
                accessibilityLabel={label}
              >
                <Text style={[styles.btnEmoji, focused && styles.btnEmojiActive]}>{tab.emoji}</Text>
                <Text style={[styles.btnLabel, focused && styles.btnLabelActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const renderAppTabBar = (props: BottomTabBarProps) => <AppTabBar {...props} />;

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={renderAppTabBar}
      screenOptions={{
        headerShown: false,
        tabBarPosition: "top",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Visited" component={VisitedScreen} />
      <Tab.Screen name="Info" component={InfoScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barSafe: { backgroundColor: "#1B5E20" },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  titleBox: { flex: 1 },
  title: { fontSize: 21, fontWeight: "900", color: "#fff", letterSpacing: 0.5 },
  titleSub: { fontSize: 11, color: "#A5D6A7", marginTop: 1 },
  buttons: { flexDirection: "row", gap: 6 },
  btn: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    minWidth: 46,
  },
  btnActive: { backgroundColor: "rgba(255,255,255,0.18)" },
  btnEmoji: { fontSize: 18, opacity: 0.55 },
  btnEmojiActive: { opacity: 1 },
  btnLabel: { fontSize: 9, fontWeight: "700", color: "#A5D6A7", marginTop: 1, letterSpacing: 0.2 },
  btnLabelActive: { color: "#FFD700" },
});