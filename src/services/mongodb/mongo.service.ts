
const mongoose = require('mongoose');

import { MiaServer } from "../../server.class";
import { MiaService } from "../service.class";
import { Schema, Connection } from "mongoose";

class MongoService<T extends MiaServer> extends MiaService<T> {

    private uri:string; 
    private connection?: Connection;

    constructor(name: string, server: T, uri: string) {
        super(name, server);
        this.uri = uri;
    }
    
    public start() : void {
        const options = { 
            useNewUrlParser: true,
            useUnifiedTopology: true
         };
        this.connection = mongoose.createConnection(this.uri, options); 
        // this.connection.once('open', () => {
        //     console.info('Connected to Mongo via Mongoose');
        // });
        // mongoose.connection.on('error', (err) => {
        //     console.error('Unable to connect to Mongo via Mongoose', err);
        // });    
    }

    public addModel(name: string, schema: Schema) {
        if (!this.connection) return;
        this.connection.model(name, schema);
    }
}

export {MongoService};