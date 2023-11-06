### SNM-I Backend

#### Install dependencies
```shell
npm install -g yarn
yarn install
```

#### Copy `.env` to `./backend/.env`
> `.env` includes credentials for mailing server.

#### Start GraphDB and MongoDB
You might need to start `dockerd` first if you are not using the GUI:
```shell
sudo dockerd

# or with your OS's service manager
systemctl start docker # for systemd
sudo service docker start # for openrc
```

If you had manually started `dockerd`, you need to run the following commands
as root using `sudo` or `doas`. Otherwise, run them as they are:
```shell
# GraphDB
docker run -p 7200:7200 -d --name graphdb --restart unless-stopped -t ontotext/graphdb:10.0.2 --GDB_HEAP_SIZE=6G -Dgraphdb.workbench.maxUploadSize=2097152000

# MongoDB
docker run --name mongo -p 27017:27017 --restart unless-stopped -d mongo:latest
```

#### Start Backend
```shell
yarn start
```

#### Allow Self-Signed Localhost certificate
- **Google Chrome:** enable `chrome://flags/#temporary-unexpire-flags-m118` and then `chrome://flags/#allow-insecure-localhost`
- **Firefox**: Go to Preferences --> Privacy & Security --> View Certificates
  --> Servers --> Add Exception --> Add localhost:5001
- If the `#allow-insecure-localhost` flag is not available to you, please follow the instructions [here](./config)
