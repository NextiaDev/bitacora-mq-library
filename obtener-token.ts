import axios, { AxiosRequestConfig } from "axios";
import { ITokenMQParams } from "./interfaces";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

export const obtenerTokenMQ = async (
  input: ITokenMQParams
): Promise<string> => {
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
    console.log({response});
  } catch (error) {
    console.log(error);
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
