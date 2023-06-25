#!/bin/bash

set -o errexit
#set -o xtrace

cd /faucet

yarn prisma migrate deploy
yarn start
