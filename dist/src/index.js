"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitacora = exports.registrar = void 0;
/* eslint-disable multiline-ternary */
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = require("crypto-js");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const BITACORA_TYPES = {
    1: "read",
    2: "update",
    3: "instert",
    4: "delete",
};
const registrarBitacora = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.stringify(input.body);
        const config = {
            method: input.options.method,
            url: `${input.options.protocol}://${input.options.hostname}:${input.options.port}${input.options.path}`,
            headers: {
                "Content-Type": "application/json",
                KeyId: input.KeyId,
                Authorization: input.BearerToken,
            },
            data: data,
        };
        const response = yield axios_1.default.request(config);
        if (response && response.data) {
            return response.data;
        }
    }
    catch (error) {
        if (error.response) {
            throw new Error(`No se pudo registrar en bitácora ${error.response.status} ${error.response.statusText}`);
        }
        throw new Error(`No se pudo registrar en bitácora ${error.message}`);
    }
    throw new Error("No se pudo registrar en bitácora (response sin data)");
});
const obtenerTokenMQ = (input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!input.KeyId) {
            throw new Error("No se encontró el KeyId en los headers (obtenerTokenMQ)");
        }
        const data = JSON.stringify({
            usuario: input.Usuario,
            contrasena: input.Contrasena,
        });
        const config = {
            method: input.options.method,
            maxBodyLength: Infinity,
            url: `${input.options.protocol}://${input.options.hostname}:${input.options.port}${input.options.path}`,
            headers: {
                KeyId: input.KeyId,
                "Content-Type": "application/json",
            },
            data: data,
            timeout: input.options.timeout ? parseInt(input.options.timeout) : 10000,
        };
        const response = yield axios_1.default.request(config);
        if (response && ((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            return response.headers.authorization;
        }
    }
    catch (error) {
        if (error.response) {
            throw new Error(`No se obtuvo el token de autenticación: ${error.response.status} ${error.response.statusText}`);
        }
        throw new Error(`No se obtuvo el token de autenticación: ${error.message}`);
    }
    throw new Error("No se obtuvo el token de autenticación (response sin token)");
});
const obtenerSesionUsuario = (user, token, userDataToken) => {
    // CASE 1: If token is provided, and is MCI login, (A temporary mark is added)
    if (token && userDataToken && !userDataToken.userDesk) {
        return token;
    }
    // CASE 2: If token is provided, and is IMPERSONALIZATION login, (It returns the token)
    if (token && userDataToken && userDataToken.userDesk) {
        return token;
    }
    // CASE 3: When token is not provided, (A temporary mark is added)
    return user + new Date().toISOString();
};
const obtenerHash = (userSession) => {
    // Se agrega marca temporal
    const sesionHash = (0, crypto_js_1.SHA512)(userSession).toString();
    if (!sesionHash) {
        throw new Error("No se ha podido generar el hash de la sesion");
    }
    return sesionHash;
};
const obtenerFechas = (tokenData) => {
    // Get Dates
    const today = new Date();
    let horaInicio, horaFin;
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Pacific/Galapagos",
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
const obtenerDatosToken = (token) => {
    if (!token) {
        return null;
    }
    // Se transforma el token a un objeto
    const tokenData = (0, jwt_decode_1.default)(token);
    return tokenData;
};
const registrar = (type, input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Token
        const token = yield obtenerTokenMQ({
            KeyId: input.tokenOptions.keyId,
            Usuario: input.tokenOptions.usuario,
            Contrasena: input.tokenOptions.contrasena,
            options: input.tokenOptions,
        });
        if (!token) {
            throw new Error("No se pudo obtener el token de autenticación");
        }
        if (!input.bitacoraBody.nss) {
            throw new Error("El NSS es requerido");
        }
        // Get User Data Token
        const userDataToken = obtenerDatosToken(input.bitacoraBody.token);
        // Get User Session Identifier
        const userSession = obtenerSesionUsuario(input.bitacoraBody.nss, input.bitacoraBody.token, userDataToken);
        // Get Session Hash
        const sessionHash = obtenerHash(userSession);
        // Get Dates
        const dates = obtenerFechas(userDataToken);
        // Get Payload
        const origen = input.bitacoraBody.origen;
        const response = input.bitacoraBody.response;
        if (!origen || !response) {
            throw new Error("El origen y el response son requeridos");
        }
        const payload = {
            session: sessionHash,
            fecha: dates.today.toISOString().slice(0, 10),
            hora_inicio: dates.horaInicio,
            hora_fin: dates.horaFin,
            canal: "Z4",
            kiosco: "false",
            origen: origen,
            sesion_detalle: sessionHash,
            valor_anterior: input.bitacoraBody.valorAnterior || "",
            valor_nuevo: input.bitacoraBody.valorNuevo || "",
            resultado: response,
            geolocalizacion: input.bitacoraBody.geolocalizacion || "",
            usuario_txt: input.bitacoraBody.nss || "",
            usuario: input.bitacoraBody.nss || "",
            traza: {
                IP: input.bitacoraBody.IP || "",
                tipo: "servicio",
                accion: BITACORA_TYPES[type] || "read",
                resultado: response,
                request: input.bitacoraBody.request || {},
                response: response,
                response_code: input.bitacoraBody.responseCode || "",
            },
        };
        // Send to MQ
        const bitacoraResponse = yield registrarBitacora({
            KeyId: input.bitacoraOptions.keyId,
            BearerToken: `Bearer ${token}`,
            body: payload,
            options: input.bitacoraOptions,
        });
        return bitacoraResponse;
    }
    catch (error) {
        // Do something,
        if (input.onError) {
            input.onError(error);
        }
    }
});
exports.registrar = registrar;
exports.bitacora = {
    registrar: exports.registrar,
};
