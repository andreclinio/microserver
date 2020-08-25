

import { MiaServer } from "../../server.class";
import { MiaService } from "../service.class";
import { Observable, Observer } from "rxjs";
var jwt = require('jsonwebtoken');

enum MtsTokenAlgorithm {
    HS256 = "HS256"
};

class MtsTokenService<T extends MiaServer> extends MiaService<T> {

    private secret!: string;
    private algorithm!: MtsTokenAlgorithm;

    readonly ONE_HOUR: number = 3600;

    constructor(name: string, server: T, secret: string, algorithm: MtsTokenAlgorithm) {
        super(name, server);
        this.secret = secret;
        this.algorithm = algorithm;
    }

    public start(): void {
    }

    public generate(issuer: string, subject: string, expiration: number, data: Object): Observable<string> {
        const jwtData = {
            iss: issuer,
            sub: subject,
            data: data,
            exp: Math.floor(Date.now() / 1000) + expiration
        }
        return this._generate(jwtData);
    }

    private _generate(data: { iss: string, sub: string, data: Object, exp: number }): Observable<string> {
        const ob = Observable.create((observer : Observer<string>) => {
            jwt.sign(data, this.secret, { algorithm: this.algorithm }, (err: any, token: string) => {
                if (err) {
                    observer.error(err);
                    return;
                }
                observer.next(token);
                observer.complete();
            });
        });
        return ob;
    }

}

export { MtsTokenService, MtsTokenAlgorithm };