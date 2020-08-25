import { Request, Response } from 'express';

import { TsbServer } from "./server.class";
import { TsbRoute } from "./route.class";


class TsbContext<T extends TsbServer> {

    readonly server!: T;
    readonly route!: TsbRoute<T>;
    readonly id!: string;
    readonly request!: Request;
    readonly response!: Response;

    constructor(server: T, route: TsbRoute<T>, id: string, request: Request, response: Response) {
        this.server = server;
        this.route = route;
        this.id = id;
        this.request = request;
        this.response = response;
    }

    public debug(message: string) : void {
        const name = this.route.name;
        this.server.debug(` [${name}]: [${this.id}] -  ${message} `);
    }

    public log(message: string): void {
        const name = this.route.name;
        this.server.log(` [${name}]: [${this.id}] - ${message}`);
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

export { TsbContext };