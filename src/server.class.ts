import express, { Application } from "express";
import { Request, Response } from 'express';

import { MiaRoute, MiaRouteType } from "./route.class";

class MiaServer {

    private server: Application;
    private port: number;
    private name: string;

    public start(): void {
        this.server.listen(this.port, () => {
            this.log(`Running port ${this.port}`);
        });
    }

    public log(message: string) {
        console.log(`[MiaServer ${this.name}]: ${message}`)
    }

    public addRoute(route: MiaRoute<MiaServer>) {
        const type = route.getType();
        const path = route.getPath();
        const treatment = (req: Request, res: Response) => {
            try {
            route.treat(this, req, res);
            }
            catch(error) {
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

    constructor(name: string, port: number) {
        this.server = express();
        this.port = port;
        this.name = name;
    }
}

export { MiaServer };