---
title: Deployment Guide
---

# Deploy to any server
A push to the relative branch triggers the GitHub Actions to compile the frontend, and run tests if existed.
Then it ssh into the remote server to executive a sequence of commands to update the code & compiled frontend.

## Things you might what to know
- Docker and how to install Docker Engine
- Understand Docker Compose
- GitHub Actions and GitHub Workflow file
- GitHub Secrets/variables to store credentials/configurations
- How to set up SSH with the private key
- How to preconfigure the SSH `know_hosts` in an CI environment
- How to ssh and execute commands on a remote server in an CI environment
- Use rsync to synchronize files to remote servers
- How to host static files (compiled react frontend) in Caddy
- How to use iptables to do a port forward (In the server that hosts a reverse proxy)

## GitHub Secrets and Variable to Set up

We will go through each of the variables/secrets.

| KEY                     | Example Value                                      | Variable or Secret? |
|-------------------------|----------------------------------------------------|---------------------|
| RELEASE_SSH_HOST        | 206.12.97.46                                       | Variable            |
| RELEASE_SSH_KNOWN_HOSTS | [206.12.97.46]:14572 ecdsa-sha2-nistp256 AAAAE2... | Variable            |
| RELEASE_SSH_PORT        | 14572                                              | Variable            |
| RELEASE_SSH_USER        | ubuntu                                             | Variable            |
| RELEASE_SSH_PRIVATE_KEY | -----BEGIN OPENSSH PRIVATE KEY-----\nb3Blbn....    | **Secret**          |


## Remote Servers Overview
We will initialize a server for SNM-I and set up an automatic deployment from GitHub Actions.

This setup assumes the SNM-I deployment server is behind a reverse proxy,
we also need to set up ssh port forwarding on the reverse proxy to make the ssh server accessible from the public.

The following example assumes:
- The SNM-I is hosted on the subdomain `beta.socialneedsmarketplace.ca`.
- SNM-I server has an internal IP **192.168.41.202**.
- Reverse proxy server has an internal IP **192.168.41.156** and external IP **206.12.97.46**.


### SSH port forward
ssh to `206.12.97.46:14572` goes directly into the SNM-I server.
```text
---------------------         ------------------------ 
| SNM-I Server      |         | Reverse Proxy Server | 
| 192.168.41.202:22 |   <->   | 192.168.41.156:14572 | 
|                   |         | 206.12.97.46:14572   |    <->   Internet
---------------------         ------------------------
```

### Webserver reverse proxy

#### Frontend includes docs
The compiled frontend and docs are hosted on port 80.
```text
beta.socialneedsmarketplace.ca -> 192.168.41.202:80
```

#### Backend API
The Node.js Backend opens a port 5000 for api calls.
```text
beta.socialneedsmarketplace.ca/api/* -> 192.168.41.202:5000
```


## SNM-I Server Preparations
Recommended OS: Ubuntu 22.04 or above

### Setup Docker
> Follow the [official guide](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install the latest version
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Create an `.env` in the root directory `~/` that specifies the correct email server and graphdb server location & credentials. 

### Generate SSH KEY on Remote Server
```shell
ssh-keygen
```
Output:
```text
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ubuntu/.ssh/id_rsa
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub
...
```
### Add to `authorized_keys`
This authorizes the generated key.
```shell
cat ./.ssh/id_rsa.pub >> ./.ssh/authorized_keys
```
### Copy the private key `id_rsa` to GitHub Secret
```shell
cat ./.ssh/id_rsa
```
Output:
```text
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
...
-----END OPENSSH PRIVATE KEY-----
```
1. Navigate to "SNM-I Repo Setting" -> "Security" -> "Secrets and variables" -> "Actions" -> ["Secrets"](https://github.com/csse-uoft/SNM-I/settings/secrets/actions).
1. Click "New repository secret"
1. Set the name to `RELEASE_SSH_PRIVATE_KEY` and copy the whole private key to the secret field.


### Set up ssh port forwarding on **Reverse Proxy Server**
> The following command should be executed on the reverse proxy server.
Consider the following setup:
```text
---------------------         ------------------------ 
| Deployment Server |         | Reverse Proxy Server | 
| 192.168.41.202:22 |   <->   | 192.168.41.156:14572 | 
|                   |         | 206.12.97.46:14572   |    <->   Internet
---------------------         ------------------------
```
Deployment Server has a private IP `192.168.41.202`, where the reverse proxy has a private IP `192.168.41.156` and a public IP `206.12.97.46`.
Our goal is to set up a port forward, that forward the all requests made from the internet to `206.12.97.46:14572`, goes to the deployment server `192.168.41.202:22`

Port `14572` can be changed to any other port; Port `22` is ssh.


Enable port forward
```shell
sudo nano /etc/sysctl.conf
```
Add `net.ipv4.ip_forward = 1` to the bottom. Apply the change.
```shell
sysctl -p
```


Add `PREROUTING` and `POSTROUTING` rules to `iptables`:
```shell
# ens3 is the network interface that has the public ip
# Forward all requests of 206.12.97.46:14572 to 192.168.41.202:22
sudo iptables -t nat -A PREROUTING -i ens3 -p tcp --dport 14572 -j DNAT --to-destination 192.168.41.202:22
sudo iptables -t nat -A POSTROUTING -d 192.168.41.202 -p tcp --dport 22 -j SNAT --to-source 192.168.41.156
```
Make the iptables config persistent.
```shell
sudo apt update && sudo apt install iptables-persistent
sudo sh -c '/sbin/iptables-save > /etc/iptables/rules.v4'
```

### Set `RELEASE_SSH_KNOWN_HOSTS`
If the ssh port forward is correctly configured, you can generate the `known_hosts` by:
```shell
ssh-keyscan -p 14572 -t ecdsa-sha2-nistp256 206.12.97.46
```
Output (The second line is `RELEASE_SSH_KNOWN_HOSTS`)
```text
# 206.12.97.46:14572 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6
[206.12.97.46]:14572 ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBBxpcp7MHTdVfkaFHitfrRdvmXBXDLC+s4FcFb75oaAmxPAj2FeEEwRRaVv0/jXhiaPqsHl92OdY2xiRVHkZsMM=
```
1. Navigate to "SNM-I Repo Setting" -> "Security" -> "Secrets and variables" -> "Actions" -> ["Variables"](https://github.com/csse-uoft/SNM-I/settings/variables/actions).
1. Click "New repository variable"
1. Set the name to `RELEASE_SSH_KNOWN_HOSTS` and copy the whole line to the secret field.

### Set Other Variables
Add the following Variables as well according to how you ssh to the remote server by using port forwarding:
- `RELEASE_SSH_HOST`: 206.12.97.46
- `RELEASE_SSH_PORT`: 14572
- `RELEASE_SSH_USER`: ubuntu

## Add GitHub Workflow
https://github.com/csse-uoft/SNM-I/blob/master/.github/workflows/release.yml
Remember to change the branch name:
```yml
on:
  push:
    branches: [ master ]
```