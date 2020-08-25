
import { TsbRouteType, TsbRoute } from "../route.class";
import { TsbContext } from '../context.class';
import { TsbServer } from '../server.class';



class LoginRoute<T extends TsbServer> extends TsbRoute<T> {

    constructor() {
        super("loginroute", TsbRouteType.POST, "/login");
    }

    public handle(context : TsbContext<T>) : void {
        context.sendNotImplemented();
    }
}

export {LoginRoute};