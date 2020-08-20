
import * as mongoose from "mongoose";

export interface ILogin extends mongoose.Document {
    email: string; 
    password: string; 
  };
  
export const LoginSchema = new mongoose.Schema({
    name: {type:String, required: true},
    somethingElse: Number,
  });
  
const Login = mongoose.model<ILogin>('Login', LoginSchema);
export default Login;