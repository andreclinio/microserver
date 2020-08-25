

import { TsbServer } from "../../server.class";
import { TsbService } from "../service.class";
import { Observable } from "rxjs";

abstract class TsbAuthenticationService<T extends TsbServer> extends TsbService<T> {

    constructor(name: string, server: T) {
        super(name, server);
    }

    public abstract start(): void;

    public abstract authenticate(userId: string, password: string): Observable<string | undefined>;

}

export { TsbAuthenticationService };