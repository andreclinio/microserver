import { Request, Response } from 'express';

import { MiaServer } from "./server.class";
import { MiaRoute } from "./route.class";


class MiaContext<T extends MiaServer> {

    readonly server!: T;
    readonly route!: MiaRoute<T>;
    readonly id!: string;
    readonly request!: Request;
    readonly response!: Response;

    constructor(server: T, route: MiaRoute<T>, id: string, request: Request, response: Response) {
        this.server = server;
        this.route = route;
        this.id = id;
        this.request = request;
        this.response = response;
    }

    public log(message: string): void {
        this._log("--", message);
    }

    public _log(flag: string, message: string): void {
        const name = this.route.name;
        this.server.log(` [${name}]: (${flag} ${this.id}) - ` + message);
    }

    public getHeader(paramName: string) : string | undefined {
        return this.request.header(paramName);
    }

    public sendError(status: number, message: string) : void {
        this.response.status(status).send({ error: message });
    }

    public sendNotImplemented() : void {
        this.sendError(501, "Not implemented");
    }

    public sendObject(object: Object) : void {
        this.response.status(200).send(object);
    }

    public sendText(text: string) : void {
        this.response.status(200).send(`${text}\n`);
    }

}

export { MiaContext };