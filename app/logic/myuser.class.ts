

/**
 * @swagger
 * definitions:
 *   MyUser:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 */

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

export { MyUser, MyUserObject };