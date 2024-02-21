/* eslint-disable multiline-ternary */
const axios = require("axios");
const SHA512 = require("crypto-js/sha512");
const jwtDecode = require("jwt-decode");
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
      tipo: string;
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

const BITACORA_TYPES = {
  1: "read",
  2: "update",
  3: "instert",
  4: "delete",
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

    const config: any = {
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
  userDataToken?: IUserDataToken | null
): string => {
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

const obtenerDatosToken = (token?: string | null): IUserDataToken | null => {
  if (!token) {
    return null;
  }

  // Se transforma el token a un objeto
  const tokenData = jwtDecode(token) as IUserDataToken;
  return tokenData;
};

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

export {};