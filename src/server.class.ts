import express, { Application } from "express";
import { Request, Response } from 'express';

import { TsbRoute, TsbRouteType } from "./route.class";
import { TsbService } from "./services/service.class";

/**
 * Web server calass
 */
class TsbServer {

    /** express application */
    readonly application!: Application;

    /** server port */
    readonly port!: number;

    /** server name (debug facility) */
    readonly name!: string;

    /** map of services inside the server */
    private services: Map<string, TsbService<TsbServer>>;

    /**
     * Main server method which starts all services and listens to the configured port.
     */
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
        this.application.listen(this.port, () => {
            this.log(`Server is now running on port [${this.port}]`);
        });
    }

    /**
     * Write down a log message.
     * @param message message to to written to log.
     */
    public log(message: string) {
        console.log(`[${this.name}]: ${message}`)
    }

    /**
     * Write a debug message (used for developers)
     * @param message message
     */
    public debug(message: string) {
        console.debug(`[DEBUG --- ${this.name}]: ${message}`)
    }

    /**
     * Add a new route to the server.
     * @param route route
     */
    public addRoute(route: TsbRoute<TsbServer>) {
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
            case TsbRouteType.GET:
                this.application.get(path, treatment);
                break;
            case TsbRouteType.PUT:
                this.application.put(path, treatment);
                break;
            case TsbRouteType.POST:
                this.application.post(path, treatment);
                break;
            default:
                throw new Error("Unrecognized route type!");
        }
    }

    /**
     * Add a new service to the server.
     * @param service service
     */
    public addService(service: TsbService<TsbServer>) {
        const name = service.getName();
        this.services.set(name, service);
    }

    /**
     * Retrieve a service instance based on its name (defined by the developer)
     * @param name service name
     */
    public getServiceByName(name: string): TsbService<TsbServer> | undefined {
        const service = this.services.get(name);
        return service;
    }

    /**
     * Construtor
     * @param name server name (for debug and log pourposes)
     * @param port server port
     */
    constructor(name: string, port: number) {
        this.application = express();
        this.port = port;
        this.name = name;
        this.services = new Map;
    }
}

export { TsbServer };