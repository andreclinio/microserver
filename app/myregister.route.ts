import { Request, Response } from 'express';

import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";
import { MyUser } from './myuser.service';

class MyRegisterRoute extends MiaRoute<MyServer> {

    constructor() {
        super("myregisterroute", MiaRouteType.POST, "/register");
    }

    public handle(context: MiaContext<MyServer>, request: Request, response: Response) {
        const server = context.getServer();
        const userService = server.getMyUserService();
        if (!userService) {
            response.status(500).send("service not found");
            return;
        }
        const email = request.header("email");
        const name = request.header("name");
        const password = request.header("password");

        context.log(`Trying registration for ${name} :: ${email}`);

        const user = new MyUser();
        user.name = name;
        user.email = email;
        userService.createUser(user, password).subscribe(tuple => {
            const ok = tuple[0];
            const err = tuple[1];
            if (ok) {
                const msg = `User ${name} / ${email} created!`;
                context.log(msg);
                response.status(200).send({ "email": email });
            }
            else {
                context.log(err);
                response.status(400).send({ "error": err });
            }
        });
    };
}

export { MyRegisterRoute };