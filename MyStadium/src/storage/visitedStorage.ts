import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@mystadium/visited_stadiums";

export async function loadVisited(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export async function saveVisited(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // La app sigue funcionando en memoria si falla el guardado
  }
}
