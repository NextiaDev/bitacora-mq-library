import axios from "axios";
import { IBitacoraMQParams, IBitacoraMQResponse } from "./interfaces";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export const registrarBitacora = async (input: IBitacoraMQParams) => {
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
