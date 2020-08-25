
import { TsbRouteType } from "../../src/route.class";
import { TsbContext } from "../../src/context.class";

import { MyServer } from "../server/myserver";
import { MyProtectedRoute} from "./myprotectedroute.class";

class MyGetMeRoute extends MyProtectedRoute {

    constructor() {
        super("mygetme", TsbRouteType.GET, "/users/me");
    }

    public handleX(context: TsbContext<MyServer>, userId: string) {
        const server = context.server;
        const userService = server.getMyUserService(); 
        userService.getUser(userId).subscribe(user => {
            context.sendObject(user);
        });
    };
}

export { MyGetMeRoute };