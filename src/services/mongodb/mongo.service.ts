
const mongoose = require('mongoose');

import { MiaServer } from "../../server.class";
import { MiaService } from "../service.class";
import { Schema, Connection, Model, Document } from "mongoose";

class MongoService<T extends MiaServer> extends MiaService<T> {

    private uri: string;
    private connection?: Connection;

    constructor(name: string, server: T, uri: string) {
        super(name, server);
        this.uri = uri;
    }

    public start(): void {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        mongoose.connection.on('error', (err: any) => {
            this.log(`Unable to connect to Mongo via Mongoose: ${err}`);
        });
        this.connection = mongoose.createConnection(this.uri, options);
        if (!this.connection) throw new Error('No mongo connection!');

        this.connection.once('open', () => {
            this.log('Connected to MongoDB!');
        });
    }

    public addModel<S extends Schema, M extends Model<T extends Document ? any : any, any>>(modelName: string, schema: S, collectionName: string): M {
        if (!this.connection) throw new Error("Undefined connection!");
        return this.connection.model(modelName, schema, collectionName) as M;
    }
}

export { MongoService };