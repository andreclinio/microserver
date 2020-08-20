import { Request, Response } from 'express';

import { MiaRouteType, MiaRoute } from "../route.class";
import { MiaContext } from '../context.class';
import { MiaServer } from '../server.class';


class PingRoute<T extends MiaServer> extends MiaRoute<T> {

    constructor() {
        super("pingroute", MiaRouteType.GET, "/ping");
    }

    public handle(_context : MiaContext<T>, _request: Request, response: Response) : void {
        response.send("pong\n");
    }
}

export {PingRoute};