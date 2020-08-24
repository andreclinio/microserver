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

    readonly type!: MiaRouteType;
    readonly path!: string;
    readonly name!: string;

    constructor(name: string, type: MiaRouteType, path: string) {
        this.type = type;
        this.path = path;
        this.name = !name ? "unamed" : name;
    }

    public treat(server: T, req: Request, res: Response): void {
        const id: string = uuid();
        const context = new MiaContext<T>(server, this, id, req, res);
        try {
            context._log(">>", "Start");
            this.handle(context);
            context._log("<<", "End");
        }
        catch (error) {
            const err = `Internal error detected: ${error}`;
            context._log("!!", err);
            console.error(error);
            res.status(500).send(err);
        }
    }
 
    public abstract handle(context: MiaContext<T>) : void;

}

export { MiaRoute, MiaRouteType };