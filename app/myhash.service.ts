import { MtsHashService} from '../src/services/hash/hash.service';
import { MyServer } from './myserver';

class MyHashService extends MtsHashService<MyServer> {

    constructor(server: MyServer) {
        super(MyHashService.getName(), server, 10);
    }

    public static getName() : string {
        return "myhashservice";
    }
}

export { MyHashService };