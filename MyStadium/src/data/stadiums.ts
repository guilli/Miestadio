import { Stadium } from "../types";
import { FUTBOL } from "./venues/futbol";
import { BALONCESTO } from "./venues/baloncesto";
import { NBA } from "./venues/nba";
import { RUGBY } from "./venues/rugby";
import { SUMO } from "./venues/sumo";
import { FUTBOLAMERICANO } from "./venues/futbolamericano";

/**
 * Todos los recintos de la app. Cada uno lleva `sportId` y `leagueId` para que
 * se pueda localizar desde cualquier deporte, no solo desde fútbol.
 */
export const stadiums: Stadium[] = [...FUTBOL, ...BALONCESTO, ...NBA, ...RUGBY, ...SUMO, ...FUTBOLAMERICANO];
