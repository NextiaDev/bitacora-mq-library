import { IUserDataToken } from "../interfaces";

export const obtenerSesionUsuario = (
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
