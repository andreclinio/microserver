
import { MiaServer as MiaServer } from "./server.class";
import { PingRoute } from "./routes/ping.route.class";
import { MongoService } from "./services/mongodb/mongo.service";

class MyServer extends MiaServer {

    private mongoService: MongoService;

    constructor() {
        super("myserver", 4000);
        const uri = 'mongodb://root:1234@localhost:27017/microauth';
        this.mongoService = new MongoService(uri);
        this.mongoService.start();
    }

    public getMongoService() : MongoService {
        return this.mongoService;
    }
};

const server = new MyServer();
server.addRoute(new PingRoute());
server.start();
