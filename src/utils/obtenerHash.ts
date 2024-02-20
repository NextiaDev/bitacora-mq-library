import { SHA512 } from "crypto-js";

export const obtenerHash = (userSession: string): string => {
  // Se agrega marca temporal
  const sesionHash = SHA512(userSession).toString();

  if (!sesionHash) {
    throw new Error("No se ha podido generar el hash de la sesion");
  }
  return sesionHash;
};
