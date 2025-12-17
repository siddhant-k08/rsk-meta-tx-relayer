import { defineChain } from "viem";

// TODO: Add Chain details here.
export const rootstockTestnet = defineChain({
  id: 31,
  name: "Rootstock Testnet",
  nativeCurrency: { name: "Rootstock", symbol: "tRBTC", decimals: 18 },
  rpcUrls: {
    default: {
      // TODO: Add Rootstock RPC URL
      http: [process.env.NEXT_PUBLIC_ROOTSTOCK_RPC_URL || "https://rpc.testnet.rootstock.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Rootstock Testnet Explorer",
      // TODO: Add Explorer URL
      url: "https://explorer.testnet.rootstock.io",
    },
  },
});
