"use strict";
exports.__esModule = true;
exports.obtenerHash = void 0;
var crypto_js_1 = require("crypto-js");
var obtenerHash = function (userSession) {
    // Se agrega marca temporal
    var sesionHash = (0, crypto_js_1.SHA512)(userSession).toString();
    if (!sesionHash) {
        throw new Error("No se ha podido generar el hash de la sesion");
    }
    return sesionHash;
};
exports.obtenerHash = obtenerHash;
