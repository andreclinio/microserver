

import { MiaServer } from "../../server.class";
import { MiaService } from "../service.class";
import { Observable } from "rxjs";

abstract class AuthenticationService<T extends MiaServer> extends MiaService<T> {

    constructor(name: string, server: T) {
        super(name, server);
    }

    public abstract start(): void;

    public abstract authenticate(userId: string, password: string): Observable<string | undefined>;

}

export { AuthenticationService };