/* eslint-disable multiline-ternary */
import axios, { AxiosRequestConfig } from "axios";
import { SHA512 } from "crypto-js";
import jwtDecode from "jwt-decode";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

// Inputs
interface IBitacoraMQ {
  bitacoraBody: {
    IP: string;
    nss: string;
    origen: string;
    responseCode: number;
    valorAnterior: string;
    valorNuevo: string;
    geolocalizacion?: string;
    request?: any;
    response?: any;
    token?: string | null;
    anonimo?: string;
    canal?: string;
    kiosco?: string;
    idTipo?: string;
    tipo?: string;
    idEvento?: string;
    evento?: string;
  };
  bitacoraOptions: {
    hostname: string;
    keyId: string;
    method: string;
    path: string;
    port: string;
    protocol: string;
    timeout: string;
  };
  tokenOptions: {
    contrasena: string;
    hostname: string;
    keyId: string;
    method: string;
    path: string;
    port: string;
    protocol: string;
    timeout: string;
    usuario: string;
  };
  onError?: (error: Error) => void;
  onPrintPayload?: (payload: IBitacoraMQParams["body"]) => void;
}

interface IBitacoraMQParams {
  KeyId: string;
  BearerToken: string;
  body: {
    session: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    canal: string;
    kiosco: string;
    origen: string;
    sesion_detalle: string;
    valor_anterior: string;
    valor_nuevo: string;
    resultado: {
      login: boolean;
      fallecido: boolean;
      perfil: string;
      token: string;
    };
    geolocalizacion: string;
    usuario_txt: string;
    usuario: string;
    traza: {
      IP: string;
      idTipo: string;
      tipoDesc: string;
      idEvento: string;
      eventoDesc: string;
      accion: string;
      resultado: string;
      request: any;
      response: any;
      response_code: number | string;
    };
  };
  options: {
    protocol: string;
    path: string;
    method: string;
    hostname: string;
    port: string;
    timeout: string;
  };
}

interface ITokenMQParams {
  KeyId: string;
  Usuario: string;
  Contrasena: string;
  options: {
    protocol: string;
    path: string;
    method: string;
    hostname: string;
    port: string;
    timeout: string;
  };
}

// Outputs
interface IBitacoraMQResponse {
  codigo: string;
  mensaje: string;
  contenido: any;
}

const BITACORA_TYPES: { [key: number]: string } = {
  1: "Lectura",
  2: "Actualización",
  3: "Creación",
  4: "Eliminación",
};

interface IUserDataToken {
  given_name: string;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  nss: string;
  telefonoCelular: string;
  rfc: string;
  curp: string;
  email: string;
  type_of_account: number;
  account_status: string;
  moneda: string;
  tipoTrabajador: string;
  last_login: string;
  creditos: { num_credito: string }[];
  perfilamiento: {
    "mi-perfil": string[];
    "mi-ahorro": string[];
    "mi-tramite-credito": string[];
    "mi-credito": string[];
    contactanos: string[];
    accesorios: string[];
  };
  producto: string;
  regimen: string;
  situacioncredito: string;
  marcadecierre: string;
  estSol: string;
  numConvoca: string;
  statusSoc: string;
  tipoCredito: string;
  userDesk: string;
  idPerfil: string;
  fallecido: boolean;
  expires_in: string;
  token_renovations: number;
  token_duration: number;
  token_generated_at: string;
  iat: number;
}

const registrarBitacora = async (input: IBitacoraMQParams) => {
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
    const response = await axios.request(config);
    if (response && response.data) {
      return response.data as IBitacoraMQResponse;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `No se pudo registrar en bitácora ${error.response.status} ${error.response.statusText}`
      );
    }
    throw new Error(`No se pudo registrar en bitácora ${error.message}`);
  }
  throw new Error("No se pudo registrar en bitácora (response sin data)");
};

const obtenerTokenMQ = async (input: ITokenMQParams): Promise<string> => {
  try {
    if (!input.KeyId) {
      throw new Error(
        "No se encontró el KeyId en los headers (obtenerTokenMQ)"
      );
    }

    const data = JSON.stringify({
      usuario: input.Usuario,
      contrasena: input.Contrasena,
    });

    const config: AxiosRequestConfig = {
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
    const response = await axios.request(config);
    if (response && response?.headers?.authorization) {
      return response.headers.authorization;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `No se obtuvo el token de autenticación: ${error.response.status} ${error.response.statusText}`
      );
    }
    throw new Error(`No se obtuvo el token de autenticación: ${error.message}`);
  }
  throw new Error(
    "No se obtuvo el token de autenticación (response sin token)"
  );
};

const obtenerSesionUsuario = (
  user: string,
  token?: string | null,
  userDataToken?: IUserDataToken | null,
  anonimo?: string
) => {
  let userSession = "";
  let userImpersonalizacion = "";
  // CASE 1: If token is provided, and is MCI login, (A temporary mark is added)
  if (token && userDataToken && !userDataToken.userDesk) {
    if (!userDataToken.token_generated_at) {
      throw new Error(
        "No se ha podido obtener la fecha de generación del token"
      );
    }
    userSession = userDataToken.nss + userDataToken.token_generated_at;
  }

  // CASE 2: If token is provided, and is IMPERSONALIZATION login, (It returns the token)
  else if (token && userDataToken && userDataToken.userDesk) {
    if (!userDataToken.token_generated_at) {
      throw new Error(
        "No se ha podido obtener la fecha de generación del token"
      );
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

const obtenerHash = (userSession: string): string => {
  // Se agrega marca temporal
  const sesionHash = SHA512(userSession).toString();

  if (!sesionHash) {
    throw new Error("No se ha podido generar el hash de la sesion");
  }
  return sesionHash;
};

const obtenerFechas = (tokenData?: IUserDataToken | null) => {
  // Get Dates
  const today = new Date();

  let horaInicio, horaFin;
  const options: Intl.DateTimeFormatOptions = {
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
  } else {
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

const obtenerDatosToken = (token?: string | null): IUserDataToken | null => {
  if (!token) {
    return null;
  }

  // Se transforma el token a un objeto
  const tokenData = jwtDecode<IUserDataToken>(token);
  return tokenData;
};

/*
 * @param type: 1 | 2 | 3 | 4 (1: Lectura, 2: Actualización, 3: Creación, 4: Eliminación)
 * @param input: IBitacoraMQ
 * @returns Promise<IBitacoraMQResponse>
 */
export const registrar = async (type: string | number, input: IBitacoraMQ) => {
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

    if (Number.isNaN(Number(type)) || Number(type) < 1 || Number(type) > 4) {
      throw new Error("El tipo de bitácora es inválido");
    }

    // Get User Data Token
    const userDataToken = obtenerDatosToken(input.bitacoraBody.token);

    // Get User Session Identifier
    const { userSession, userImpersonalizacion } = obtenerSesionUsuario(
      input.bitacoraBody.nss,
      input.bitacoraBody.token,
      userDataToken,
      input.bitacoraBody.anonimo
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

    input?.onPrintPayload && input.onPrintPayload(payload);

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

export default registrar;
