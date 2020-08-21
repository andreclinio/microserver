

import { MiaServer } from "../../server.class";
import { MiaService } from "../service.class";

class AuthenticationService<T extends MiaServer> extends MiaService<T> {

    constructor(name: string, server: T) {
        super(name, server);
    }
    
    public start() : void {
    }

    public authenticate(email: string | undefined, password: string | undefined) : string | undefined {
        if (!email || !password) return undefined;
        return `${email}-${password}`;
    }

}

export {AuthenticationService};