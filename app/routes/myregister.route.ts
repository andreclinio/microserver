
import { TsbRoute, TsbRouteType } from "../../src/route.class";
import { TsbContext } from "../../src/context.class";
import { MyServer } from "../server/myserver";
import { MyUser } from '../services/myuser.service';

class MyRegisterRoute extends TsbRoute<MyServer> {

    constructor() {
        super("myregisterroute", TsbRouteType.POST, "/register");
    }

    public handle(context: TsbContext<MyServer>) {
        const server = context.server;
        const userService = server.getMyUserService();
 
        const email = context.getHeader("email");
        const name = context.getHeader("name");
        const password = context.getHeader("password");
        if (!email || !name || !password) {
            context.sendError(400, "No email, name, or password found for registration");
            return;
        }

        context.log(`Trying registration for [${name}::${email}]`);
        const user = new MyUser(name, email);
        userService.createUser(user, password).subscribe(result => {
            const uid = result[0];
            if (uid) {
                const msg = `User ${uid} for [${name} ::${email}] created!`;
                context.log(msg);
                context.sendObject({ "email": email, "uid" : uid });
            }
            else {
                const error = result[1];
                const err = `User for [${name}::${email}] not created! -- ${error}`;
                context.log(err);
                context.sendError(400, err);
            }
        });
    };
}

export { MyRegisterRoute };