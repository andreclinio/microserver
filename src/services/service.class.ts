import { MiaServer } from "../server.class";

abstract class MiaService<T extends MiaServer> {

    private server: T;
    private name: string;

    constructor(name: string, server: T) {
        this.name = name;
        this.server = server;
    }

    public getName() : string {
        return this.name;
    }

    public getServer() : T {
        return this.server;
    }

    public log(message: string) {
        this.server.log(`<service ${this.name}> ${message}`);
    }

    public abstract start() : void;
}

export {MiaService};