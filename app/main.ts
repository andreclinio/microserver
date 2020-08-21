

import { PingRoute } from '../src/routes/ping.route.class';
import { MyRegisterRoute } from './myregister.route';
import { MyGetUsersRoute } from './mygetusers.route'
import { MyServer } from './myserver';

const server = new MyServer();
server.addRoute(new PingRoute());
server.addRoute(new MyRegisterRoute());
server.addRoute(new MyGetUsersRoute());

server.start();
