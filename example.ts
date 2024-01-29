import { registrar } from './index';

const exampleToCopy = async () => {
  const response = await registrar(1, {
    bitacoraBody: {

    },
    bitacoraOptions: {

    }, 
    tokenOptions: {

    },
    onError: (error) => {
        console.log(error);
    }
  });
  console.log(response);
};

exampleToCopy();