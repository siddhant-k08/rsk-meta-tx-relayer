[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/rsksmart/rsk-scaffold/badge)](https://scorecard.dev/viewer/?uri=github.com/rsksmart/rsk-scaffold)
[![CodeQL](https://github.com/rsksmart/rsk-scaffold/workflows/CodeQL/badge.svg)](https://github.com/rsksmart/rsk-scaffold/actions?query=workflow%3ACodeQL)

# 🏗 Rootstock-Scaffold with Gasless Meta-Transactions

<div align="center">
<img src="packages/nextjs/public/rootstock.svg" width="200" />
</div>

<h4 align="center">
  <a href="https://dev.rootstock.io">Rootstock Documentation</a>
  | <a href="https://github.com/rsksmart/rsk-scaffold/issues">Report Issue</a>
</h4>

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

-   ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
-   🪝 **[Custom hooks](https://dev.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
-   🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
-   🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
-   🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Rootstock network.
-   ⛽ **Gasless Meta-Transactions**: EIP-712 compliant meta-transaction relayer for gasless UX on Rootstock Testnet.

![Front Page](./packages/nextjs/public/front_page.png)

## Requirements

Before you begin, you need to install the following tools:

-   [Node (>= v18.18)](https://nodejs.org/en/download/)
-   Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
-   [Git](https://git-scm.com/downloads)

## Quickstart

To get started, follow the steps below:

1. Clone this repo & install dependencies

```sh
git clone https://github.com/rsksmart/rsk-scaffold.git
```

2. Open the project directory and install dependencies

```sh
cd rsk-scaffold && yarn install
```

3. Setup `.env` file for Hardhat:

Make a copy of `.env.example` in `packages/hardhat` folder, name it `.env` and enter the respective values

```
DEPLOYER_PRIVATE_KEY=
ROOTSTOCK_RPC_URL=https://rpc.testnet.rootstock.io/YOUR_API_KEY_HERE
```

4. Deploying smart contracts on Rootstock:

Once the `.env` file is setup, you can now run the below command in your terminal.

```sh
yarn deploy
```

This command deploys a test smart contract to the Rootstock testnet network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

5. Setup `.env` file for Next.js app (optional):

Make a copy of `.env.example` in `packages/nextjs` folder, name it `.env` and enter the respective values

```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_ROOTSTOCK_RPC_URL=https://rpc.testnet.rootstock.io/YOUR_API_KEY_HERE
```

6. On a second terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

-   Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
-   Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
-   Edit your deployment scripts in `packages/hardhat/deploy`
-   Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## 🚀 Gasless Meta-Transactions

This fork extends rsk-scaffold with **EIP-712 compliant gasless meta-transactions** on Rootstock Testnet. Users can interact with smart contracts without paying gas fees by signing messages that are relayed by a backend service.

### How It Works

1. **User signs an EIP-712 message** containing transaction details (no gas required)
2. **Relayer verifies the signature** and submits the transaction on-chain
3. **Forwarder contract validates** the signature and executes the call
4. **Target contract receives** the original sender address via ERC2771Context

### Architecture

```
User Wallet → Sign EIP-712 Message → Relayer API → Forwarder Contract → Target Contract
```

**Components:**

- **Forwarder.sol**: EIP-712 compliant meta-transaction forwarder with nonce management
- **ERC2771Context.sol**: Trusted forwarder context for extracting the real sender
- **ExampleTarget.sol**: Demo contract using ERC2771Context (points system)
- **Relayer Backend**: Express.js service that validates and submits meta-transactions
- **Frontend**: Next.js UI with direct and gasless transaction options

### Setup Gasless Transactions

#### 1. Deploy Contracts

The gasless contracts are deployed automatically with `yarn deploy`:

```sh
yarn deploy
```

This deploys:
- `Forwarder.sol` - Meta-transaction forwarder
- `ExampleTarget.sol` - Demo target contract with points system

#### 2. Configure Relayer

Create `.env` file in `packages/relayer`:

```sh
cd packages/relayer
cp .env.example .env
```

Edit `.env` with:

```
PORT=3001
RELAYER_PRIVATE_KEY=your_funded_relayer_wallet_private_key
ROOTSTOCK_RPC_URL=https://rpc.testnet.rootstock.io
FORWARDER_ADDRESS=deployed_forwarder_address
EXAMPLE_TARGET_ADDRESS=deployed_example_target_address
```

**Important:** The relayer wallet must have tRBTC to pay gas fees. Get testnet tRBTC from [Rootstock Faucet](https://faucet.rootstock.io/).

#### 3. Configure Frontend

Update `packages/nextjs/.env.local`:

```
NEXT_PUBLIC_RELAYER_URL=http://localhost:3001
NEXT_PUBLIC_FORWARDER_ADDRESS=deployed_forwarder_address
NEXT_PUBLIC_EXAMPLE_TARGET_ADDRESS=deployed_example_target_address
```

#### 4. Start Relayer

In a new terminal:

```sh
yarn relayer
```

The relayer will start on `http://localhost:3001`.

#### 5. Use Gasless Demo

Visit `http://localhost:3000/gasless` to:

- **Direct Call**: Traditional transaction (you pay gas)
- **Gasless Call**: Sign EIP-712 message (relayer pays gas)

Both methods call the same contract function and achieve identical results.

### Relayer API Endpoints

- `POST /relay` - Submit a meta-transaction
- `GET /status/:txHash` - Check transaction status
- `GET /nonce/:address` - Get current nonce for an address
- `GET /health` - Health check and relayer balance

### Security Considerations

- Relayer validates all requests before submission
- Only whitelisted target contracts are allowed
- Nonce management prevents replay attacks
- Gas limits are enforced to prevent abuse
- EIP-712 signatures ensure message integrity

### Development Scripts

```sh
# Deploy all contracts
yarn deploy

# Start relayer
yarn relayer

# Start frontend
yarn start

# Run tests
yarn hardhat:test
```

## Rootstock Network Configuration

This scaffold is configured for Rootstock Testnet by default. Here are the network details:

- **Network Name**: Rootstock Testnet
- **Chain ID**: 31
- **Currency**: tRBTC (Test Rootstock Bitcoin)
- **RPC URL**: `https://rpc.testnet.rootstock.io`
- **Explorer**: `https://explorer.testnet.rootstock.io`

### Getting Rootstock Testnet tRBTC

You can get testnet tRBTC from the [Rootstock Faucet](https://faucet.rootstock.io/).

## Documentation

Visit our [Rootstock docs](https://dev.rootstock.io) to learn how to start building with Rootstock.

## Contributing

We welcome contributions from the community. Please fork the repository and submit pull requests with your changes. Ensure your code adheres to the project's main objective.

## Support

For any questions or support, please open an issue on the repository or reach out to the maintainers.

# Disclaimer

The software provided in this GitHub repository is offered "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.

- **Testing:** The software has not undergone testing of any kind, and its functionality, accuracy, reliability, and suitability for any purpose are not guaranteed.
- **Use at Your Own Risk:** The user assumes all risks associated with the use of this software. The author(s) of this software shall not be held liable for any damages, including but not limited to direct, indirect, incidental, special, consequential, or punitive damages arising out of the use of or inability to use this software, even if advised of the possibility of such damages.
- **No Liability:** The author(s) of this software are not liable for any loss or damage, including without limitation, any loss of profits, business interruption, loss of information or data, or other pecuniary loss arising out of the use of or inability to use this software.
- **Sole Responsibility:** The user acknowledges that they are solely responsible for the outcome of the use of this software, including any decisions made or actions taken based on the software's output or functionality.
- **No Endorsement:** Mention of any specific product, service, or organization does not constitute or imply endorsement by the author(s) of this software.
- **Modification and Distribution:** This software may be modified and distributed under the terms of the license provided with the software. By modifying or distributing this software, you agree to be bound by the terms of the license.
- **Assumption of Risk:** By using this software, the user acknowledges and agrees that they have read, understood, and accepted the terms of this disclaimer and assumes all risks associated with the use of this software.

To know more about Scaffold-ETH features, check out their [website](https://scaffoldeth.io).
