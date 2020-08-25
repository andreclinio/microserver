
import { of, Observable } from "rxjs";

import { TsbRoute, TsbRouteType } from "../../src/route.class";
import { TsbContext } from "../../src/context.class";
import { MyServer } from "../server/myserver";
import { mergeMap } from "rxjs/operators";

abstract class MyProtectedRoute extends TsbRoute<MyServer> {

    constructor(name: string, type: TsbRouteType, path: string) {
        super(name, type, path);
    }

    public handle(context : TsbContext<MyServer>) : void {
        const token = context.getHeader("token");
        if (!token) {
            const err = "No token for protected route.";
            context.log(err)
            context.sendError(401, err);
            return; 
        }
                
      
        this._getUserId(context, token).subscribe(uid => {
            if (!uid) {
                const err = "Invalid token (no user bound to it).";
                context.log(err)
                context.sendError(401, err);
                return;
            }
            this.handleX(context, uid);    
        });
    }

    private _getUserId(context : TsbContext<MyServer>, token: string) : Observable<string | undefined> {
        const server = context.server;
        const tokenService = server.getMyTokenService();
        return tokenService.verify(token).pipe(
            mergeMap(dt => dt ? of(this._findUserId(dt)) : of(undefined)),
        );
    }

    private _findUserId(object: Object) : string | undefined{
        const o = object as {data : {userId: string}};
        if (!o.data) return undefined;
        return o.data.userId;
    }

    protected abstract handleX(context: TsbContext<MyServer>, userId: string) : void;

}

export { MyProtectedRoute };