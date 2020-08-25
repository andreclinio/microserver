
import { Observable, from } from "rxjs";
import { hash, compare } from "bcryptjs";

import { MiaServer } from "../../server.class";
import { MiaService } from "../service.class";


class MtsHashService<T extends MiaServer> extends MiaService<T> {

    private salt!: number | string;

    constructor(name: string, server: T, salt: number | string) {
        super(name, server);
        this.salt = salt;
    }

    public start(): void {
    }
  
    public create(value: string) : Observable<string> {
        return from(hash(value, this.salt));        
    }

    public compare(value: string, hashedValue: string) : Observable<boolean> {
        return from(compare(value, hashedValue));
    }
}

export { MtsHashService };