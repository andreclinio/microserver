import { Observable, of, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Schema } from "mongoose";

import { v4 } from 'uuid';

import { MyServer } from '../server/myserver';
import { TsbService } from '../../src/services/service.class';
import { MyMongoService } from './mymongo.service';
import { MyHashService } from './myhash.service';
import { MyUser, MyUserObject} from '../logic/myuser.class'


const myAdressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true }
});

const myPasswordSchema = new Schema({
    _id: { type: String },
    password: { type: String, required: true }
});

const myUserSchema = new Schema({
    _id: { type: String, default: v4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    registrationData: { type: Date, default: Date.now },
    address: { type: myAdressSchema },
});


class MyUserService extends TsbService<MyServer> {

    private mongoService!: MyMongoService;
    private hashService!: MyHashService;

    private userModel!: any;
    private passwordModel!: any;


    constructor(server: MyServer, mongoService: MyMongoService, hashService: MyHashService) {
        super(MyUserService.getName(), server);
        this.mongoService = mongoService;
        this.hashService = hashService;
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

    public getUser(userId: string): Observable<MyUser> {
        return this._getUser(userId);
    }

    public createUser(user: MyUser, password: string): Observable<[string | undefined, string | undefined]> {
        const email = user.email;
        const name = user.name;
        if (!email) return of([undefined, "No email informed."]);
        if (!name) return of([undefined, "No name informed."]);
        if (!password) return of([undefined, "No password informed."]);

        const ob = this._hasEmail(email).pipe(mergeMap(has => {
            if (has) {
                const x: [string | undefined, string | undefined] = [undefined, "User with email already exists."];
                return of(x);
            }
            else {
                return this._createUser(name, email).pipe(
                    mergeMap(uid => this._createPassword(uid, password)),
                    mergeMap(uid => {
                        const x: [string | undefined, string | undefined] = uid ? [uid, "ok"] : [undefined, "no uid!"];
                        return of(x);
                    }));
            }
        }));
        return ob;
    }

    public emailToUserId(email: string) : Observable<string | undefined> {
        return this._emailToUserId(email);
    }

    public getHashedPassword(userId: string): Observable<string | undefined> {
        return this._getHashedPassword(userId);
    }

    public changePassword(email: string | undefined, password: string): Observable<string | undefined> {
        return this._hashPassword(password).pipe(mergeMap(pwd => this._changePassword(email, pwd)));
    }

    private _hashPassword(password: string): Observable<string> {
        return this.hashService.create(password);
    }

    private _getHashedPassword(userId: string): Observable<string | undefined> {
        const ob: Observable<string | undefined> = Observable.create(
            (observer: Observer<string | undefined>) => {
                this.passwordModel.findById(userId, (err: any, pwd: any) => {
                    if (err) {
                        observer.error(err);
                        return;
                    }
                    if (!pwd) observer.next(undefined)
                    else observer.next(`${pwd.password}`);
                    observer.complete();
                })
            }
        );
        return ob;
    }

    private _changePassword(userId: string | undefined, password: string): Observable<string | undefined> {
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

    private _createPassword(userId: string | undefined, password: string): Observable<string | undefined> {
        return this._hashPassword(password).pipe(mergeMap(pwd => {
            this.log(`generated hashed password for [${userId}] as [${pwd}] `);
            return this._createPasswordEntry(userId, pwd);
        }));
    }

    private _createPasswordEntry(userId: string | undefined, password: string): Observable<string | undefined> {
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

    private _emailToUserId(email: string): Observable<string | undefined> {
        return Observable.create((observer: Observer<string | undefined>) => {
            this.userModel.findOne({ email: email }, (err: any, user: any) => {
                if (err != null) observer.error(err);
                observer.next(user ? `${user._id}` : undefined);
                observer.complete();
            });
        });
    }

    private _getUser(userId: string): Observable<MyUser> {
        const observable = Observable.create((observer: Observer<MyUser>) => {
            this.userModel.findOne({ _id: userId}, (err: any, result: MyUserObject) => {
                if (err != null) observer.error(err);
                observer.next(MyUser.fromObject(result));
                observer.complete();
            });
        });
        return observable;
    }


}

export { MyUserService, MyUser };