import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ℹ️ Información</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        {/* Logo / icono app */}
        <View style={styles.appIconWrapper}>
          <Text style={styles.appIcon}>🏟️</Text>
        </View>
        <Text style={styles.appName}>MiEstadio</Text>
        <Text style={styles.appTagline}>Campos de fútbol de España</Text>

        <View style={styles.divider} />

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué es MiEstadio?</Text>
          <Text style={styles.sectionText}>
            MiEstadio te permite localizar los estadios de fútbol de la Primera y Segunda División española.
            Muestra la dirección y distancia desde tu ubicación actual mediante una brújula en tiempo real,
            así como los datos principales del estadio.
          </Text>
          <Text style={styles.sectionText}>
            Incluye un quiz para poner a prueba tus conocimientos sobre los campos de fútbol españoles.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Créditos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💻 Desarrollado por</Text>

          <View style={styles.devCard}>
            <Text style={styles.devAvatar}>🧑‍💻</Text>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Xavier Solé</Text>
              <Text style={styles.devRole}>Desarrollo & diseño</Text>
              <Text style={styles.devAssociate}>Associate</Text>
            </View>
          </View>

          <View style={styles.devCard}>
            <Text style={styles.devAvatar}>👨‍💻</Text>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Guillem Polinyà</Text>
              <Text style={styles.devRole}>Desarrollo & diseño</Text>
              <Text style={styles.devAssociate}>Associate</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tecnología */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Tecnología</Text>
          <View style={styles.techRow}>
            <Text style={styles.techBadge}>React Native</Text>
            <Text style={styles.techBadge}>TypeScript</Text>
            <Text style={styles.techBadge}>GPS</Text>
            <Text style={styles.techBadge}>Magnetómetro</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Datos</Text>
          <Text style={styles.sectionText}>
            La aplicación incluye los 20 equipos de Primera División y 20 de Segunda División
            de la temporada 2025-26, con sus estadios, aforos y coordenadas.
          </Text>
          <Text style={styles.sectionText}>
            Los datos de ubicación se obtienen del GPS del dispositivo y nunca se envían a ningún servidor.
            La aplicación funciona completamente sin conexión a internet.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Pie */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Xavier Solé & Guillem Polinyà</Text>
          <Text style={styles.footerVersion}>Versión 1.0.0</Text>
          <Text style={styles.footerText}>Hecho con ❤️ en España</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  appIconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  appIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A2744',
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2744',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
  },
  devCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  devAvatar: {
    fontSize: 36,
    marginRight: 14,
  },
  devInfo: {
    flex: 1,
  },
  devName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A2744',
  },
  devRole: {
    fontSize: 13,
    color: '#2E7D32',
    marginTop: 2,
  },
  devAssociate: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: '#E8F5E9',
    color: '#1B5E20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#BBB',
    marginBottom: 4,
  },
});

export default InfoScreen;
