import * as mongoose from "mongoose";
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { MyServer } from './myserver';
import { MiaService } from '../src/services/service.class';
import { MyMongoService } from './mymongo.service';

class MyUser {
    public name: string | undefined;
    public email: string | undefined;

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

    public static fromDoc(iuser : IMyUser) : MyUser {
        const user = new MyUser();
        user.name = iuser.name;
        user.email = iuser.email;
        return user;
    }
}

interface IMyUser extends mongoose.Document {
    name: string;
    email: string;
};

const MyUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

const MyUserModel = mongoose.model<IMyUser>('users', MyUserSchema);

class MyUserService extends MiaService<MyServer> {

    private mongoService: MyMongoService;

    constructor(server: MyServer, mongoservice: MyMongoService) {
        super(MyUserService.getName(), server);
        this.mongoService = mongoservice;
    }

    public static getName(): string {
        return "myuserservice";
    }

    public start(): void {
        this.mongoService.addModel("users", MyUserSchema);
    }

    public getAllUsers(): Observable<MyUser[]> {
        let allUsers : MyUser[] = [];
        MyUserModel.find({}, (err, users) => {
            console.log("***", err);
            if (err) allUsers = [];
            else users.forEach(u => allUsers.push(MyUser.fromDoc(u)));
        });
        return of(allUsers);
    }

    public hasEmail(email: string | undefined): Observable<boolean> {
        if (!email) return of<boolean>(false);
        return from(MyUserModel.exists({ email: email }));
    }

    public createUser(user: MyUser, password: string | undefined): Observable<[boolean, string]> {
        const email = user.email;
        const name = user.name;
        if (!email) return of([false, "No email informed."]);
        if (!name) return of([false, "No name informed."]);
        if (!password) return of([false, "No password informed."]);

        const hasEmailOb = this.hasEmail(email);
        const userModel = new MyUserModel({ email: email, name: name });
        const saveUserOb = from(userModel.save());
        const createUserOb = saveUserOb.pipe(map(u => {
            const x : [boolean, string] = [true, `User created: ${u.email}`];
            return x;
        }));

        const ob = hasEmailOb.pipe(mergeMap(has => {
            if (has) {
                const x : [boolean, string] = [false, "User with email already exists."];
                return of(x);
            }
            else return createUserOb;
        }));

        return ob;
    }
}

export { MyUserService, MyUser };