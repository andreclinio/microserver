
import { TsbRouteType, TsbRoute } from "../route.class";
import { TsbContext } from '../context.class';
import { TsbServer } from '../server.class';


class PingRoute<T extends TsbServer> extends TsbRoute<T> {

    constructor() {
        super("pingroute", TsbRouteType.GET, "/ping");
    }

    public  handle(context : TsbContext<T>) : void {
        context.sendText("pong");
    }
}

export {PingRoute};