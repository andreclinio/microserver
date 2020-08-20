
import { MiaServer as MiaServer } from "./server.class";
import { PingRoute } from "./routes/ping.route.class";
import { MongoService } from "./services/mongodb/mongo.service";

class MyServer extends MiaServer {

    private mongoService: MongoService<MyServer>;

    constructor() {
        super("myserver", 4000);
        const uri = 'mongodb://root:1234@localhost:27017/myserver';
        this.mongoService = new MongoService("mymongoservice", this, uri);
        this.mongoService.start();
    }

    public getMongoService() : MongoService<MyServer> {
        return this.mongoService;
    }
};

const server = new MyServer();
server.addRoute(new PingRoute());
server.start();
