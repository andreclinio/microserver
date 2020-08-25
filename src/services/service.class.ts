import { MiaServer } from "../server.class";

/**
 * Generic service for the framework
 */
abstract class MiaService<T extends MiaServer> {

    /** Server */
    private server: T;

    /** Service name */
    private name: string;
    
    /**
     * Abstract method that defines the service initialization (after constructor) if needed.
     */
    public abstract start(): void;


    constructor(name: string, server: T) {
        this.name = name;
        this.server = server;
    }

    public getName(): string {
        return this.name;
    }

    public getServer(): T {
        return this.server;
    }

    public log(message: string) {
        this.server.log(this._mountMessage(message));
    }

    public debug(message: string) {
        this.server.debug(this._mountMessage(message));
    }

    private _mountMessage(message: string): string {
        return `[service ${this.name}] ${message}`;
    }
}

export { MiaService };