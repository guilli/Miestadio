import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stadiums as allStadiums } from '../data/stadiums';
import { Stadium } from '../types';

const TOTAL = 10;
type DivFilter = 'Primera' | 'Segunda' | 'Ambas';
type GameState = 'config' | 'playing' | 'finished';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Question { stadium: Stadium; options: string[]; correct: string; }
interface WrongAnswer { stadium: string; correct: string; chosen: string; }

function buildQuestions(div: DivFilter): Question[] {
  const pool = allStadiums.filter(s => div === 'Ambas' || s.division === div);
  if (pool.length < 2) { return []; }
  return shuffle(pool).slice(0, TOTAL).map(s => ({
    stadium: s,
    options: shuffle(pool.map(p => p.teamName)),
    correct: s.teamName,
  }));
}

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const [gameState, setGameState] = useState<GameState>('config');
  const [division, setDivision] = useState<DivFilter>('Ambas');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('__none__');
  const [answered, setAnswered] = useState(false);
  const [wrongs, setWrongs] = useState<WrongAnswer[]>([]);

  const current = questions[index] ?? null;

  const start = useCallback(() => {
    const qs = buildQuestions(division);
    if (!qs.length) { Alert.alert('Sin datos', 'No hay suficientes estadios.'); return; }
    setQuestions(qs); setIndex(0); setScore(0);
    setSelected('__none__'); setAnswered(false); setWrongs([]);
    setGameState('playing');
  }, [division]);

  const confirm = useCallback(() => {
    if (!current || selected === '__none__') { return; }
    setAnswered(true);
    if (selected === current.correct) {
      setScore(prev => prev + 1);
    } else {
      setWrongs(prev => [...prev, { stadium: current.stadium.name, correct: current.correct, chosen: selected }]);
    }
  }, [current, selected]);

  const next = useCallback(() => {
    if (index + 1 >= questions.length) { setGameState('finished'); }
    else { setIndex(i => i + 1); setSelected('__none__'); setAnswered(false); }
  }, [index, questions.length]);

  const share = useCallback(async () => {
    const pct = Math.round((score / TOTAL) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '👍' : '😕';
    const divLabel = division === 'Ambas' ? '1ª y 2ª División' : `${division} División`;
    await Share.share({ message: `🏟 MyStadium – Quiz de Campos\n${emoji} He acertado ${score}/${TOTAL} campos (${pct}%) en ${divLabel}\n\n¿Puedes superarme?` });
  }, [score, division]);

  if (gameState === 'config') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}><Text style={styles.headerTitle}>🧠 Quiz de Campos</Text></View>
        <ScrollView contentContainerStyle={styles.configContent}>
          <Text style={styles.bigEmoji}>🏟</Text>
          <Text style={styles.configTitle}>¿Conoces todos los campos?</Text>
          <Text style={styles.configDesc}>Te mostramos el nombre del estadio y tienes que elegir a qué equipo pertenece.{'\n\n'}{TOTAL} preguntas por partida.</Text>
          <Text style={styles.sectionLabel}>Categoría</Text>
          <View style={styles.divBtns}>
            {(['Primera', 'Segunda', 'Ambas'] as DivFilter[]).map(d => (
              <TouchableOpacity key={d} style={[styles.divBtn, division === d && styles.divBtnActive]} onPress={() => setDivision(d)}>
                <Text style={[styles.divBtnText, division === d && styles.divBtnTextActive]}>{d === 'Primera' ? '1ª Div' : d === 'Segunda' ? '2ª Div' : '1ª + 2ª'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={start}>
            <Text style={styles.startBtnText}>¡Empezar!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (gameState === 'playing' && current) {
    const pickerBorderColor = !answered ? '#C8E6C9' : selected === current.correct ? '#2E7D32' : '#C62828';
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.exitBtn} onPress={() => Alert.alert('Abandonar', '¿Seguro? Se perderá el progreso.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Salir', style: 'destructive', onPress: () => setGameState('config') }])}>
            <Text style={styles.exitTxt}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🧠 Quiz</Text>
          <Text style={styles.scoreTxt}>{score} ✓</Text>
        </View>
        <View style={styles.progBar}><View style={[styles.progFill, { width: `${(index / TOTAL) * 100}%` }]} /></View>
        <Text style={styles.progLabel}>{index + 1} / {TOTAL}</Text>
        <ScrollView contentContainerStyle={[styles.playContent, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.questionCard}>
            <Text style={styles.questionMeta}>{current.stadium.division === 'Primera' ? '🥇 Primera División' : '🥈 Segunda División'} · {current.stadium.city}</Text>
            <Text style={styles.questionLabel}>¿A qué equipo pertenece?</Text>
            <Text style={styles.stadiumName}>{current.stadium.name}</Text>
          </View>
          <View style={[styles.answerBox, { borderColor: pickerBorderColor }]}>
            <Text style={styles.answerBoxLabel}>Tu respuesta</Text>
            <View style={styles.answerPickerWrap}>
              <Picker selectedValue={selected} onValueChange={v => !answered && setSelected(v as string)} style={styles.answerPicker} enabled={!answered} dropdownIconColor="#2E7D32" mode="dropdown">
                <Picker.Item label="— Selecciona el equipo —" value="__none__" color="#999" />
                {current.options.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
              </Picker>
            </View>
          </View>
          {answered && (
            <View style={[styles.feedbackBox, selected === current.correct ? styles.feedbackOk : styles.feedbackKo]}>
              <Text style={styles.feedbackText}>{selected === current.correct ? '✅ ¡Correcto!' : `❌ Era: ${current.correct}`}</Text>
            </View>
          )}
          {!answered ? (
            <TouchableOpacity style={[styles.confirmBtn, selected === '__none__' && styles.confirmBtnDisabled]} onPress={confirm} disabled={selected === '__none__'}>
              <Text style={styles.confirmBtnTxt}>Confirmar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={next}>
              <Text style={styles.nextBtnTxt}>{index + 1 >= TOTAL ? 'Ver resultados' : 'Siguiente →'}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  const pct = Math.round((score / TOTAL) * 100);
  const rEmoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '👍' : '😕';
  const rMsg = pct >= 90 ? '¡Eres un experto!' : pct >= 70 ? '¡Muy bien!' : pct >= 50 ? 'No está mal' : 'Sigue practicando';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}><Text style={styles.headerTitle}>🧠 Resultados</Text></View>
      <ScrollView contentContainerStyle={[styles.resultsContent, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.rEmoji}>{rEmoji}</Text>
        <Text style={styles.rMsg}>{rMsg}</Text>
        <Text style={styles.rScore}>{score} / {TOTAL}</Text>
        <Text style={styles.rPct}>{pct}% de aciertos</Text>
        {wrongs.length > 0 && (
          <View style={styles.wrongsBox}>
            <Text style={styles.wrongsTitle}>❌ Respuestas incorrectas</Text>
            {wrongs.map((w, i) => (
              <View key={i} style={styles.wrongItem}>
                <Text style={styles.wrongStadium}>🏟 {w.stadium}</Text>
                <Text style={styles.wrongCorrect}>✅ {w.correct}</Text>
                <Text style={styles.wrongChosen}>❌ {w.chosen}</Text>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.shareBtn} onPress={share}><Text style={styles.shareBtnTxt}>📲 Compartir resultado</Text></TouchableOpacity>
        <TouchableOpacity style={styles.retryBtn} onPress={start}><Text style={styles.retryBtnTxt}>🔄 Jugar de nuevo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.configBtn} onPress={() => setGameState('config')}><Text style={styles.configBtnTxt}>⚙️ Cambiar categoría</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F4F0' },
  header: { backgroundColor: '#1B5E20', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#fff' },
  exitBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  exitTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scoreTxt: { color: '#FFD700', fontSize: 16, fontWeight: '700', minWidth: 40, textAlign: 'right' },
  configContent: { alignItems: 'center', padding: 24 },
  bigEmoji: { fontSize: 72, marginBottom: 12 },
  configTitle: { fontSize: 20, fontWeight: '800', color: '#1A2744', textAlign: 'center', marginBottom: 10 },
  configDesc: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#444', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5, alignSelf: 'flex-start' },
  divBtns: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  divBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#2E7D32', backgroundColor: '#fff' },
  divBtnActive: { backgroundColor: '#2E7D32' },
  divBtnText: { color: '#2E7D32', fontWeight: '700', fontSize: 13 },
  divBtnTextActive: { color: '#fff' },
  startBtn: { backgroundColor: '#2E7D32', paddingHorizontal: 48, paddingVertical: 14, borderRadius: 28, elevation: 5 },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  progBar: { height: 6, backgroundColor: '#C8E6C9' },
  progFill: { height: 6, backgroundColor: '#2E7D32' },
  progLabel: { textAlign: 'center', fontSize: 12, color: '#888', paddingVertical: 4 },
  playContent: { padding: 16 },
  questionCard: { backgroundColor: '#1A2744', borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#C9A84C' },
  questionMeta: { color: '#8A9BBE', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  questionLabel: { color: '#A5D6A7', fontSize: 12, marginBottom: 8 },
  stadiumName: { color: '#FFD700', fontSize: 20, fontWeight: '800', textAlign: 'center', lineHeight: 26 },
  answerBox: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, padding: 12, marginBottom: 14 },
  answerBoxLabel: { fontSize: 11, color: '#888', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  answerPickerWrap: { borderRadius: 8, backgroundColor: '#F1F8E9', overflow: 'hidden' },
  answerPicker: { height: 48, color: '#1B5E20' },
  feedbackBox: { borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 14 },
  feedbackOk: { backgroundColor: '#E8F5E9' },
  feedbackKo: { backgroundColor: '#FFEBEE' },
  feedbackText: { fontSize: 15, fontWeight: '700', color: '#1A2744' },
  confirmBtn: { backgroundColor: '#1B5E20', borderRadius: 28, paddingVertical: 14, alignItems: 'center', elevation: 4 },
  confirmBtnDisabled: { backgroundColor: '#BDBDBD' },
  confirmBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  nextBtn: { backgroundColor: '#2E7D32', borderRadius: 28, paddingVertical: 14, alignItems: 'center', elevation: 4 },
  nextBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultsContent: { alignItems: 'center', padding: 24 },
  rEmoji: { fontSize: 80, marginBottom: 10 },
  rMsg: { fontSize: 24, fontWeight: '800', color: '#1A2744', marginBottom: 6 },
  rScore: { fontSize: 52, fontWeight: '900', color: '#2E7D32', lineHeight: 60 },
  rPct: { fontSize: 16, color: '#888', marginBottom: 24 },
  wrongsBox: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  wrongsTitle: { fontSize: 14, fontWeight: '700', color: '#B71C1C', marginBottom: 12 },
  wrongItem: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  wrongStadium: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  wrongCorrect: { fontSize: 12, color: '#2E7D32', marginBottom: 1 },
  wrongChosen: { fontSize: 12, color: '#C62828' },
  shareBtn: { backgroundColor: '#25D366', borderRadius: 28, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 12, width: '100%', alignItems: 'center', elevation: 4 },
  shareBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  retryBtn: { backgroundColor: '#1B5E20', borderRadius: 28, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 12, width: '100%', alignItems: 'center', elevation: 3 },
  retryBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  configBtn: { borderRadius: 28, paddingVertical: 14, paddingHorizontal: 32, borderWidth: 1.5, borderColor: '#2E7D32', width: '100%', alignItems: 'center' },
  configBtnTxt: { color: '#2E7D32', fontSize: 15, fontWeight: '600' },
});
