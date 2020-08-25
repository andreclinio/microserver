
import { MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";

import { MyServer } from "./myserver";
import { MyProtectedRoute} from "./myprotectedroute.class";

class MyGetUsersRoute extends MyProtectedRoute {

    constructor() {
        super("mygetusers", MiaRouteType.GET, "/users");
    }

    public handleX(context: MiaContext<MyServer>, _userId: string) {
        const server = context.server;
        const userService = server.getMyUserService(); 
        userService.getAllUsers().subscribe(users => {
            context.sendObject(users);
        });
    };
}

export { MyGetUsersRoute };