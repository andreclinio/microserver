import { MongoService } from '../src/services/mongodb/mongo.service';
import { MyServer } from './myserver';

class MyMongoService extends MongoService<MyServer> {

    constructor(server: MyServer) {
        const uri = 'mongodb://myserver:myserver@localhost:27017/myserver';
        super(MyMongoService.getName(), server, uri);
    }

    public static getName() : string {
        return "mymongoservice";
    }
}

export { MyMongoService };