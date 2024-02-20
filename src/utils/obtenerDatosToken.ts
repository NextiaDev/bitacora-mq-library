import jwtDecode from "jwt-decode";
import { IUserDataToken } from "../interfaces";

export const obtenerDatosToken = (
  token?: string | null
): IUserDataToken | null => {
  if (!token) {
    return null;
  }

  // Se transforma el token a un objeto
  const tokenData = jwtDecode<IUserDataToken>(token);
  return tokenData;
};
