

import { TsbServer } from "../../server.class";
import { TsbService } from "../service.class";
import { Observable, Observer } from "rxjs";
var jwt = require('jsonwebtoken');

enum TsbTokenAlgorithm {
    HS256 = "HS256"
};

class TsbTokenService<T extends TsbServer> extends TsbService<T> {

    private secret!: string;
    private algorithm!: TsbTokenAlgorithm;

    readonly ONE_HOUR: number = 3600;

    constructor(name: string, server: T, secret: string, algorithm: TsbTokenAlgorithm) {
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

    public verify(token: string) : Observable<Object> {
        return this._verify(token);
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

    private _verify(token: string): Observable<Object> {
        const ob = Observable.create((observer : Observer<Object>) => {
            jwt.verify(token, this.secret, { algorithm: this.algorithm }, (err: any, data: Object) => {
                if (err) {
                    observer.error(err);
                    return;
                }
                observer.next(data);
                observer.complete();
            });
        });
        return ob;
    }

}

export { TsbTokenService, TsbTokenAlgorithm };