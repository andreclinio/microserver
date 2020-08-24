import { Observable, of, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Schema } from "mongoose";

import { v4 } from 'uuid';

import { MyServer } from './myserver';
import { MiaService } from '../src/services/service.class';
import { MyMongoService } from './mymongo.service';

interface MyUserObject { name: string, email: string };


class MyUser {

    public name!: string;
    public email!: string;

    public constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }

    public static fromObject(iuser: MyUserObject): MyUser {
        const user = new MyUser(iuser['name'], iuser['email']);
        return user;
    }

    public toObject(): MyUserObject {
        return { name: this.name, email: this.email };
    }
}

const myAdressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true }
});

const myPasswordSchema = new Schema({
    _id: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }
});

const myUserSchema = new Schema({
    _id: { type: String, default: v4},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    registrationData: { type: Date, default: Date.now },
    address: { type: myAdressSchema },
});


class MyUserService extends MiaService<MyServer> {

    private mongoService: MyMongoService;
    private userModel!: any;
    private passwordModel!: any;


    constructor(server: MyServer, mongoservice: MyMongoService) {
        super(MyUserService.getName(), server);
        this.mongoService = mongoservice;
    }

    public static getName(): string {
        return "myuserservice";
    }

    public start(): void {
        this.userModel = this.mongoService.addModel("myUserModel", myUserSchema, "users");
        this.passwordModel = this.mongoService.addModel("myPasswordModel", myPasswordSchema, "passwords");
    }

    public getAllUsers(): Observable<MyUser[]> {
        const observable = Observable.create((observer: Observer<MyUser[]>) => {
            this.userModel.find({}, (err: any, result: MyUserObject[]) => {
                if (err != null) observer.error(err);
                const users: MyUser[] = [];
                result.forEach(r => {
                    users.push(MyUser.fromObject(r));
                });
                observer.next(users);
                observer.complete();
            });
        });
        return observable;
    }


    public createUser(user: MyUser, password: string) : Observable<[string| undefined, string | undefined]> {
        const email = user.email;
        const name = user.name;
        if (!email) return of([undefined, "No email informed."]);
        if (!name) return of([undefined, "No name informed."]);
        if (!password) return of([undefined, "No password informed."]);

        const ob = this._hasEmail(email).pipe(mergeMap(has => {
            if (has) {
                const x : [string| undefined, string | undefined] = [undefined, "User with email already exists."];
                return of(x);
            }
            else {
                return this._createUser(name, email).pipe(
                    mergeMap(uid => this._createPassword(uid, password)),
                    mergeMap(uid => {
                        const x : [string| undefined, string | undefined] = uid ? [uid, "ok"] : [undefined, "no uid!"];
                        return of(x);
                    }));
            }
        }));
        return ob;
    }

    public changePassword(email: string | undefined, password: string): Observable<string | undefined> {
        return this._changePassword(email, password);
    }

    private _changePassword(userId: string | undefined, password: string): Observable<string| undefined> {
        if (!userId) return of(undefined);
        const ob: Observable<string | undefined> = Observable.create(
            (observer: Observer<string | undefined>) => {
                this.passwordModel.updateOne({ _id: userId }, { password: password }, (err: any, res: any) => {
                    if (err) {
                        observer.error(err);
                        return;
                    }
                    if (res.modifiedCount == 0) observer.next(undefined)
                    else observer.next(`${userId}`);
                    observer.complete()
                })
            }
        );
        return ob;
    }

    private _createUser(name: string, email: string): Observable<string | undefined> {
        const ob: Observable<string | undefined> = Observable.create((observer: Observer<string | undefined>) => {
            this.userModel.create({ name: name, email: email }, (err: any, user: any) => {
                if (err) {
                    observer.error(err);
                    return;
                }
                observer.next(`${user._id}`);
                observer.complete();
            });
        });
        return ob;
    }

    private _createPassword(userId: string | undefined, password: string): Observable<string| undefined> {
        if (!userId) return of(undefined);
        const ob: Observable<string | undefined> = Observable.create((observer: Observer<string | undefined>) => {
            this.passwordModel.create({ _id: userId, password: password }, (err: any, res: any) => {
                if (err) {
                    observer.error(err);
                    return;
                }
                observer.next(`${res._id}`);
                observer.complete();
            });
        });
        return ob;
    }

    private _hasEmail(email: string): Observable<boolean> {
        if (!email) return of(false);
        return Observable.create((observer: Observer<boolean>) => {
            this.userModel.findOne({ email: email }, (err: any, user: any) => {
                if (err != null) observer.error(err);
                observer.next(user ? true : false);
                observer.complete();
            });
        });
    }
}

export { MyUserService, MyUser };