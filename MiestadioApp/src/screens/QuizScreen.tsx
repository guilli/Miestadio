import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stadiums as allStadiums } from '../data/stadiums';
import { Stadium } from '../types';

// ── Configuración del quiz ────────────────────────────────────────────────
const TOTAL_QUESTIONS = 10;

// ── Helpers ───────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Question {
  stadium: Stadium;
  options: string[]; // todos los teamName de la división, barajados
  correctAnswer: string;
}

// Construye preguntas con TODOS los equipos de la división como opciones
function buildQuestions(division: 'Primera' | 'Segunda' | 'Ambas'): Question[] {
  const pool = allStadiums.filter(
    s => division === 'Ambas' || s.division === division,
  );

  if (pool.length < 2) return [];

  const selected = shuffle(pool).slice(0, TOTAL_QUESTIONS);

  return selected.map(stadium => {
    // Opciones = todos los demás equipos del pool + el correcto, barajados
    const options = shuffle(pool.map(s => s.teamName));
    return {
      stadium,
      options,
      correctAnswer: stadium.teamName,
    };
  });
}

type GameState = 'config' | 'playing' | 'finished';
type DivisionFilter = 'Primera' | 'Segunda' | 'Ambas';

// ── Hook de sonido (sin implementación nativa) ───────────────────────────
function useUnderwaterSound() {
  const play = useCallback(async () => {
    // Sonido eliminado: expo-av removido del proyecto
  }, []);

  return { play };
}

