
import { TsbRouteType } from "../../src/route.class";
import { TsbContext } from "../../src/context.class";

import { MyServer } from "../server/myserver";
import { MyProtectedRoute} from "./myprotectedroute.class";

class MyGetUsersRoute extends MyProtectedRoute {

    constructor() {
        super("mygetusers", TsbRouteType.GET, "/users");
    }

    public handleX(context: TsbContext<MyServer>, _userId: string) {
        const server = context.server;
        const userService = server.getMyUserService(); 
        userService.getAllUsers().subscribe(users => {
            context.sendObject(users);
        });
    };
}

export { MyGetUsersRoute };