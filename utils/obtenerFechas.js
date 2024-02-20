"use strict";
exports.__esModule = true;
exports.obtenerFechas = void 0;
var obtenerFechas = function (tokenData) {
    // Get Dates
    var today = new Date();
    var horaInicio, horaFin;
    var options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Pacific/Galapagos"
    };
    if (tokenData) {
        horaInicio = new Date(tokenData.iat * 1000);
        // eslint-disable-next-line no-mixed-operators
        horaFin = new Date(tokenData.iat * 1000 + tokenData.token_duration * 1000);
    }
    else {
        horaInicio = today;
        horaFin = today;
    }
    var horaInicioStr = horaInicio
        .toLocaleString("en-ZA", options) // Timezone -6 & Turtles Rules!
        .slice(0, 20)
        .replace(",", "")
        .replace("/", "-");
    var horaFinStr = horaFin
        .toLocaleString("en-ZA", options) // Timezone -6 & Turtles Rules!
        .slice(0, 20)
        .replace(",", "")
        .replace("/", "-");
    return {
        horaInicio: horaInicioStr,
        horaFin: horaFinStr,
        today: today
    };
};
exports.obtenerFechas = obtenerFechas;