// ─────────────────────────────────────────────────────────────────────────
const QuizScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { play: playSound } = useUnderwaterSound();

  // ── Estado general ────────────────────────────────────────────────────
  const [gameState, setGameState] = useState<GameState>('config');
  const [division, setDivision] = useState<DivisionFilter>('Ambas');

  // ── Estado partida ────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<{ stadium: string; correct: string; chosen: string }[]>([]);

  // ── Pregunta actual ───────────────────────────────────────────────────
  const currentQuestion = useMemo(
    () => (questions.length > 0 ? questions[currentIndex] : null),
    [questions, currentIndex],
  );

  // ── Iniciar nueva partida ─────────────────────────────────────────────
  const startGame = useCallback(() => {
    const qs = buildQuestions(division);
    if (qs.length === 0) {
      Alert.alert('No hay datos', 'No hay suficientes estadios para el filtro seleccionado.');
      return;
    }
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setAnswered(false);
    setWrongAnswers([]);
    setGameState('playing');
  }, [division]);

  // ── Seleccionar respuesta ─────────────────────────────────────────────
  const handleOption = useCallback(async (option: string) => {
    if (answered || !currentQuestion) return;

    // Sonido "bajo el agua" al tocar
    await playSound();

    setSelectedOption(option);
    setAnswered(true);
    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [
        ...prev,
        {
          stadium: currentQuestion.stadium.name,
          correct: currentQuestion.correctAnswer,
          chosen: option,
        },
      ]);
    }
  }, [answered, currentQuestion, playSound]);

  // ── Siguiente pregunta ────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setGameState('finished');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  }, [currentIndex, questions.length]);

  // ── Compartir por WhatsApp ────────────────────────────────────────────
  const shareOnWhatsApp = useCallback(async () => {
    const divLabel = division === 'Ambas' ? '1ª y 2ª División' : `${division} División`;
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);

    let emoji = '😕';
    if (pct >= 90) emoji = '🏆';
    else if (pct >= 70) emoji = '⭐';
    else if (pct >= 50) emoji = '👍';

    const text =
      `🏟️ MiEstadio – Quiz de Campos\n` +
      `${emoji} He acertado ${score}/${TOTAL_QUESTIONS} campos (${pct}%) en la categoría: ${divLabel}\n\n` +
      `¿Puedes superarme? ¡Descarga MiEstadio y pruébalo!`;

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const canOpen = await Linking.canOpenURL(whatsappUrl);

    if (canOpen) {
      Linking.openURL(whatsappUrl);
    } else {
      Share.share({ message: text });
    }
  }, [score, division]);

  // ── Estilo del botón de opción ────────────────────────────────────────
  function optionBtnStyle(option: string) {
    if (!answered) return styles.optionBtn;
    if (option === currentQuestion?.correctAnswer) return [styles.optionBtn, styles.optionCorrect];
    if (option === selectedOption) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionDisabled];
  }

  function optionTextStyle(option: string) {
    if (!answered) return styles.optionText;
    if (option === currentQuestion?.correctAnswer) return [styles.optionText, styles.optionTextCorrect];
    if (option === selectedOption) return [styles.optionText, styles.optionTextWrong];
    return [styles.optionText, styles.optionTextDisabled];
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER PANTALLA DE CONFIGURACIÓN
  // ─────────────────────────────────────────────────────────────────────
  if (gameState === 'config') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🧠 Quiz de Campos</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.configContent}>
          <Text style={styles.configEmoji}>🏟️</Text>
          <Text style={styles.configTitle}>¿Cuánto sabes de los campos de fútbol?</Text>
          <Text style={styles.configDesc}>
            Te mostraremos el nombre del estadio y tendrás que adivinar a qué equipo pertenece.
            {'\n\n'}
            Son {TOTAL_QUESTIONS} preguntas con todos los equipos de la división como opciones.
          </Text>

          <Text style={styles.sectionLabel}>Categoría</Text>
          <View style={styles.divisionSelector}>
            {(['Primera', 'Segunda', 'Ambas'] as DivisionFilter[]).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.divBtn, division === d && styles.divBtnActive]}
                onPress={() => setDivision(d)}
              >
                <Text style={[styles.divBtnText, division === d && styles.divBtnTextActive]}>
                  {d === 'Ambas' ? '1ª + 2ª' : `${d === 'Primera' ? '1ª' : '2ª'} Div`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <Text style={styles.startBtnText}>¡Empezar!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER PARTIDA
  // ─────────────────────────────────────────────────────────────────────
  if (gameState === 'playing' && currentQuestion) {
    const progress = currentIndex / TOTAL_QUESTIONS;

    // Dividir opciones en dos columnas
    const half = Math.ceil(currentQuestion.options.length / 2);
    const col1 = currentQuestion.options.slice(0, half);
    const col2 = currentQuestion.options.slice(half);

    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => {
            Alert.alert('Abandonar partida', '¿Seguro que quieres salir? Se perderá el progreso.', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Salir', style: 'destructive', onPress: () => setGameState('config') },
            ]);
          }}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🧠 Quiz</Text>
          <Text style={styles.scoreHeader}>{score} ✓</Text>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{currentIndex + 1} / {TOTAL_QUESTIONS}</Text>

        <ScrollView contentContainerStyle={styles.playContent}>
          {/* Pregunta */}
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>¿A qué equipo pertenece este estadio?</Text>
            <Text style={styles.stadiumName}>{currentQuestion.stadium.name}</Text>
            <Text style={styles.stadiumCity}>
              📍 {currentQuestion.stadium.city} · {currentQuestion.stadium.division === 'Primera' ? '1ª' : '2ª'} División
            </Text>
          </View>

          {/* Opciones en 2 columnas */}
          <View style={styles.optionsGrid}>
            {/* Columna izquierda */}
            <View style={styles.optionsCol}>
              {col1.map(option => (
                <TouchableOpacity
                  key={option}
                  style={optionBtnStyle(option)}
                  onPress={() => handleOption(option)}
                  disabled={answered}
                  activeOpacity={0.75}
                >
                  {answered && option === currentQuestion.correctAnswer && (
                    <Text style={styles.optionIcon}>✅</Text>
                  )}
                  {answered && option === selectedOption && option !== currentQuestion.correctAnswer && (
                    <Text style={styles.optionIcon}>❌</Text>
                  )}
                  <Text style={optionTextStyle(option)} numberOfLines={2}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Columna derecha */}
            <View style={styles.optionsCol}>
              {col2.map(option => (
                <TouchableOpacity
                  key={option}
                  style={optionBtnStyle(option)}
                  onPress={() => handleOption(option)}
                  disabled={answered}
                  activeOpacity={0.75}
                >
                  {answered && option === currentQuestion.correctAnswer && (
                    <Text style={styles.optionIcon}>✅</Text>
                  )}
                  {answered && option === selectedOption && option !== currentQuestion.correctAnswer && (
                    <Text style={styles.optionIcon}>❌</Text>
                  )}
                  <Text style={optionTextStyle(option)} numberOfLines={2}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Feedback + botón siguiente */}
          {answered && (
            <View style={styles.feedbackArea}>
              <Text style={styles.feedbackText}>
                {selectedOption === currentQuestion.correctAnswer
                  ? '¡Correcto! 🎉'
                  : `Incorrecto. Era: ${currentQuestion.correctAnswer}`}
              </Text>
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>
                  {currentIndex + 1 >= TOTAL_QUESTIONS ? 'Ver resultados' : 'Siguiente →'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER RESULTADOS
  // ─────────────────────────────────────────────────────────────────────
  const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
  let resultEmoji = '😕';
  let resultMsg = 'Sigue practicando';
  if (pct >= 90) { resultEmoji = '🏆'; resultMsg = '¡Eres un experto!'; }
  else if (pct >= 70) { resultEmoji = '⭐'; resultMsg = '¡Muy bien!'; }
  else if (pct >= 50) { resultEmoji = '👍'; resultMsg = 'No está mal'; }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setGameState('config')}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🧠 Resultados</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={[styles.resultsContent, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.resultEmoji}>{resultEmoji}</Text>
        <Text style={styles.resultMsg}>{resultMsg}</Text>
        <Text style={styles.resultScore}>{score} / {TOTAL_QUESTIONS}</Text>
        <Text style={styles.resultPct}>{pct}% de aciertos</Text>

        {/* Fallos */}
        {wrongAnswers.length > 0 && (
          <View style={styles.wrongList}>
            <Text style={styles.wrongTitle}>❌ Respuestas incorrectas</Text>
            {wrongAnswers.map((w, i) => (
              <View key={i} style={styles.wrongItem}>
                <Text style={styles.wrongStadium}>{w.stadium}</Text>
                <Text style={styles.wrongCorrect}>✅ {w.correct}</Text>
                <Text style={styles.wrongChosen}>❌ {w.chosen}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Botones */}
        <TouchableOpacity style={styles.whatsappBtn} onPress={shareOnWhatsApp}>
          <Text style={styles.whatsappBtnText}>📲 Compartir en WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retryBtn} onPress={startGame}>
          <Text style={styles.retryBtnText}>🔄 Jugar de nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.homeBtnText}>🏠 Volver al inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────
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
  scoreHeader: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },

  // ── Config
  configContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  configEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2744',
    textAlign: 'center',
    marginBottom: 12,
  },
  configDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
    alignSelf: 'flex-start',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  divisionSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 36,
  },
  divBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    backgroundColor: '#fff',
  },
  divBtnActive: {
    backgroundColor: '#2E7D32',
  },
  divBtnText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 13,
  },
  divBtnTextActive: {
    color: '#fff',
  },
  startBtn: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Progress
  progressBar: {
    height: 6,
    backgroundColor: '#C8E6C9',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#2E7D32',
  },
  progressLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    paddingTop: 4,
  },

  // ── Playing
  playContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: '#1A2744',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C9A84C',
    alignItems: 'center',
  },
  questionLabel: {
    color: '#8A9BBE',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  stadiumName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 24,
  },
  stadiumCity: {
    color: '#A5D6A7',
    fontSize: 12,
  },

  // ── Grid de opciones
  optionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  optionsCol: {
    flex: 1,
    gap: 6,
  },
  optionBtn: {
    backgroundColor: '#fff',
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  optionWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
  },
  optionDisabled: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEE',
  },
  optionText: {
    fontSize: 12,
    color: '#1A1A2E',
    fontWeight: '600',
    textAlign: 'center',
  },
  optionTextCorrect: {
    color: '#1B5E20',
  },
  optionTextWrong: {
    color: '#B71C1C',
  },
  optionTextDisabled: {
    color: '#BBB',
  },
  optionIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  feedbackArea: {
    alignItems: 'center',
    marginTop: 14,
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2744',
    marginBottom: 12,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Results
  resultsContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  resultMsg: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2744',
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '900',
    color: '#2E7D32',
    lineHeight: 56,
  },
  resultPct: {
    fontSize: 16,
    color: '#888',
    marginBottom: 28,
  },
  wrongList: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  wrongTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B71C1C',
    marginBottom: 12,
  },
  wrongItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  wrongStadium: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  wrongCorrect: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 1,
  },
  wrongChosen: {
    fontSize: 12,
    color: '#C62828',
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  whatsappBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  retryBtn: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  homeBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    width: '100%',
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default QuizScreen;
