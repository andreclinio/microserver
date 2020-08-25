import { TsbServer } from "../../src/server.class";
import { TsbService } from "../../src/services/service.class";

import { MyMongoService } from "../services/mymongo.service";
import { MyAuthenticationService } from "../services/myauthentication.service";
import { MyUserService } from "../services/myuser.service";
import { MyHashService } from "../services/myhash.service";
import { MyTokenService } from "../services/mytoken.service";

class MyServer extends TsbServer {

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

    private getMyService<X extends TsbService<MyServer>>(name: string ): X {
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

    public getMyTokenService() : MyTokenService {
        return (this.getMyService(MyTokenService.getName()) as MyTokenService);
    }
};

export { MyServer };