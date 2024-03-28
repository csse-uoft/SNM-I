---
title: Project setup
---

## Installing dependencies
The project requires [NodeJS](https://nodejs.org/en) and
[Docker](https://www.docker.com/products/docker-desktop/). If you are on Windows, you will also need to install [Git](https://git-scm.com/downloads), as it is not pre-installed.

:::tip

**Mac OS:**


If you use [Homebrew](https://brew.sh/) on MacOS,
the easiest way to install them would be through
```sh
brew install node
brew install --cask docker
```

**Windows:**


Install the NodeJS and Docker desktop apps:


* [https://nodejs.org/en](https://nodejs.org/en) 
* [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)


Download the installer for the latest version of each desktop app. Make sure that you are downloading the Windows installer, and that the installer is for your correct Windows version (e.g. 32-bit, 64-bit). You may check your Windows bit version in the "About" section of your Settings app.
:::


**Setting up Yarn:**


We use [`yarn`](https://yarnpkg.com/) for managing Node packages.
Check that you have it by opening the command line (or Powershell on Windows) and run the following command:
```sh
yarn -v
```
If the command is invalid, then Yarn is not installed yet. You may run the installation command in the same terminal window using:
```sh
npm install -g yarn
```

## First Time Project Setup:
1. Clone the GitHub repository:

**Using the Terminal:**


Ensure that you are inside of the directory where you want to close the Repository in a terminal or Powershell window. Enter in the following Git command:
```sh
git clone --depth=1 https://github.com/csse-uoft/SNM-I
```
**Using GitHub Desktop:**


If you have the [GitHub Desktop app](https://desktop.github.com/):
* Click the "Current Repository" section on the top left of the window.
* On the drop-down menu, click "Add".
* Click "Clone Repository".
* Under "csee-uoft", select the "csse-uoft/SNM-I" repository.
* Edit the path where you would like to clone the repository and click "Clone".


2. Install Node dependencies in both the `frontend/` and `backend/` directories:
In a terminal or Powershell window, navigate to the repository directory. Enter the following commands:
```sh
cd SNM-I/frontend
yarn install
cd ../backend
yarn install
```

3. Server Credentials:
You should receive a `.env` file with the server credentials.
Place it inside of `backend/`.

4. Allow self-signed localhost certificates on your browser and restart the browser:
  * **Google Chrome:** enable `chrome://flags/#temporary-unexpire-flags-m118` and then `chrome://flags/#allow-insecure-localhost`
  * **Mozilla Firefox:** Go to Preferences → Privacy & Security → View certificates →
    Servers → Add Exception → add `localhost:5000`
  * If the `#allow-insecure-localhost` flag is not available to you, please follow the instructions [here](https://github.com/csse-uoft/SNM-I/tree/master/backend/config)

5. Create the mongoDB and graphDB Docker containers:


First, start the docker daemon.


**Using the Docker Desktop App:**

If you installed [Docker Desktop](https://www.docker.com/products/docker-desktop/) (eg. `brew install --cask docker`, or through the installer),
open the Docker app to start the daemon.

**Using the Terminal (Linux and MacOS):**

Alternatively, you can start it in the command line by running `dockerd` as root
or through your service manager:
```sh
sudo dockerd # keep this running, or
systemctl start docker # if you use systemd, or
sudo service docker start # if you use open-rc
```


Create the Docker containers with the following commands:

**Using the Terminal (Linux and MacOS):**

```sh
docker create -p 127.0.0.1:7200:7200 --name graphdb --restart unless-stopped -t ontotext/graphdb:10.0.2 --GDB_HEAP_SIZE=6G -Dgraphdb.workbench.maxUploadSize=2097152000
docker create --name mongo -p 27017:27017 ––restart unless-stopped -d mongo:latest
```

**Using the Terminal (Windows Powershell):**

```sh
docker create -p 127.0.0.1:7200:7200 --name graphdb --restart unless-stopped -t ontotext/graphdb:10.0.2 --GDB_HEAP_SIZE=6G -Dgraphdb.workbench.maxUploadSize=2097152000
docker run --name mongo -p 27017:27017 --restart unless-stopped -d mongo:latest
```

Note that the only difference between the Linux/MacOS and Windows installation in the command line is that the second command uses `docker run` instead of `docker create`. Windows Powershell does not recognize the `-d` flag for the `docker create` command.


:::note
In the instruction, The Docker container names in the instructions (after `--name`) in the instructions are named `graphdb` and `mongo` respectively by convention. While you may name them however you like, ensure that these containers are easily distinguishable from each other.
:::

:::tip[For Apple M series users]
The performance of GraphDB might be faster on the
[ontotext client](https://www.ontotext.com/products/graphdb/graphdb-free/) instead of the docker container.
:::

## Running in production
### Backend
1. Start the Docker daemon (see above).
2. Start the Docker containers, either through the [Docker Desktop App](https://www.docker.com/products/docker-desktop/) or by running `docker start graphdb mongo` in the terminal/Powershell  (use the names from earlier).
The graphdb interface should start on port 7200.
3. Run `yarn start` in the `backend/` directory using the terminal/powershell.
The server should start on port 8080.

### Frontend
1. Run `yarn start` in the `frontend/` directory using the terminal/Powershell.
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
Make sure you log in every time you restart the frontend/backend, even if you are seeing the dashboards.
If you are getting error 403, it’s likely because you bypassed the login wall with your browser's cached pages and aren't actually authorized.
:::

## Next steps
Congratulations! You have finished setting up the project for development! 🥳🥳

Below are other resources that you may want to consult:

* **Project goals:** Learn more about [the business and functional requirements of the project](/reference/requirements/).
* **User's manual:** [See how to use the project as an end-user](https://docs.google.com/document/d/1j4ozzfStjZpKRbdEb5_TsOe_5c7aTdnORYG-SVAE5Ss).
* **Project dependencies:** Learn [the external dependencies of the project](/external-dependencies/).
* **Understand the codebase:** Take a look at the [project structure](/project-structure/) and browse through some code.
