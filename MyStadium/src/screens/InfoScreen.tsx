import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FEATURES = [
  { icon: '🧭', title: 'Brújula al estadio', desc: 'Selecciona un equipo y la brújula apuntará en tiempo real hacia su estadio, mostrando rumbo y distancia desde tu posición.' },
  { icon: '📋', title: 'Ficha del estadio', desc: 'Consulta nombre, equipo, ciudad, liga, aforo y año de inauguración de cada estadio.' },
  { icon: '🧠', title: 'Quiz de campos', desc: 'Pon a prueba tus conocimientos: se muestra el estadio y debes elegir el equipo correcto.' },
  { icon: '📲', title: 'Compartir resultados', desc: 'Al terminar el quiz puedes compartir tu puntuación por cualquier app de mensajería.' },
];

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}><Text style={styles.headerTitle}>ℹ️ Información</Text></View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🏟</Text>
          <Text style={styles.heroTitle}>MyStadium</Text>
          <Text style={styles.heroVersion}>Versión 1.0</Text>
          <Text style={styles.heroTagline}>La app para los amantes del fútbol español.{'\n'}Localiza estadios, aprende y compite con amigos.</Text>
        </View>

        <Text style={styles.sectionTitle}>¿Qué hace MyStadium?</Text>
        {FEATURES.map(f => (
          <View key={f.title} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Cómo funciona la brújula</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>Usa el GPS del móvil para conocer tu posición y el magnetómetro para detectar hacia dónde apuntas. Con ambos datos calcula el rumbo exacto hasta el estadio elegido.{'\n\n'}Necesita permiso de ubicación para funcionar.</Text>
        </View>

        <Text style={styles.sectionTitle}>Estadios cubiertos</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>MyStadium incluye los estadios de los 20 equipos de Primera División y los 19 de Segunda División de la temporada 2025-26 del fútbol español.</Text>
        </View>

        <Text style={styles.sectionTitle}>Partners</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>Xavi Solé · Guillem Polinyà</Text>
        </View>

        <Text style={styles.footer}>© 2025 MyStadium · Hecho con ❤️ para el fútbol</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F4F0' },
  header: { backgroundColor: '#1B5E20', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { padding: 20 },
  hero: { alignItems: 'center', backgroundColor: '#1B5E20', borderRadius: 20, paddingVertical: 32, paddingHorizontal: 20, marginBottom: 28 },
  heroIcon: { fontSize: 64, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  heroVersion: { fontSize: 12, color: '#A5D6A7', marginTop: 2, marginBottom: 12 },
  heroTagline: { fontSize: 14, color: '#C8E6C9', textAlign: 'center', lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#1B5E20', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  featureCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, gap: 14, elevation: 2 },
  featureIcon: { fontSize: 28, marginTop: 2 },
  featureTexts: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  featureDesc: { fontSize: 13, color: '#666', lineHeight: 20 },
  infoBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#2E7D32' },
  infoBoxText: { fontSize: 14, color: '#444', lineHeight: 22 },
  footer: { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 8 },
});
