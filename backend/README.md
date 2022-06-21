### SNM-I Backend

#### Install dependencies
```shell
npm install -g yarn
yarn install
```

#### Copy `.env` to `./backend/.env`
> `.env` includes credentials for mailing server.

#### Start MongoDB
```shell
docker run -p 127.0.0.1:7200:7200 -d --name your-graphdb-instance-name -t khaller/graphdb-free:latest --GDB_HEAP_SIZE=6G
```

#### Start GraphDB
```shell
docker run --name mongo -p 27017:27017 -d mongo:latest
```

#### Start Backend
```shell
yarn start
```