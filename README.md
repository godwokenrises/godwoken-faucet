# Godwoken Faucet

![screenshot-20230607-111345](https://github.com/lee920217/godwoken-faucet/assets/11926244/cfd7b9e4-eadf-4f9d-b8f5-7381e88aac0a)


The Faucet is built using [React](https://reactjs.org/) and [Next.js](https://www.nextjs.com).

## How to usage

1. Add and update .env file:
```
mv .env.example .env
```

```env
AXON_FAUCET_REQUIRED_CONFIRMATIONS=10
AXON_FAUCET_CLAIM_VALUE=1000000000000000000

AXON_FAUCET_RPC_URL=<your_axon_rpc_url>
AXON_FAUCET_CHAIN_ID=<your_axon_chain_id>

AXON_FAUCET_MONGODB_URL=<mongodb_url_with_password>
AXON_FAUCET_MONGODB_DB=<mongodb_table_name>
AXON_FAUCET_MONGODB_PASSWORD=<mongodb_password>

AXON_FAUCET_MONGODB_TRANSACTIONS_COLLECTION=Transactions
AXON_FAUCET_MONGODB_ADDRESSES_COLLECTION=Addresses
```

2. launch via Docker Compose:
```bash
docker compose up
```

3. Mnemonic initialization
```bash
curl http://localhost:8502/api/import-mnemonic?mnemonic=test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20junk
```

## Contributing 

To contribute to the Axon Faucet, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/axonweb3/axon-faucet.git
```

2. Install the dependencies:
> We use [Yarn](https://yarnpkg.com/) as our package manager.

```bash
npm install yarn -g
yarn install
```

3. Add and update .env file:
```
mv .env.example .env
```

```env
AXON_FAUCET_REQUIRED_CONFIRMATIONS=10
AXON_FAUCET_CLAIM_VALUE=1000000000000000000

AXON_FAUCET_RPC_URL=<your_axon_rpc_url>
AXON_FAUCET_CHAIN_ID=<your_axon_chain_id>

AXON_FAUCET_MONGODB_URL=<mongodb_url_with_password>
AXON_FAUCET_MONGODB_DB=<mongodb_table_name>
AXON_FAUCET_MONGODB_PASSWORD=<mongodb_password>

AXON_FAUCET_MONGODB_TRANSACTIONS_COLLECTION=Transactions
AXON_FAUCET_MONGODB_ADDRESSES_COLLECTION=Addresses
```

3. Start the development server:

```bash
yarn dev
```

4. Mnemonic initialization
```bash
curl http://localhost:3000/api/import-mnemonic?mnemonic=test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20junk
```

5. Open your browser and go to [http://localhost:3000/](http://localhost:3000/) to see the website in action.

## Contributing

We welcome contributions from the community.

## License

Axon Website is open-source software licensed under the MIT license.
