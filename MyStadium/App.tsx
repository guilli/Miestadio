import React, { Component, ReactNode } from "react";
import { StatusBar, Platform, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";

interface ErrorState {
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorState> {
  state: ErrorState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("MyStadium render error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.crashScreen}>
          <Text style={styles.crashIcon}>🏟️</Text>
          <Text style={styles.crashTitle}>MyStadium no pudo arrancar</Text>
          <Text style={styles.crashMsg}>
            Se produjo un error al dibujar la pantalla.
            {"\n"}Reinicia la app para volver a intentarlo.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        {...(Platform.OS === 'android' ? { backgroundColor: '#1B5E20' } : {})}
      />
      <AppErrorBoundary>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  crashScreen: {
    flex: 1,
    backgroundColor: "#1B5E20",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  crashIcon: { fontSize: 64, marginBottom: 16 },
  crashTitle: { fontSize: 20, fontWeight: "800", color: "#FFD700", textAlign: "center", marginBottom: 12 },
  crashMsg: { fontSize: 14, color: "#C8E6C9", textAlign: "center", lineHeight: 22 },
});
