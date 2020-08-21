import { Request, Response } from 'express';

import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";

class MyGetUsersRoute extends MiaRoute<MyServer> {

    constructor() {
        super("mygetusers", MiaRouteType.GET, "/users");
    }

    public handle(context: MiaContext<MyServer>, _request: Request, response: Response) {
        const server = context.getServer();
        const userService = server.getMyUserService();
        if (!userService) {
            response.status(500).send("service not found");
            return;
        }
  
        userService.getAllUsers().subscribe(users => {
            response.status(200).send(users);
        });
    };
}

export { MyGetUsersRoute };