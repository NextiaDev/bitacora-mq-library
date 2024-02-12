"use strict";
exports.__esModule = true;
exports.obtenerHash = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
var crypto_js_1 = require("crypto-js");
var obtenerHash = function (nss, userToken) {
    var sesionData = userToken !== null ? userToken : nss;
    var sesionHash = (0, crypto_js_1.SHA512)(sesionData).toString();
    if (!sesionHash) {
        throw new Error("No se ha podido generar el hash de la sesion");
    }
    return sesionHash;
};
exports.obtenerHash = obtenerHash;
