import { SHA512 } from "crypto-js";

export const obtenerHash = (nss: string, userToken?: string): string => {
  const sesionData = userToken !== null ? userToken : nss;
  const sesionHash = SHA512(sesionData as string).toString();

  if (!sesionHash) {
    throw new Error("No se ha podido generar el hash de la sesion");
  }
  return sesionHash;
};
