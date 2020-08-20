import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { MiaServer } from "./server.class";
import { MiaContext} from "./context.class";

enum MiaRouteType {
    GET,
    POST,
    PUT
};

abstract class MiaRoute<T extends MiaServer> {

    private type: MiaRouteType;
    private path: string;
    private name: string;

    constructor(name: string, type: MiaRouteType, path: string) {
        this.type = type;
        this.path = path;
        this.name = !name ? "unamed" : name;
    }

    public getType(): MiaRouteType {
        return this.type;
    }

    public getPath(): string {
        return this.path;
    }

    public getName() : string {
        return this.name;
    }

    public treat(server: T, req: Request, res: Response): void {
        const id: string = uuid();
        const context = new MiaContext<T>(server, this, id);
        try {
            context._log(">>", "Start");
            this.handle(context, req, res);
            context._log("<<", "End");
        }
        catch (error) {
            context._log("!!", `Error ${error}`);
        }
    }


    public abstract handle(context: MiaContext<T>, req: Request, res: Response): void;

}

export { MiaRoute, MiaRouteType };