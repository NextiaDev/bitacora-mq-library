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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrar = void 0;
/* eslint-disable multiline-ternary */
var axios_1 = __importDefault(require("axios"));
var crypto_js_1 = require("crypto-js");
var jwt_decode_1 = __importDefault(require("jwt-decode"));
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
var BITACORA_TYPES = {
    1: "read",
    2: "update",
    3: "instert",
    4: "delete",
};
var registrarBitacora = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var data, config, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = JSON.stringify(input.body);
                config = {
                    method: input.options.method,
                    url: "".concat(input.options.protocol, "://").concat(input.options.hostname, ":").concat(input.options.port).concat(input.options.path),
                    headers: {
                        "Content-Type": "application/json",
                        KeyId: input.KeyId,
                        Authorization: input.BearerToken,
                    },
                    data: data,
                };
                return [4 /*yield*/, axios_1.default.request(config)];
            case 1:
                response = _a.sent();
                if (response && response.data) {
                    return [2 /*return*/, response.data];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1.response) {
                    throw new Error("No se pudo registrar en bit\u00E1cora ".concat(error_1.response.status, " ").concat(error_1.response.statusText));
                }
                throw new Error("No se pudo registrar en bit\u00E1cora ".concat(error_1.message));
            case 3: throw new Error("No se pudo registrar en bitácora (response sin data)");
        }
    });
}); };
var obtenerTokenMQ = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var data, config, response, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!input.KeyId) {
                    throw new Error("No se encontró el KeyId en los headers (obtenerTokenMQ)");
                }
                data = JSON.stringify({
                    usuario: input.Usuario,
                    contrasena: input.Contrasena,
                });
                config = {
                    method: input.options.method,
                    maxBodyLength: Infinity,
                    url: "".concat(input.options.protocol, "://").concat(input.options.hostname, ":").concat(input.options.port).concat(input.options.path),
                    headers: {
                        KeyId: input.KeyId,
                        "Content-Type": "application/json",
                    },
                    data: data,
                    timeout: input.options.timeout ? parseInt(input.options.timeout) : 10000,
                };
                return [4 /*yield*/, axios_1.default.request(config)];
            case 1:
                response = _b.sent();
                if (response && ((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
                    return [2 /*return*/, response.headers.authorization];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                if (error_2.response) {
                    throw new Error("No se obtuvo el token de autenticaci\u00F3n: ".concat(error_2.response.status, " ").concat(error_2.response.statusText));
                }
                throw new Error("No se obtuvo el token de autenticaci\u00F3n: ".concat(error_2.message));
            case 3: throw new Error("No se obtuvo el token de autenticación (response sin token)");
        }
    });
}); };
var obtenerSesionUsuario = function (user, token, userDataToken) {
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
var obtenerHash = function (userSession) {
    // Se agrega marca temporal
    var sesionHash = (0, crypto_js_1.SHA512)(userSession).toString();
    if (!sesionHash) {
        throw new Error("No se ha podido generar el hash de la sesion");
    }
    return sesionHash;
};
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
        today: today,
    };
};
var obtenerDatosToken = function (token) {
    if (!token) {
        return null;
    }
    // Se transforma el token a un objeto
    var tokenData = (0, jwt_decode_1.default)(token);
    return tokenData;
};
var registrar = function (type, input) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userDataToken, userSession, sessionHash, dates, origen, response, payload, bitacoraResponse, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, obtenerTokenMQ({
                        KeyId: input.tokenOptions.keyId,
                        Usuario: input.tokenOptions.usuario,
                        Contrasena: input.tokenOptions.contrasena,
                        options: input.tokenOptions,
                    })];
            case 1:
                token = _a.sent();
                if (!token) {
                    throw new Error("No se pudo obtener el token de autenticación");
                }
                if (!input.bitacoraBody.nss) {
                    throw new Error("El NSS es requerido");
                }
                userDataToken = obtenerDatosToken(input.bitacoraBody.token);
                userSession = obtenerSesionUsuario(input.bitacoraBody.nss, input.bitacoraBody.token, userDataToken);
                sessionHash = obtenerHash(userSession);
                dates = obtenerFechas(userDataToken);
                origen = input.bitacoraBody.origen;
                response = input.bitacoraBody.response;
                if (!origen || !response) {
                    throw new Error("El origen y el response son requeridos");
                }
                payload = {
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
                return [4 /*yield*/, registrarBitacora({
                        KeyId: input.bitacoraOptions.keyId,
                        BearerToken: "Bearer ".concat(token),
                        body: payload,
                        options: input.bitacoraOptions,
                    })];
            case 2:
                bitacoraResponse = _a.sent();
                return [2 /*return*/, bitacoraResponse];
            case 3:
                error_3 = _a.sent();
                // Do something,
                if (input.onError) {
                    input.onError(error_3);
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.registrar = registrar;
exports.default = exports.registrar;
