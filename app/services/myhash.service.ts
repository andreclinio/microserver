import { TsbHashService} from '../../src/services/hash/hash.service';
import { MyServer } from '../server/myserver';

class MyHashService extends TsbHashService<MyServer> {

    constructor(server: MyServer) {
        super(MyHashService.getName(), server, 10);
    }

    public static getName() : string {
        return "myhashservice";
    }
}

export { MyHashService };