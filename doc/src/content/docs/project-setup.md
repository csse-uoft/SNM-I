---
title: Project setup
---

## Installing dependencies
The project requires [NodeJS](https://nodejs.org/en) and
[Docker](https://www.docker.com/products/docker-desktop/).

:::tip
If you use [Homebrew](https://brew.sh/) on MacOS,
the easiest way to install them would be through
```sh
brew install node
brew install --cask docker
```
:::

We use [`yarn`](https://yarnpkg.com/) for managing Node packages.
Check that you have it with
```sh
yarn -v
```
If the command is invalid, install it with
```sh
npm install -g yarn
```

## Setting up project
1. Clone the repository
```sh
git clone --depth=1 https://github.com/csse-uoft/SNM-I
```

2. Install node dependencies in both the `frontend/` and `backend/` directories
```sh
cd SNM-I/frontend
yarn install
cd ../backend
yarn install
```

3. You should receive a `.env` file with the server credentials.
Place it inside of `backend/`.

4. Allow self-signed localhost certificates on your browser and restart the browser
  - **chrome:** enable `chrome://flags/#allow-insecure-localhost`
  - **firefox:** Go to Preferences → Privacy & Security → View certificates →
    Servers → Add Exception → add `localhost:5000`

5. Create the mongoDB and graphDB docker images.
To do this, you need to first start the docker daemon.
If you installed the docker desktop (eg. `brew install --cask docker`),
this might be done for you already. Open the docker app to start the daemon.

Alternatively, you can start it in the command line by running `dockerd` as root
or through your service manager:
```sh
sudo dockerd # keep this running, or
systemctl start docker # if you use systemd, or
sudo service docker start # if you use open-rc
```

Then create the docker images with the following commands:
```sh
docker create -p 127.0.0.1:7200:7200 --name graphdb --restart unless-stopped -t ontotext/graphdb:10.0.2 --GDB_HEAP_SIZE=6G -Dgraphdb.workbench.maxUploadSize=2097152000
docker create --name mongo -p 27017:27017 ––restart unless-stopped -d mongo:latest
```

:::note
The `graphdb` and `mongo` after `--name` are just for yourself to tell apart.
You can name them whatever you want!
:::

:::tip[For Apple M series users]
The performance of GraphDB might be faster on the
[ontotext client](https://www.ontotext.com/products/graphdb/graphdb-free/) instead of the docker image.
:::

## Running in production
### Backend
1. Start the docker daemon (see above).
2. Start the docker images, either through the desktop GUI or `docker start graphdb mongo` (use the names from earlier).
The graphdb interface should start on port 7200.
3. Run `yarn start` in the `backend/` directory.
The server should start on port 8080.

### Frontend
1. Run `yarn start` in the `frontend/` directory.
The site should served at port 3000.
2. Visit `localhost:3000` in your browser and log in with the following credentials:

Field | Value
---|---
Email | admin@snmi.ca
Password | admin
What university is CSSE associated with? | UofT
What is CSSE’s home department? | MIE
What is CSSE’s purpose? | research

:::note
Make sure you log in every time you restart the frontend/backend even if you are seeing the dashboards.
If you are getting error 403, it’s likely because you bypassed the login wall with your browser's cached pages and aren't actually authorized.
:::

## Next steps
Congratulations! You have finished setting up the project for development! 🥳🥳
Here are a few things you might want to check out next, in any order you prefer.

- **Project goals:** Learn more about [the business and functional requirements of the project](/reference/requirements/).
- **User's manual:** [See how to use the project as an end-user](https://docs.google.com/document/d/1j4ozzfStjZpKRbdEb5_TsOe_5c7aTdnORYG-SVAE5Ss).
- **Project dependencies:** Learn [the external dependencies of the project](/external-dependencies/).
- **Understand the codebase:** Take a look at the [project structure](/project-structure/) and browse through some code.
