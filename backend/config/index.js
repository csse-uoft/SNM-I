const isDocker = process.env.DOCKER;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction)
  console.log('In production mode.')

module.exports = {
  graphdb: {
    addr: isProduction ? 'http://localhost:7200' : `http://${isDocker ? 'host.docker.internal' : 'localhost'}:7200`,
  },
  mongodb: {
    addr: isProduction ? 'mongodb://localhost:27017/snmi' : `mongodb://localhost:27017/${process.env.test ? "snmiTest" : "snmi"}`
  },

  allowedOrigins: ['http://localhost:3000', 'http://localhost:3002'],

  frontend: {
    addr: isProduction ? 'https://www.mixedusebydesign.com' : 'http://localhost:3000'
  },

  // pbkdf2 configuration, ~70ms with this config
  passwordHashing: {
    digest: 'sha512',
    iterations: 100000, // 100,000 is sufficient
    hashSize: 64, // in bytes
    saltSize: 32  // in bytes
  },

  cookieSession: {
    keys: ['secret', 'keys'],
    maxAge: 24 * 60 * 60 * 1000 // expires in 24 hours
  },

  // For generating registration email verification token
  jwtConfig: {
    secret: 'secret keys',
    options: {expiresIn: 60 * 60 * 24} // 24 hour
  },

  mailConfig: {
    from: process.env.MAIL_SENDER || 'no-reply@example.com',
    mailServer: {
      host:  process.env.MAIL_HOST || 'example.com',
      port: process.env.MAIL_PORT || 25,
      auth: {
        user: process.env.MAIL_USERNAME || 'username@example.com',
        pass: process.env.MAIL_PASSWORD || 'password'
      },
      forceTLS: true,
    },
  },

};
