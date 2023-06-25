FROM node:18-bullseye

COPY . /faucet

WORKDIR /faucet

RUN yarn
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
