import { Request, Response } from 'express';

import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";

class MyLoginRoute extends MiaRoute<MyServer> {

    constructor() {
        super("myloginroute", MiaRouteType.POST, "/login");
    }

    public async handle(context : MiaContext<MyServer>, request: Request, response: Response) : Promise<void> {
        const server = context.getServer();
        const authService = server.getMyAuthenticationService();
        if (!authService) {
            response.status(500).send("myauthenticationservice not found");
            return;
        }
        const email = request.header("email");
        const password = request.header("password");
        
        context.log(`Trying login for ${email}`);
        
        const token = authService.authenticate(email, password);
        if (!token) {
            response.status(404).send("Bad user or password");
            return; 
        }
        response.status(200).send({"token": token});
    }
}

export { MyLoginRoute };