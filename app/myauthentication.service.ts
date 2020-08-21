import { MyServer } from "./myserver";
import { AuthenticationService } from "../src/services/authentication/authentication.service";

class MyAuthenticationService extends AuthenticationService<MyServer> {
    constructor(server: MyServer) {
        super(MyAuthenticationService.getName(), server);
    }

    public static getName() : string {
        return "myauthenticationservice";
    }
}

export { MyAuthenticationService};