import { MiaServer } from "../src/server.class";
import { MiaService } from "../src/services/service.class";

import { MyMongoService } from "./mymongo.service";
import { MyAuthenticationService } from "./myauthentication.service";
import { MyUserService } from "./myuser.service";
import { MyHashService } from "./myhash.service";
import { MyTokenService } from "./mytoken.service";

class MyServer extends MiaServer {

    constructor() {
        super("myserver", 4000);

        const mongoService = new MyMongoService(this);
        this.addService(mongoService);

        const hashService = new MyHashService(this);
        this.addService(hashService);

        const tokenService = new MyTokenService(this);
        this.addService(tokenService);

        const userService = new MyUserService(this, mongoService, hashService);
        this.addService(userService);

        const authService = new MyAuthenticationService(this, hashService, tokenService, userService);
        this.addService(authService);
    }

    private getMyService<X extends MiaService<MyServer>>(name: string ): X {
        const srv = this.getServiceByName(name);
        if (!srv) throw new Error(`Service $name not found!`);
        return srv as X;
    }

    public getMyMongoService() : MyMongoService {
        return (this.getMyService(MyMongoService.getName()) as MyMongoService);
    }

    public getMyAuthenticationService() : MyAuthenticationService {
        return (this.getMyService(MyAuthenticationService.getName()) as MyAuthenticationService);
    }

    public getMyUserService() : MyUserService {
        return (this.getMyService(MyUserService.getName()) as MyUserService);
    }
};

export { MyServer };