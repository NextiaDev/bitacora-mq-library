import { registrar } from './index';

const exampleToCopy = async () => {
  const response = await registrar(1, {
    bitacoraBody: {
      IP: "localhost",
      nss: "1234567890",
      origen: "MCI",
      responseCode: 200,
      valorAnterior: "",
      valorNuevo: "",
      geolocalizacion: "",
      request: "",
      response: {
        prueba: true,
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXZlbl9uYW1lIjoiTk9NQlJFMjM3MDMyMzEgUEFURVJOTzIzNzAzMjMxIE1BVEVSTk8yMzcwMzIzMSIsIm5vbWJyZXMiOiJOT01CUkUyMzcwMzIzMSIsImFwUGF0ZXJubyI6IlBBVEVSTk8yMzcwMzIzMSIsImFwTWF0ZXJubyI6Ik1BVEVSTk8yMzcwMzIzMSIsIm5zcyI6IjAxMDA3MjAwMDE1IiwidGVsZWZvbm9DZWx1bGFyIjoiNTU1OTk0NDU1NyIsInJmYyI6Ik1FUEE3MjA1MTE2NDYiLCJjdXJwIjoiTUVQQTcyMDUxMUhERlJCTDA4IiwiZW1haWwiOiJhb20yQHlvcG1haWwuY29tIiwidHlwZV9vZl9hY2NvdW50IjoiMiIsImFjY291bnRfc3RhdHVzIjoiYWN0aXZlIiwiY3JlZGl0U3RhdHVzIjoiIiwiY3JlZGl0VHlwZSI6IiIsImNyZWRpdCI6IiIsIm1vbmVkYSI6IiIsInRpcG9UcmFiYWphZG9yIjoiYWZpbGlhZG8iLCJsYXN0X2xvZ2luIjoiMTUvZGljLzIwMjMgMDk6MzAgYW0iLCJjcmVkaXRvcyI6W3sibnVtX2NyZWRpdG8iOiIifV0sInBlcmZpbGFtaWVudG8iOnsibWktcGVyZmlsIjpbImNhbWJpYXItY29udHJhc2VuaWEiLCJhY3R1YWxpemFyLWRhdG9zLWNvbnRhY3RvIiwiY29ycmVjY2lvbi1yZmMiLCJjb3JyZWNjaW9uLWN1cnAtbm9tYnJlIiwic29jaW8taW5mb25hdml0IiwiZGVzdmluY3VsYS10dS1kaXNwb3NpdGl2by1tb3ZpbCIsIm5pcC1pbmZvbmF0ZWwiXSwibWktYWhvcnJvIjpbImN1YW50by1haG9ycm8tdGVuZ28iLCJoYXotYXBvcnRhY2lvbmVzLWV4dHJhb3JkaW5hcmlhcyIsImNhbGN1bGFkb3JhLWFob3JybyIsInJlc3VtZW4tbW92aW1pZW50b3MtYWhvcnJvIiwiY29uc3VsdGEtcmVsYWNpb25lcy1sYWJvcmFsZXMiLCJkZXZvbHVjaW9uLWZvbmRvLWFob3Jyby03Mi05MiJdLCJtaS10cmFtaXRlLWNyZWRpdG8iOlsic3VtYXItY3JlZGl0b3MiLCJwcmVjYWxpZmljYWNpb24tcHVudG9zIiwidGFsbGVyLXNhYmVyLW1hcyJdLCJjb250YWN0YW5vcyI6WyJzaWd1ZS1jYXNvLWFkanVudGEtZG9jdW1lbnRvcyIsInByZXNlbnRhLXNpZ3VlLXF1ZWphIiwib2ZpY2luYXMtYXRlbmNpb24iLCJjYW5hbGVzLXNlcnZpY2lvIiwiaGF6LXVuYS1jaXRhIl0sImFjY2Vzb3Jpb3MiOlsiY2FsY3VsYWRvcmEtcGVzb3MtdW5pZGFkLW1lZGlkYS1hY3R1YWxpemFjaW9uLXVtYSIsIm1pcy1hbGVydGFzIl19LCJwcm9kdWN0byI6IiIsInJlZ2ltZW4iOiIiLCJzaXR1YWNpb25jcmVkaXRvIjoiIiwibWFyY2FkZWNpZXJyZSI6IiIsImVzdFNvbCI6IiIsIm51bUNvbnZvY2EiOiIiLCJzdGF0dXNTb2MiOiIxIiwidGlwb0NyZWRpdG8iOiIiLCJpZFBlcmZpbCI6IjEuMSIsImV4cGlyZXNfaW4iOiIyMDI0LTAxLTExVDEyOjIzOjI2LTA2OjAwIiwidG9rZW5fcmVub3ZhdGlvbnMiOjIsInRva2VuX2R1cmF0aW9uIjoxMjAwLCJpYXQiOjE3MDQ5OTYyMDN9.686NhyDZh5sj-_zcnFvm0yZ7nSxiRRNrMRU-Btw0Fqg",
    },
    bitacoraOptions: {
      method: "",
      protocol: "",
      hostname: "",
      port: "",
      path: "",
      timeout: "",
      keyId: "",
    },
    tokenOptions: {
      method: "",
      protocol: "",
      hostname: "",
      port: "",
      path: "",
      timeout: "",
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