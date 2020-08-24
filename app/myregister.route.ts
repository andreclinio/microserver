
import { MiaRoute, MiaRouteType } from "../src/route.class";
import { MiaContext } from "../src/context.class";
import { MyServer } from "./myserver";
import { MyUser } from './myuser.service';

class MyRegisterRoute extends MiaRoute<MyServer> {

    constructor() {
        super("myregisterroute", MiaRouteType.POST, "/register");
    }

    public handle(context: MiaContext<MyServer>) {
        const server = context.server;
        const userService = server.getMyUserService();
 
        const email = context.getHeader("email");
        const name = context.getHeader("name");
        const password = context.getHeader("password");
        if (!email || !name || !password) {
            context.sendError(400, "No email, name, or password found for registration");
            return;
        }

        context.log(`Trying registration for ${name} :: ${email}`);
        const user = new MyUser();
        user.name = name;
        user.email = email;
        userService.createUser(user, password).subscribe(tuple => {
            const ok = tuple[0];
            const err = tuple[1];
            if (ok) {
                const msg = `User ${name} / ${email} created!`;
                context.log(msg);
                context.sendObject({ "email": email });
            }
            else {
                context.log(err);
                context.sendError(400, err);
            }
        });
    };
}

export { MyRegisterRoute };