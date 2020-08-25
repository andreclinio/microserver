import { TsbMongoService } from '../../src/services/mongodb/mongo.service';
import { MyServer } from '../server/myserver';

class MyMongoService extends TsbMongoService<MyServer> {

    constructor(server: MyServer) {
        const uri = 'mongodb://myuser:mypassword@localhost:27017/mybase';
        super(MyMongoService.getName(), server, uri);
    }

    public static getName() : string {
        return "mymongoservice";
    }
}

export { MyMongoService };