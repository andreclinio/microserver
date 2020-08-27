

import { PingRoute } from '../src/routes/ping.route.class';

import { MyRegisterRoute } from './routes/myregister.route';
import { MyGetUsersRoute } from './routes/mygetusers.route'
import { MyLoginRoute } from './routes/mylogin.route';
import { MyGetMeRoute } from './routes/myme.route';
import { MySwaggerJsonRoute } from './routes/myswaggerjson.route';

import { MyServer } from './server/myserver';

const server = new MyServer();
server.addRoute(new PingRoute());
server.addRoute(new MyRegisterRoute());
server.addRoute(new MyGetUsersRoute());
server.addRoute(new MyLoginRoute());
server.addRoute(new MyGetMeRoute());
server.addRoute(new MySwaggerJsonRoute());

const swaggerUi = require('express-swaggerize-ui');
server.application.use('/api-docs', swaggerUi({docs: 'swagger'}));

server.start();
