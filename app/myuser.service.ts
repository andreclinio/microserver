import { Observable, of, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { v4 } from 'uuid';

import { MyServer } from './myserver';
import { MiaService } from '../src/services/service.class';
import { MyMongoService } from './mymongo.service';
import { Schema } from "mongoose";

class MyUser {

    public name!: string;
    public email!: string;

    public toJson(): Object {
        const data = { "name": this.name, "email": this.email };
        return data;
    }

    public static fromJson(_object: Object): MyUser {
        const user = new MyUser();
        user.name = "xxx";
        user.email = "yyy";
        return user;
    }

    public static fromDoc(iuser: MyUserObject): MyUser {
        const user = new MyUser();
        user.name = iuser["name"];
        user.email = iuser["email"];
        return user;
    }

    public toDoc(): MyUserObject {
        return { name: this.name, email: this.email };
    }
}

interface MyUserObject { name: string, email: string };

class MyUserSchema extends Schema {
    constructor() {
        super(
            {
                _id: { type: String, default: v4 },
                name: { type: String, required: true },
                email: { type: String, required: true },
            }
        );
    }
};

const myUserSchema = new MyUserSchema();


class MyUserService extends MiaService<MyServer> {

    private mongoService: MyMongoService;
    private model!: any;

    constructor(server: MyServer, mongoservice: MyMongoService) {
        super(MyUserService.getName(), server);
        this.mongoService = mongoservice;
    }

    public static getName(): string {
        return "myuserservice";
    }

    public start(): void {
        this.model = this.mongoService.addModel("MyUserModel", myUserSchema, "users");
    }

    public getAllUsers(): Observable<MyUser[]> {
        const observable = Observable.create((observer: Observer<MyUser[]>) => {
            this.model.find({}, (err: any, result: MyUserObject[]) => {
                if (err != null) observer.error(err);
                const users: MyUser[] = [];
                result.forEach(r => {
                    users.push(MyUser.fromDoc(r));
                });
                observer.next(users);
                observer.complete();
            });
        });
        return observable;
    }

    public hasEmail(email: string): Observable<boolean> {
        if (!email) return of<boolean>(false);
        return Observable.create((observer: Observer<boolean>) => {
            this.model.find({ email: email }, (err: any, result: Object[]) => {
                if (err != null) observer.error(err);
                observer.next(result.length > 0);
                observer.complete();
            });
        });
    }

    public createUser(user: MyUser, password: string | undefined): Observable<[boolean, string]> {
        const email = user.email;
        const name = user.name;
        if (!email) return of([false, "No email informed."]);
        if (!name) return of([false, "No name informed."]);
        if (!password) return of([false, "No password informed."]);

        const hasEmailOb = this.hasEmail(email);
        const createUserOb: Observable<[boolean, string]> = Observable.create((observer: Observer<[boolean, string]>) => {
            const userModel = new this.model(user.toDoc());
            userModel.save();
            observer.next([true, `User created: ${userModel}`]);
            observer.complete();
        });

        const ob = hasEmailOb.pipe(mergeMap(has => {
            if (has) {
                const x: [boolean, string] = [false, "User with email already exists."];
                return of(x);
            }
            else return createUserOb;
        }));

        return ob;
    }
}

export { MyUserService, MyUser };