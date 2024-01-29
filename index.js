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
exports.__esModule = true;
exports.registrar = void 0;
/* eslint-disable multiline-ternary */
var interfaces_1 = require("./interfaces");
var registar_bitacora_1 = require("./registar-bitacora");
var obtenerFechas_1 = require("./utils/obtenerFechas");
var obtenerHash_1 = require("./utils/obtenerHash");
var obtener_token_1 = require("./obtener-token");
var registrar = function (type, input) { return __awaiter(void 0, void 0, void 0, function () {
    var token, sesionHash, dates, origen, response, payload, bitacoraResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, obtener_token_1.obtenerTokenMQ)({
                        KeyId: input.tokenOptions.keyId,
                        Usuario: input.tokenOptions.usuario,
                        Contrasena: input.tokenOptions.contrasena,
                        options: input.tokenOptions
                    })];
            case 1:
                token = _a.sent();
                if (!token) {
                    throw new Error('No se pudo obtener el token de autenticación');
                }
                sesionHash = (0, obtenerHash_1.obtenerHash)(input.bitacoraBody.nss, input.bitacoraBody.token);
                dates = (0, obtenerFechas_1.obtenerFechas)(input.bitacoraBody.token);
                origen = input.bitacoraBody.origen;
                response = input.bitacoraBody.response;
                if (!origen || !response) {
                    throw new Error('El origen y el response son requeridos');
                }
                payload = {
                    session: sesionHash,
                    fecha: dates.today.toISOString().slice(0, 10),
                    hora_inicio: dates.horaInicio,
                    hora_fin: dates.horaFin,
                    canal: 'Z4',
                    kiosco: 'false',
                    origen: origen,
                    sesion_detalle: sesionHash,
                    valor_anterior: input.bitacoraBody.valorAnterior || '',
                    valor_nuevo: input.bitacoraBody.valorNuevo || '',
                    resultado: response,
                    geolocalizacion: input.bitacoraBody.geolocalizacion || '',
                    usuario_txt: input.bitacoraBody.nss || '',
                    usuario: input.bitacoraBody.nss || '',
                    traza: {
                        IP: input.bitacoraBody.IP || '',
                        tipo: 'servicio',
                        accion: interfaces_1.BITACORA_TYPES[type] || 'read',
                        resultado: response,
                        request: input.bitacoraBody.request || {},
                        response: response,
                        response_code: input.bitacoraBody.responseCode || ''
                    }
                };
                console.log({ payload: payload });
                return [4 /*yield*/, (0, registar_bitacora_1.registrarBitacora)({
                        KeyId: input.bitacoraOptions.keyId,
                        BearerToken: "Bearer ".concat(token),
                        body: payload,
                        options: input.bitacoraOptions
                    })];
            case 2:
                bitacoraResponse = _a.sent();
                return [2 /*return*/, bitacoraResponse];
            case 3:
                error_1 = _a.sent();
                // Do something,
                if (input.onError) {
                    input.onError(error_1);
                }
                console.error(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.registrar = registrar;
