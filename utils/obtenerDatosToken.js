"use strict";
exports.__esModule = true;
exports.obtenerDatosToken = void 0;
var jwt_decode_1 = require("jwt-decode");
var obtenerDatosToken = function (token) {
    if (!token) {
        return null;
    }
    // Se transforma el token a un objeto
    var tokenData = (0, jwt_decode_1["default"])(token);
    return tokenData;
};
exports.obtenerDatosToken = obtenerDatosToken;
