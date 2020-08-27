
import { TsbRouteType } from "../../src/route.class";
import { TsbContext } from "../../src/context.class";

import { MyServer } from "../server/myserver";
import { MyProtectedRoute} from "./myprotectedroute.class";

/** 
 * @swagger
 * /users/me:
 *   get:
 *     description: return current user information
 *     parameters:
 *       - in: header
 *         name: userId
 *         schema: 
 *            type: string
 *            format: plain
 *     responses:
 *       404:
 *         description: invalid token
 *       200:
 *         description: user information will be correctly sent
 *         schema: 
 *            type: object
 *            $ref: '#/definitions/MyUser'      
 */
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