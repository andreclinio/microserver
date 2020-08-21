import { MiaServer } from "./server.class";
import { MiaRoute } from "./route.class";


class MiaContext<T extends MiaServer> {

    private server: T;
    private route: MiaRoute<T>;
    private id: string;

    constructor(server: T, route: MiaRoute<T>, id: string) {
        this.server = server;
        this.route = route;
        this.id = id;
    }

    public getServer(): T {
        return this.server;
    }

    public getRoute(): MiaRoute<T> {
        return this.route;
    }

    public getId(): string {
        return this.id;
    }

    public log(message: string): void {
        this._log("--", message);
    }

    public _log(flag: string, message: string): void {
        const name = this.route.getName();
        this.server.log(` [${name}]: (${flag} ${this.id}) - ` + message);
    }

}

export { MiaContext };