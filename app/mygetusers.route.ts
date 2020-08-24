
import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";

class MyGetUsersRoute extends MiaRoute<MyServer> {

    constructor() {
        super("mygetusers", MiaRouteType.GET, "/users");
    }

    public handle(context: MiaContext<MyServer>) {
        const server = context.server;
        const userService = server.getMyUserService(); 
        userService.getAllUsers().subscribe(users => {
            context.sendObject(users);
        });
    };
}

export { MyGetUsersRoute };