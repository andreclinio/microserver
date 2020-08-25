

import { PingRoute } from '../src/routes/ping.route.class';
import { MyRegisterRoute } from './routes/myregister.route';
import { MyGetUsersRoute } from './routes/mygetusers.route'
import { MyLoginRoute } from './routes/mylogin.route';

import { MyServer } from './server/myserver';

const server = new MyServer();
server.addRoute(new PingRoute());
server.addRoute(new MyRegisterRoute());
server.addRoute(new MyGetUsersRoute());
server.addRoute(new MyLoginRoute());


server.start();
