
import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";

class MyLoginRoute extends MiaRoute<MyServer> {

    constructor() {
        super("myloginroute", MiaRouteType.POST, "/login");
    }

    public handle(context : MiaContext<MyServer>) : void {
        const server = context.server;
        const authService = server.getMyAuthenticationService();
 
        const email = context.getHeader("email");
        const password = context.getHeader("password");
        
        context.log(`Trying login for ${email}`);
        
        const token = authService.authenticate(email, password);
        if (!token) {
            context.sendError(404, "Bad user or password");
            return; 
        }
        context.sendObject({"token": token});
    }
}

export { MyLoginRoute };