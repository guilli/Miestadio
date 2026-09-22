import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import es from "./locales/es";
import ca from "./locales/ca";
import fr from "./locales/fr";
import de from "./locales/de";
import en from "./locales/en";

export type AppLanguage = "es" | "ca" | "fr" | "de" | "en";

export const SUPPORTED_LANGUAGES: AppLanguage[] = ["es", "ca", "fr", "de", "en"];

const STORAGE_KEY = "@mystadium/language";

function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as string[]).includes(value);
}

export function detectDeviceLanguage(): AppLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? "";
    const lang = locale.toLowerCase();
    if (lang.startsWith("ca")) return "ca";
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("en")) return "en";
    return "es";
  } catch {
    return "es";
  }
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    ca: { translation: ca },
    fr: { translation: fr },
    de: { translation: de },
    en: { translation: en },
  },
  lng: detectDeviceLanguage(),
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function getAppLanguage(): AppLanguage {
  const current = i18n.language;
  if (isAppLanguage(current)) return current;
  const base = (current ?? "").split("-")[0].toLowerCase();
  if (isAppLanguage(base)) return base;
  return "es";
}

/** Aplica la preferencia guardada por el usuario (si existe). */
export async function applyLanguagePreference(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (isAppLanguage(stored) && stored !== i18n.language) {
      await i18n.changeLanguage(stored);
    }
  } catch {
    // Se ignora: si falla la lectura se mantiene el idioma detectado
  }
}

/** Guarda la selección manual del usuario y cambia el idioma al instante. */
export async function setAppLanguage(code: AppLanguage): Promise<void> {
  await i18n.changeLanguage(code);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, code);
  } catch {
    // El cambio de idioma ya es efectivo aunque falle el guardado
  }
}

export default i18n;