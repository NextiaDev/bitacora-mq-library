/* eslint-disable multiline-ternary */
import { BITACORA_TYPES, IBitacoraMQ, IBitacoraMQParams } from "./interfaces";
import { registrarBitacora } from "./registar-bitacora";
import { obtenerFechas } from "./utils/obtenerFechas";
import { obtenerHash } from "./utils/obtenerHash";
import { obtenerTokenMQ } from "./obtener-token";
import { obtenerDatosToken } from "./utils/obtenerDatosToken";
import { obtenerSesionUsuario } from "./utils/obtenerSesionUsuario";

export const registrar = async (type: 1 | 2 | 3 | 4, input: IBitacoraMQ) => {
  try {
    // Get Token
    const token = await obtenerTokenMQ({
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
    const userSession = obtenerSesionUsuario(
      input.bitacoraBody.nss,
      input.bitacoraBody.token,
      userDataToken
    );

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

    const payload: IBitacoraMQParams["body"] = {
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
    const bitacoraResponse = await registrarBitacora({
      KeyId: input.bitacoraOptions.keyId,
      BearerToken: `Bearer ${token}`,
      body: payload,
      options: input.bitacoraOptions,
    });
    return bitacoraResponse;
  } catch (error) {
    // Do something,
    if (input.onError) {
      input.onError(error);
    }
  }
};
