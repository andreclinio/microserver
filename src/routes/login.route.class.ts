import { Request, Response } from 'express';

import { MiaRouteType, MiaRoute } from "../route.class";
import { MiaContext } from '../context.class';
import { MiaServer } from '../server.class';
import { MongoService } from '../services/mongodb/mongo.service';
import LoginModel, { LoginSchema } from '../schemas/login.schema';


class LoginRoute<T extends MiaServer> extends MiaRoute<T> {

    constructor() {
        super("loginroute", MiaRouteType.POST, "/login");
    }

    public async handle(context : MiaContext<T>, _request: Request, response: Response) : Promise<void> {
        // TODO: tirar o nome!
        const srv = context.getServer().getServiceByName("myauthenticationservice");
        if (!srv) {
            response.status(500).send("myauthenticationservice not found");
            return;
        }
        const mongoservice = (srv as MongoService<T>) ;
        mongoservice.addModel("login", LoginSchema);
        response.send("login\n");
    }
}

export {LoginRoute};