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
exports.registrar = void 0;
/* eslint-disable multiline-ternary */
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = require("crypto-js");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const BITACORA_TYPES = {
    1: "Lectura",
    2: "Actualización",
    3: "Creación",
    4: "Eliminación",
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
const obtenerSesionUsuario = (user, token, userDataToken, anonimo) => {
    let userSession = "";
    let userImpersonalizacion = "";
    // CASE 1: If token is provided, and is MCI login, (A temporary mark is added)
    if (token && userDataToken && !userDataToken.userDesk) {
        if (!userDataToken.token_generated_at) {
            throw new Error("No se ha podido obtener la fecha de generación del token");
        }
        userSession = userDataToken.nss + userDataToken.token_generated_at;
    }
    // CASE 2: If token is provided, and is IMPERSONALIZATION login, (It returns the token)
    else if (token && userDataToken && userDataToken.userDesk) {
        if (!userDataToken.token_generated_at) {
            throw new Error("No se ha podido obtener la fecha de generación del token");
        }
        userSession = userDataToken.userDesk + userDataToken.token_generated_at;
        userImpersonalizacion = userDataToken.userDesk;
    }
    // CASE 3: When token is not provided, (A temporary mark is added)
    else {
        if (!anonimo) {
            throw new Error("No se ha podido obtener el valor de anónimo");
        }
        userSession = user + anonimo + new Date().toISOString();
    }
    return {
        userSession,
        userImpersonalizacion,
    };
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
        .replace(/\//g, "-");
    const horaFinStr = horaFin
        .toLocaleString("en-ZA", options) // Timezone -6 & Turtles Rules!
        .slice(0, 20)
        .replace(",", "")
        .replace(/\//g, "-");
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
/*
 * @param type: 1 | 2 | 3 | 4 (1: Lectura, 2: Actualización, 3: Creación, 4: Eliminación)
 * @param input: IBitacoraMQ
 * @returns Promise<IBitacoraMQResponse>
 */
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
        if (Number.isNaN(Number(type)) || Number(type) < 1 || Number(type) > 4) {
            throw new Error("El tipo de bitácora es inválido");
        }
        // Get User Data Token
        const userDataToken = obtenerDatosToken(input.bitacoraBody.token);
        // Get User Session Identifier
        const { userSession, userImpersonalizacion } = obtenerSesionUsuario(input.bitacoraBody.nss, input.bitacoraBody.token, userDataToken, input.bitacoraBody.anonimo);
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
            // Identificador unico de la sesion, del usuario en el medio de contacto o canal [ID_SSSN]
            session: sessionHash,
            // Fecha en que se establece/finaliza la sesion [FH_INCO], [FH_FIN]
            fecha: dates.today.toISOString().slice(0, 10),
            // Hora inicio en la que se establecio la sesion [HR_INCO]
            hora_inicio: dates.horaInicio,
            // Hora fin de la sesion establecida [HR_FIN]
            hora_fin: dates.horaFin,
            // Canal en el que se establece la sesion de usuario (APP, MIC, etc) [ID_CNAL]
            canal: input.bitacoraBody.canal || "Z4",
            // Aplica para cuando el medio de contacto es mediante un Kiosco, como identificador [TX_KSCO]
            kiosco: input.bitacoraBody.kiosco || "false",
            // Origen que referencia la IP de donde esta conectandose el cliente [TX_ORGN]
            origen: input.bitacoraBody.IP,
            // Contacto o canal. Es llave foranea para el detalle de la sesion [ID_SSSN_DTLE]
            sesion_detalle: sessionHash,
            // Valor anterior a dicha actualizacion, en un formato JSON [TX_VANT]
            valor_anterior: input.bitacoraBody.valorAnterior || "",
            // Valor actualizado, en un formato JSON [TX_VNVO]
            valor_nuevo: input.bitacoraBody.valorNuevo || "",
            // Consulta, Error... etc [TX_RSLO]
            resultado: response,
            // Geolocalizacion por el cliente, en modo TXT [TX_GLCN]
            geolocalizacion: input.bitacoraBody.geolocalizacion || "",
            // Usuario que establece la sesion (Usuario Administrador, Derechohabiente(NSS) [ID_USRO]
            usuario: input.bitacoraBody.nss || "",
            // Usuario de suplantacion si es que este aplica [TX_USRO]
            usuario_txt: userImpersonalizacion || "",
            // Menus de navegacion en el  aplicativo MIC, APP, etc [TX_TRZA]
            traza: {
                IP: input.bitacoraBody.IP || "",
                idTipo: input.bitacoraBody.idTipo || "",
                tipoDesc: input.bitacoraBody.tipo || "",
                idEvento: input.bitacoraBody.idEvento || "",
                eventoDesc: input.bitacoraBody.evento || "",
                accion: BITACORA_TYPES[Number(type)] || "read",
                request: input.bitacoraBody.request || {},
                resultado: response,
                response: response,
                response_code: input.bitacoraBody.responseCode || "",
            },
        };
        (input === null || input === void 0 ? void 0 : input.onPrintPayload) && input.onPrintPayload(payload);
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
exports.default = exports.registrar;
