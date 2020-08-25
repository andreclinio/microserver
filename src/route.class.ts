import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { TsbServer } from "./server.class";
import { TsbContext} from "./context.class";

enum TsbRouteType {
    GET,
    POST,
    PUT
};

abstract class TsbRoute<T extends TsbServer> {

    readonly type!: TsbRouteType;
    readonly path!: string;
    readonly name!: string;

    constructor(name: string, type: TsbRouteType, path: string) {
        this.type = type;
        this.path = path;
        this.name = !name ? "unamed" : name;
    }

    public treat(server: T, req: Request, res: Response): void {
        const id: string = uuid();
        const context = new TsbContext<T>(server, this, id, req, res);
        try {
            context.log(">> START");
            this.handle(context);
            context.log("<< END");
        }
        catch (error) {
            const err = `!! EXCEPTION: ${error}`;
            context.log(err);
            res.status(500).send(err);
        }
    }
 
    public abstract handle(context: TsbContext<T>) : void;

}

export { TsbRoute, TsbRouteType };