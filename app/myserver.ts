import { MiaServer } from "../src/server.class";
import { MyMongoService } from "./mymongo.service";
import { MyAuthenticationService } from "./myauthentication.service";
import { MyUserService } from "./myuser.service";
import { MiaService } from "../src/services/service.class";

class MyServer extends MiaServer {

    constructor() {
        super("myserver", 4000);
        const mongoservice = new MyMongoService(this);
        this.addService(mongoservice);

        this.addService(new MyAuthenticationService(this));
        this.addService(new MyUserService(this, mongoservice));
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