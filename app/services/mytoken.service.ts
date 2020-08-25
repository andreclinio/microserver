import { TsbTokenService, TsbTokenAlgorithm} from '../../src/services/token/token.service';
import { MyServer } from '../server/myserver';
import { Observable } from 'rxjs';

class MyTokenService extends TsbTokenService<MyServer> {

    constructor(server: MyServer) {
        super(MyTokenService.getName(), server, "edaceaba", TsbTokenAlgorithm.HS256);
    }

    public generateUserToken(userId: string) : Observable<string> {
        return super.generate(this.getName(), "user", this.ONE_HOUR, {userId: userId});
    }

    public static getName() : string {
        return "mytokenservice";
    }
}

export { MyTokenService };