import express, { Application } from "express";
import { Request, Response } from 'express';

import { MiaRoute, MiaRouteType } from "./route.class";
import { MiaService } from "./services/service.class";

class MiaServer {

    private server: Application;
    private port: number;
    private name: string;
    private services: Map<string, MiaService<MiaServer>>;

    public start(): void {
        try {
            this.services.forEach(s => {
                this.log(`Starting service [${s.getName()}]...`);
                s.start()
                this.log(`Service [${s.getName()}] started`);
            });
        }
        catch (error) {
            this.log(`Server start failure! -- ${error}`);
            throw (error);
        }

        this.server.listen(this.port, () => {
            this.log(`Server is now running on port [${this.port}]`);
        });
    }

    public log(message: string) {
        console.log(`[MiaServer ${this.name}]: ${message}`)
    }

    public addRoute(route: MiaRoute<MiaServer>) {
        const type = route.type;
        const path = route.path;
        const treatment = (req: Request, res: Response) => {
            try {
                route.treat(this, req, res);
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500).send(error);
            }
        };

        switch (type) {
            case MiaRouteType.GET:
                this.server.get(path, treatment);
                break;
            case MiaRouteType.PUT:
                this.server.put(path, treatment);
                break;
            case MiaRouteType.POST:
                this.server.post(path, treatment);
                break;
            default:
                throw new Error("Unrecognized route type!");
        }
    }

    public addService(service: MiaService<MiaServer>) {
        const name = service.getName();
        this.services.set(name, service);
    }

    public getServiceByName(name: string) : MiaService<MiaServer> | undefined{
        const service = this.services.get(name);
        return service;
    }

    constructor(name: string, port: number) {
        this.server = express();
        this.port = port;
        this.name = name;
        this.services = new Map;
    }
}

export { MiaServer };