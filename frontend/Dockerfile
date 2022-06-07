# base image
FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app
RUN npm install

CMD ["npm", "start"]