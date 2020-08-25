import { MyServer } from "./myserver";
import { AuthenticationService } from "../src/services/authentication/authentication.service";
import { MyHashService } from "./myhash.service";
import { MyUserService } from "./myuser.service";
import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { MyTokenService } from "./mytoken.service";

class MyAuthenticationService extends AuthenticationService<MyServer> {

    private hashService!: MyHashService;
    private userService!: MyUserService;
    private tokenService!: MyTokenService;


    constructor(server: MyServer, hashService: MyHashService, tokenService: MyTokenService, userService: MyUserService) {
        super(MyAuthenticationService.getName(), server);
        this.hashService = hashService
        this.userService = userService;
        this.tokenService = tokenService;
    }

    public static getName(): string {
        return "myauthenticationservice";
    }

    public start(): void {

    }

    public authenticate(userId: string, password: string): Observable<string | undefined> {
        return this.userService.getHashedPassword(userId).pipe(
            mergeMap((pwd) => pwd ? this.hashService.compare(password, pwd) : of(false)),
            mergeMap((logged) => logged ? this._generateToken(userId) : of(undefined))
        );
    }

    public _generateToken(userId: string): Observable<string> {
        return this.tokenService.generateUserToken(userId);
    }
}

export { MyAuthenticationService };