interface IBitacoraMQ {
    bitacoraBody: {
        IP: string;
        nss: string;
        origen: string;
        responseCode: number;
        valorAnterior: string;
        valorNuevo: string;
        geolocalizacion?: string;
        request?: any;
        response?: any;
        token?: string | null;
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
}
interface IBitacoraMQResponse {
    codigo: string;
    mensaje: string;
    contenido: any;
}
export declare const registrar: (type: 1 | 2 | 3 | 4, input: IBitacoraMQ) => Promise<IBitacoraMQResponse | undefined>;
export default registrar;
