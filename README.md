# TsBase

Soon...

## Development

### Setup

Check docker-compose.yml file to see root credentials.
``` 
      container_name: "tsbase-mongo"

      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 1234
```

Create user in mongo:
```
[user@host] docker exec -it tsbase-mongo  /bin/bash

root@3a2d1877f2e9:/# mongo -u root -p 1234
> use mybase
> db.createUser({user: "myuser", pwd: "mypassword", roles: ["readWrite"]})
```

