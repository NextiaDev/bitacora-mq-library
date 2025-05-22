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
      anonimo: 'MCI'
    },
    bitacoraOptions: {
      method: "POST",
      protocol: "https",
      hostname: "091402AQ249.infonavit.net",
      port: "8065",
      path: "/mcibitacora/bitacora/registro",
      timeout: "7000",
      keyId: "",
    },
    onError: (error) => {
      console.log(error);
    },
  });
  console.log(response);
};

exampleToCopy();
