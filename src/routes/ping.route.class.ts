
import { MiaRouteType, MiaRoute } from "../route.class";
import { MiaContext } from '../context.class';
import { MiaServer } from '../server.class';


class PingRoute<T extends MiaServer> extends MiaRoute<T> {

    constructor() {
        super("pingroute", MiaRouteType.GET, "/ping");
    }

    public  handle(context : MiaContext<T>) : void {
        context.sendText("pong");
    }
}

export {PingRoute};