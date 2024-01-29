"use strict";
exports.__esModule = true;
exports.obtenerHash = void 0;
var sha512_1 = require("crypto-js/sha512");
var obtenerHash = function (nss, userToken) {
    var sesionData = userToken !== null ? userToken : nss;
    var sesionHash = (0, sha512_1["default"])(sesionData).toString();
    if (!sesionHash) {
        throw new Error("No se ha podido generar el hash de la sesion");
    }
    return sesionHash;
};
exports.obtenerHash = obtenerHash;
