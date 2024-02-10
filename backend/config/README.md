# Making your Own Certificate
> [!NOTE]  
> In case chrome no longer support `#allow-insecure-localhost` flag, local development will require installing self signed certificate.

> [!WARNING]  
> Do not `git add+push` your certificates! 
> Do not expose your `key.pem` (private key)!
> `key.pem` that mkcert automatically generates gives complete power to intercept secure requests from your machine. Do not share it.


## Install [`mkcert`](https://github.com/FiloSottile/mkcert)
- Follow the [instructions](https://github.com/FiloSottile/mkcert#installation).
## Replace with your own certificate
```shell
cd ./backend/config
mkcert -install -key-file key.pem -cert-file cert.pem localhost 127.0.0.1
```
## Restart your browser and the backend server