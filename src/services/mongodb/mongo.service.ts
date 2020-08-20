
import * as mongoose from "mongoose";

class MongoService {

    private uri:string; 
    private connection: mongoose.Connection | undefined;

    constructor(uri: string) {
        this.uri = uri;
    }
    
    public start() : void {
        const options = { 
            useNewUrlParser: true,
            useUnifiedTopology: true
         };
        this.connection = mongoose.createConnection(this.uri, options);
        this.connection.once('open', () => {
            console.info('Connected to Mongo via Mongoose');
        });
        mongoose.connection.on('error', (err) => {
            console.error('Unable to connect to Mongo via Mongoose', err);
        });    
    }

    public addModel(name: string, schema: mongoose.Schema) {
        if (!this.connection) return;
        this.connection.model(name, schema);
    }
}

export {MongoService};