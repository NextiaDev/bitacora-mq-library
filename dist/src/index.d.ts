interface IBitacoraMQ {
    bitacoraBody: {
        IP: string;
        nss: string;
        origen: string;
        responseCode: number;
        valorAnterior?: {
            [key: string]: any;
        };
        valorNuevo?: {
            [key: string]: any;
        };
        geolocalizacion?: string;
        request?: any;
        response?: any;
        token?: string | null;
        anonimo?: string;
        canal?: string;
        kiosco?: string;
        idTipo?: string;
        tipo?: string;
        idEvento?: string;
        evento?: string;
        fechaInicio?: Date;
        fechaFin?: Date;
        errorCatalogo?: string;
        errorCatalogoDesc?: string;
        errorServicio?: string;
    };
    bitacoraOptions: {
        hostname: string;
        keyId: string;
        method: string;
        path: string;
        port: string;
        protocol: string;
        timeout: string;
    };
    tokenOptions: {
        contrasena: string;
        hostname: string;
        keyId: string;
        method: string;
        path: string;
        port: string;
        protocol: string;
        timeout: string;
        usuario: string;
    };
    onError?: (error: Error) => void;
    onPrintPayload?: (payload: IBitacoraMQParams["body"]) => void;
}
interface IBitacoraMQParams {
    KeyId: string;
    BearerToken: string;
    body: {
        session: string;
        fecha: string;
        hora_inicio: string;
        hora_fin: string;
        canal: string;
        kiosco: string;
        origen: string;
        sesion_detalle: string;
        valor_anterior: {
            [key: string]: any;
        };
        valor_nuevo: {
            [key: string]: any;
        };
        resultado: {
            login: boolean;
            fallecido: boolean;
            perfil: string;
            token: string;
        };
        geolocalizacion: string;
        usuario_txt: string;
        usuario: string;
        traza: {
            IP: string;
            accion: string;
            resultado: string;
            request: any;
            response: any;
            response_code: number | string;
            idTipo?: string;
            tipoDesc?: string;
            idEvento?: string;
            eventoDesc?: string;
            errorCatalogo?: string;
            errorCatalogoDesc?: string;
            errorServicio?: string;
        };
    };
    options: {
        protocol: string;
        path: string;
        method: string;
        hostname: string;
        port: string;
        timeout: string;
    };
}
interface IBitacoraMQResponse {
    codigo: string;
    mensaje: string;
    contenido: any;
}
export declare const registrar: (type: string | number, input: IBitacoraMQ) => Promise<IBitacoraMQResponse | undefined>;
export default registrar;
