// this.application.use('/api-docs.json', function (_req, res) {
//     res.json(require("../app/docs.json"));
// });
// this.application.use('/api-docs', swaggerUi());

import { TsbRoute, TsbRouteType } from "../../src/route.class";
import { TsbContext } from "../../src/context.class";
import { MyServer } from "../server/myserver";

// const swaggerUi = require('express-swaggerize-ui');

class MySwaggerJsonRoute extends TsbRoute<MyServer> {

    constructor() {
        super("myswaggerjsonroute", TsbRouteType.GET, "/swagger-json");
    }

    public handle(context: TsbContext<MyServer>): void {
        const json = require("../docs.json");
        context.sendObject(json);
    }

}

export { MySwaggerJsonRoute };