import { jwtDecode } from "jwt-decode";

export const obtenerFechas = (userToken?: string) => {
  // Get Dates
  const today = new Date();

  let horaInicio, horaFin;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Pacific/Galapagos",
  };
  if (userToken) {
    const tokenData = jwtDecode(userToken as string) as any;
    horaInicio = new Date(tokenData.iat * 1000);
    // eslint-disable-next-line no-mixed-operators
    horaFin = new Date(tokenData.iat * 1000 + tokenData.token_duration * 1000);
  } else {
    horaInicio = today;
    horaFin = today;
  }

  const horaInicioStr = horaInicio
    .toLocaleString("en-ZA", options) // Timezone -6 & Turtles Rules!
    .slice(0, 20)
    .replace(",", "")
    .replace("/", "-");
  const horaFinStr = horaFin
    .toLocaleString("en-ZA", options) // Timezone -6 & Turtles Rules!
    .slice(0, 20)
    .replace(",", "")
    .replace("/", "-");
  return {
    horaInicio: horaInicioStr,
    horaFin: horaFinStr,
    today,
  };
};
