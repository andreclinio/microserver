import { MtsTokenService, MtsTokenAlgorithm} from '../src/services/token/token.service';
import { MyServer } from './myserver';
import { Observable } from 'rxjs';

class MyTokenService extends MtsTokenService<MyServer> {

    constructor(server: MyServer) {
        super(MyTokenService.getName(), server, "edaceaba", MtsTokenAlgorithm.HS256);
    }

    public generateUserToken(userId: string) : Observable<string> {
        return super.generate(this.getName(), "user", this.ONE_HOUR, {userid: userId});
    }
    
    public static getName() : string {
        return "mytokenservice";
    }
}

export { MyTokenService };