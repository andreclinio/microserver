
import { of, Observable } from "rxjs";

import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";

abstract class MyProtectedRoute extends MiaRoute<MyServer> {

    constructor(name: string, type: MiaRouteType, path: string) {
        super(name, type, path);
    }

    public handle(context : MiaContext<MyServer>) : void {
        const token = context.getHeader("token");
        if (!token) {
            context.sendError(404, "No token");
            return; 
        }
                
        this._getUserId(token).subscribe(uid => {
            if (!uid) {
                context.sendError(404, "Invalid token");
                return; 
            }
            this.handleX(context, uid);    
        });
    }

    private _getUserId(_token: string) : Observable<string | undefined> {
        return of(undefined);
    }

    protected abstract handleX(context: MiaContext<MyServer>, userId: string) : void;

}

export { MyProtectedRoute };