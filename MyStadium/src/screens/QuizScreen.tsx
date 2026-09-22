import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share, Linking } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { stadiums as allStadiums } from "../data/stadiums";
import { Stadium, Division } from "../types";

type DivFilter = Division | "todas";

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
  options: string[]; 
  correct: string; 
}

const TOTAL = 20;

function buildQuestions(div: DivFilter): Question[] {
  const filtered = div === "todas" ? allStadiums : allStadiums.filter(s => s.division === div);
  const selected = shuffle(filtered).slice(0, TOTAL);
  
  return selected.map(stadium => {
    const others = filtered.filter(s => s.teamName !== stadium.teamName);
    const wrongOpts = shuffle(others).slice(0, 3).map(s => s.teamName);
    const options = shuffle([stadium.teamName, ...wrongOpts]);
    
    return {
      stadium,
      options,
      correct: stadium.teamName
    };
  });
}

interface Wrong {
  stadium: string;
  correct: string;
  chosen: string;
}

export default function QuizScreen(): React.JSX.Element | null {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<"setup" | "playing" | "finished">("setup");
  const [division, setDivision] = useState<DivFilter>("Primera");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>("__none__");
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongs, setWrongs] = useState<Wrong[]>([]);

  const current = questions[index];

  const handleStart = useCallback(() => {
    const qs = buildQuestions(division);
    setQuestions(qs);
    setGameState("playing");
    setIndex(0);
    setSelected("__none__");
    setAnswered(false);
    setScore(0);
    setWrongs([]);
  }, [division]);

  const handleAnswer = useCallback(() => {
    if (selected === "__none__") return;
    setAnswered(true);
    
    if (selected === current.correct) {
      setScore(prev => prev + 1);
    } else {
      setWrongs(prev => [...prev, { 
        stadium: current.stadium.name, 
        correct: current.correct, 
        chosen: selected 
      }]);
    }
  }, [selected, current]);

  const handleNext = useCallback(() => {
    if (index + 1 >= TOTAL) {
      setGameState("finished");
    } else {
      setIndex(prev => prev + 1);
      setSelected("__none__");
      setAnswered(false);
    }
  }, [index]);

  const handleReset = useCallback(() => {
    setGameState("setup");
    setQuestions([]);
    setIndex(0);
    setSelected("__none__");
    setAnswered(false);
    setScore(0);
    setWrongs([]);
  }, []);

  const handleShare = useCallback(() => {
    const msg = `${t("quiz.shareTitle", { score, total: TOTAL })}\n\n${wrongs.length > 0 ? `${t("quiz.shareErrors")}\n${wrongs.map(w => t("quiz.shareWrongLine", { stadium: w.stadium, chosen: w.chosen, correct: w.correct })).join("\n")}` : t("quiz.sharePerfect")}`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.openURL(whatsappUrl).catch(() => Share.share({ message: msg }));
  }, [score, wrongs, t]);

  if (gameState === "setup") {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={[styles.setupContent, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.setupCard}>
            <Text style={styles.setupTitle}>{t("quiz.setupTitle")}</Text>
            <Text style={styles.setupDesc}>
              {t("quiz.setupDesc", { count: TOTAL })}
            </Text>
            
            <Text style={styles.divLabel}>{t("quiz.division")}</Text>
            <View style={styles.pickerWrap}>
              <Picker 
                selectedValue={division} 
                onValueChange={v => setDivision(v as DivFilter)} 
                style={styles.picker}
                dropdownIconColor="#2E7D32"
              >
                <Picker.Item label={t("quiz.divisionOptions.primera")} value="Primera" style={styles.pickerItem} />
                <Picker.Item label={t("quiz.divisionOptions.segunda")} value="Segunda" style={styles.pickerItem} />
                <Picker.Item label={t("quiz.divisionOptions.all")} value="todas" style={styles.pickerItem} />
              </Picker>
            </View>
            
            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
              <Text style={styles.startTxt}>{t("quiz.start")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (gameState === "playing" && current) {
    const pickerBorderColor = !answered ? "#C8E6C9" : selected === current.correct ? "#2E7D32" : "#C62828";
    
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.exitBtn} 
            onPress={() => Alert.alert(
              t("quiz.abandon"), 
              t("quiz.abandonMsg"), 
              [
                { text: t("quiz.cancel"), style: "cancel" }, 
                { text: t("quiz.exit"), style: "destructive", onPress: () => handleReset() }
              ]
            )}
          >
            <Text style={styles.exitTxt}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("quiz.questionNum", { current: index + 1, total: TOTAL })}</Text>
          <Text style={styles.scoreTxt}>{score} ✓</Text>
        </View>
        
        <View style={styles.progBar}>
          <View style={[styles.progFill, { width: `${(index / TOTAL) * 100}%` }]} />
        </View>
        <Text style={styles.progLabel}>{index + 1} / {TOTAL}</Text>
        
        <ScrollView contentContainerStyle={[styles.playContent, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.questionCard}>
            <Text style={styles.questionTitle}>{t("quiz.questionTitle")}</Text>
            <Text style={styles.stadiumName}>{current.stadium.name}</Text>
            <Text style={styles.stadiumInfo}>
              {t("quiz.spectators", { count: current.stadium.capacity.toLocaleString() })}
            </Text>
          </View>

          <View style={styles.answerBox}>
            <Text style={styles.answerBoxLabel}>{t("quiz.yourAnswer")}</Text>
            <View style={styles.answerPickerWrap}>
              <Picker 
                selectedValue={selected} 
                onValueChange={v => !answered && setSelected(v as string)} 
                style={[styles.answerPicker, { borderColor: pickerBorderColor }]} 
                enabled={!answered} 
                dropdownIconColor="#2E7D32" 
                mode="dropdown"
              >
                <Picker.Item label={t("quiz.selectTeam")} value="__none__" color="#999" style={styles.pickerItem} />
                {current.options.map(opt => 
                  <Picker.Item key={opt} label={opt} value={opt} style={styles.pickerItem} />
                )}
              </Picker>
            </View>
          </View>
          
          {answered && (
            <View style={[styles.feedbackBox, selected === current.correct ? styles.feedbackOk : styles.feedbackKo]}>
              <Text style={styles.feedbackText}>
                {selected === current.correct ? t("quiz.correct") : t("quiz.wrongAnswer", { team: current.correct })}
              </Text>
            </View>
          )}
          
          {!answered ? (
            <TouchableOpacity 
              style={[styles.actionBtn, selected === "__none__" ? styles.actionBtnDisabled : styles.actionBtnEnabled]} 
              onPress={handleAnswer} 
              disabled={selected === "__none__"}
            >
              <Text style={styles.actionTxt}>{t("quiz.answer")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnEnabled]} onPress={handleNext}>
              <Text style={styles.actionTxt}>{index + 1 >= TOTAL ? t("quiz.seeResult") : t("quiz.next")}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  if (gameState === "finished") {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={[styles.finishedContent, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t("quiz.finishedTitle")}</Text>
            <Text style={styles.resultScore}>{score} / {TOTAL}</Text>
            <Text style={styles.resultPercent}>{t("quiz.percent", { percent: Math.round((score / TOTAL) * 100) })}</Text>
            
            {wrongs.length > 0 && (
              <>
                <Text style={styles.wrongsTitle}>{t("quiz.errors")}</Text>
                {wrongs.map((w, i) => (
                  <View key={i} style={styles.wrongItem}>
                    <Text style={styles.wrongStadium}>{w.stadium}</Text>
                    <Text style={styles.wrongDetail}>{t("quiz.chose", { team: w.chosen })}</Text>
                    <Text style={styles.wrongDetail}>{t("quiz.was", { team: w.correct })}</Text>
                  </View>
                ))}
              </>
            )}
            
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
                <Text style={styles.secondaryTxt}>{t("quiz.share")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleReset}>
                <Text style={styles.primaryTxt}>{t("quiz.newQuiz")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F1F8E9" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: "#2E7D32", 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84 
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  exitBtn: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: "rgba(255,255,255,0.2)", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  exitTxt: { fontSize: 16, color: "white", fontWeight: "bold" },
  scoreTxt: { fontSize: 16, fontWeight: "bold", color: "white" },
  
  setupContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 20 },
  setupCard: { 
    backgroundColor: "white", 
    padding: 24, 
    borderRadius: 12, 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84 
  },
  setupTitle: { fontSize: 24, fontWeight: "bold", color: "#2E7D32", textAlign: "center", marginBottom: 16 },
  setupDesc: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 24, lineHeight: 24 },
  divLabel: { fontSize: 16, fontWeight: "bold", color: "#2E7D32", marginBottom: 6 },
  pickerWrap: { 
    borderWidth: 0.5, 
    borderColor: "#C8E6C9", 
    borderRadius: 8, 
    marginBottom: 24, 
    backgroundColor: "#FAFAFA" 
  },
  picker: { height: 40 },
  startBtn: { 
    backgroundColor: "#2E7D32", 
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  startTxt: { fontSize: 18, fontWeight: "bold", color: "white" },
  
  progBar: { 
    height: 6, 
    backgroundColor: "#C8E6C9", 
    marginHorizontal: 20, 
    marginTop: 8, 
    borderRadius: 3 
  },
  progFill: { 
    height: "100%", 
    backgroundColor: "#2E7D32", 
    borderRadius: 3 
  },
  progLabel: { 
    fontSize: 14, 
    color: "#666", 
    textAlign: "center", 
    marginTop: 4, 
    marginBottom: 16 
  },
  
  playContent: { flexGrow: 1, paddingHorizontal: 20 },
  questionCard: { 
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 16, 
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  questionTitle: { fontSize: 18, fontWeight: "bold", color: "#2E7D32", marginBottom: 12 },
  stadiumName: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 8 },
  stadiumInfo: { fontSize: 14, color: "#666" },
  
  answerBox: { 
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 16, 
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  answerBoxLabel: { fontSize: 16, fontWeight: "bold", color: "#2E7D32", marginBottom: 12 },
  answerPickerWrap: { 
    borderWidth: 0.5, 
    borderRadius: 8, 
    backgroundColor: "#FAFAFA" 
  },
  answerPicker: { height: 40 },
  pickerItem: { fontSize: 15 },
  
  feedbackBox: { 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 16, 
    alignItems: "center" 
  },
  feedbackOk: { backgroundColor: "#C8E6C9" },
  feedbackKo: { backgroundColor: "#FFCDD2" },
  feedbackText: { fontSize: 16, fontWeight: "bold" },
  
  actionBtn: { 
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 8 
  },
  actionBtnEnabled: { backgroundColor: "#2E7D32" },
  actionBtnDisabled: { backgroundColor: "#C8E6C9" },
  actionTxt: { fontSize: 18, fontWeight: "bold", color: "white" },
  
  finishedContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 20 },
  resultCard: { 
    backgroundColor: "white", 
    padding: 24, 
    borderRadius: 12, 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84 
  },
  resultTitle: { fontSize: 24, fontWeight: "bold", color: "#2E7D32", textAlign: "center", marginBottom: 16 },
  resultScore: { fontSize: 36, fontWeight: "bold", color: "#2E7D32", textAlign: "center" },
  resultPercent: { fontSize: 18, color: "#666", textAlign: "center", marginBottom: 24 },
  wrongsTitle: { fontSize: 18, fontWeight: "bold", color: "#C62828", marginBottom: 12 },
  wrongItem: { 
    backgroundColor: "#FFEBEE", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 8, 
    borderLeftWidth: 4, 
    borderLeftColor: "#C62828" 
  },
  wrongStadium: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  wrongDetail: { fontSize: 14, color: "#666" },
  
  actionsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 24 
  },
  primaryBtn: { 
    backgroundColor: "#2E7D32", 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8, 
    flex: 1, 
    marginLeft: 8, 
    alignItems: "center" 
  },
  primaryTxt: { fontSize: 16, fontWeight: "bold", color: "white" },
  secondaryBtn: { 
    borderWidth: 2, 
    borderColor: "#2E7D32", 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8, 
    flex: 1, 
    marginRight: 8, 
    alignItems: "center" 
  },
  secondaryTxt: { fontSize: 16, fontWeight: "bold", color: "#2E7D32" }
});