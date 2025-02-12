import { registrar } from "../src/index";


const exampleToCopy = async () => {
  const response = await registrar(1, {
    bitacoraBody: {
      IP: "localhost",
      nss: "1234567890", // IE: "1234567890"
      origen: "MCI",
      responseCode: 200,
      valorAnterior: {},
      valorNuevo: {},
      geolocalizacion: "",
      request: "",
      response: {
        prueba: true,
      },
      token: null,
    },
    bitacoraOptions: {
      method: "",
      protocol: "https",
      hostname: "",
      port: "",
      path: "",
      timeout: "7000",
      keyId: "",
    },
    tokenOptions: {
      method: "",
      protocol: "https",
      hostname: "",
      port: "",
      path: "",
      timeout: "7000",
      keyId: "",
      usuario: "",
      contrasena: "",
    },
    onError: (error) => {
      console.log(error);
    },
  });
  console.log(response);
};

exampleToCopy();
