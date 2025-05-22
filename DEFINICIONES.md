DEFINICIONES
Frontend: Es la parte de la aplicación MCI que interactúa con el usuario.
Backend: Es la parte de la aplicación MCI que interactúa con la base de datos u otros microservicios.
Microservicio: Es una parte de la aplicación que se encarga de realizar una tarea específica y pertenece a un area externa de MCI (CRM, CARTERA, MQ, HANA, SDS, etc).
Servicio: Cada modulo dentro de MCI que diferencia una funcionalidad especifica (Login, Responsabilidad Compartida)
Evento: Cada acción que realiza el usuario dentro de un servicio dado (Ingreso a MCI por login, Validación de NSS, Cierre del sistema)

// Version 1 Bitacora
idTipo: Identifica el id del servicio segun la matriz de visibilidad actualizada (100, 101, 102, 103, 104, 105...)
tipoDesc: Identifica la descripcion del servicio segun la matriz de visibilidad actualizada (Login, Registro, Impersonalizacion, Restablece Contraseña, Cambiar contraseña, Actualizar datos de contacto...)
idEvento: Identifica la accion realizada por el usuario dentro de un servicio dado (100100, 100101, 100102)
eventoDesc: Identifica la descripcion de la accion realizada por el usuario dentro de un servicio dado (Ingreso a MCI por login, Validación de NSS, Cierre del sistema)

// Version 2 Bitacora (Liberacion progresiva, primero se libero login, registro, restable tu constraseñam datos de contacto)
errorCatalogo: Identifica el error capturado
errorCatalogoDesc: Descripcion del error capturado
servicio: URL del microservicio consumido (http://gwtservices.net/altaUsuario)
servicioResponse: Respuesta del ultimo servicio que fallo (En caso de error), si no fallo, se envia por default el ultimo servicio consumido
servicios: Arreglo de servicios consumidos por consumo

(http://gwtservices.net/altaUsuario)
(http://gwtservices.net/altaUsuario2)
(http://gwtservices.net/altaUsuario3)
Fallo -> (http://gwtservices.net/altaUsuario3)

(http://gwtservices.net/altaUsuario4)
Exito -> (http://gwtservices.net/altaUsuario4)

Servicios: 
[
  (http://gwtservices.net/altaUsuario)
(http://gwtservices.net/altaUsuario2)
(http://gwtservices.net/altaUsuario3)
(http://gwtservices.net/altaUsuario4)
]