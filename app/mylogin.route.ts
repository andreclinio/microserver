
import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";
import { mergeMap } from "rxjs/operators";
import { of, Observable } from "rxjs";

class MyLoginRoute extends MiaRoute<MyServer> {

    constructor() {
        super("myloginroute", MiaRouteType.POST, "/login");
    }

    public handle(context : MiaContext<MyServer>) : void {
        const email = context.getHeader("email");
        const password = context.getHeader("password");
        if (!email || !password) {
            context.sendError(404, "No user or password");
            return; 
        }
        
        context.log(`Trying login for ${email}`);
        
        this._authenticate(context, email, password).subscribe(token => {
            if (!token) {
                context.sendError(404, "Bad user or password");
                return; 
            }
            context.sendObject({"token": token});    
        });
    }

    private _authenticate(context: MiaContext<MyServer>, email: string, password: string ) : Observable<string | undefined> {
        const server = context.server;
        const authService = server.getMyAuthenticationService();
        const userService = server.getMyUserService();

        return userService.emailToUserId(email).pipe(
            mergeMap( uid => uid ? authService.authenticate(uid, password) : of(undefined))
        );
    }

}

export { MyLoginRoute };