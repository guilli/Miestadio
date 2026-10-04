import { Stadium } from "../../types";

/**
 * Recintos de sumo. Cada basho se juega en un dojo distinto; los makuuchi
 * están adscritos a su heya (establos), que es donde entrenan.
 */
export const SUMO: Stadium[] = [
  // ─── TORNEOS · JAPÓN ──────────────────────────────────────────────────────
  { id: "ryogoku-kokugikan", name: "Ryōgoku Kokugikan", teamId: "hatsu-basho", teamName: "Hatsu Basho", city: "Tokio", country: "Japón", capacity: 12000, yearBuilt: 1985, sportId: "sumo", leagueId: "honbasho", latitude: 35.6955, longitude: 139.7930 },
  { id: "edion-arena-osaka", name: "Edion Arena Osaka", teamId: "haru-basho", teamName: "Haru Basho", city: "Osaka", country: "Japón", capacity: 16000, yearBuilt: 1995, sportId: "sumo", leagueId: "honbasho", latitude: 34.6860, longitude: 135.4800 },
  { id: "aichi-prefectural", name: "Aichi Prefectural Gymnasium", teamId: "natsu-basho", teamName: "Natsu Basho", city: "Nagoya", country: "Japón", capacity: 10000, yearBuilt: 1970, sportId: "sumo", leagueId: "honbasho", latitude: 35.1540, longitude: 136.9250 },
  { id: "fukuoka-kokusai-center", name: "Fukuoka Kokusai Center", teamId: "kyushu-basho", teamName: "Kyushu Basho", city: "Fukuoka", country: "Japón", capacity: 12000, yearBuilt: 1993, sportId: "sumo", leagueId: "honbasho", latitude: 33.5850, longitude: 130.4000 },
  // ─── MAKUUCHI · HEYA DE TOKIO ─────────────────────────────────────────────
  { id: "heya-terunofuji", name: "Izumouhi-gata heya", teamId: "terunofuji", teamName: "Terunofuji", city: "Musashino", country: "Japón", capacity: 150, yearBuilt: 1994, sportId: "sumo", leagueId: "makuuchi", latitude: 35.7180, longitude: 139.5640 },
  { id: "heya-onosato", name: "Ōnosato heya", teamId: "onosato", teamName: "Ōnosato", city: "Tokio", country: "Japón", capacity: 120, yearBuilt: 1994, sportId: "sumo", leagueId: "makuuchi", latitude: 35.6950, longitude: 139.7290 },
  { id: "heya-takakeisho", name: "Ise-gata heya", teamId: "takakeisho", teamName: "Takakeishō", city: "Tokio", country: "Japón", capacity: 150, yearBuilt: 1994, sportId: "sumo", leagueId: "makuuchi", latitude: 35.6930, longitude: 139.7380 },
  { id: "heya-hoshoryu", name: "Hōshōryū heya", teamId: "hoshoryu", teamName: "Hōshōryū", city: "Tokio", country: "Japón", capacity: 150, yearBuilt: 1993, sportId: "sumo", leagueId: "makuuchi", latitude: 35.6910, longitude: 139.7410 },
  { id: "heya-kirishima", name: "Kirishima heya", teamId: "kirishima", teamName: "Kirishima", city: "Tokio", country: "Japón", capacity: 130, yearBuilt: 1994, sportId: "sumo", leagueId: "makuuchi", latitude: 35.6890, longitude: 139.7440 },
  { id: "heya-midorifuji", name: "Ise-gata heya", teamId: "midorifuji", teamName: "Midorifuji", city: "Tokio", country: "Japón", capacity: 150, yearBuilt: 1994, sportId: "sumo", leagueId: "makuuchi", latitude: 35.6930, longitude: 139.7380 },
];
