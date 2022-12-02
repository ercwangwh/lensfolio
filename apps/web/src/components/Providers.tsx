import { ApolloProvider } from "@apollo/client";
// import { IS_MAINNET, RPC_URL } from 'data/constants';
// import { ThemeProvider } from 'next-themes';

import type { ReactNode } from "react";
// import { CHAIN_ID } from 'src/constants';
// import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
// import { InjectedConnector } from 'wagmi/connectors/injected';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { ThemeProvider, useTheme } from "next-themes";
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { ThemeOptions } from "@rainbow-me/rainbowkit/dist/themes/baseTheme";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { IS_MAINNET, LENSTUBE_APP_NAME, POLYGON_RPC_URL } from "utils";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import client from "../apollo";

// const { chains, provider } = configureChains(
//   [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
//   [jsonRpcProvider({ rpc: () => ({ http: RPC_URL }) })]
// );

// const connectors = () => {
//   return [
//     new InjectedConnector({
//       chains,
//       options: { shimDisconnect: true },
//     }),
//     new WalletConnectConnector({
//       chains,
//       options: { rpc: { [CHAIN_ID]: RPC_URL } },
//     }),
//   ];
// };

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai, chain.polygon],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: POLYGON_RPC_URL,
      }),
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      coinbaseWallet({ appName: LENSTUBE_APP_NAME, chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);

// const { connectors } = getDefaultWallets({
//   appName: "Web",
//   chains,
// });

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// Enables usage of theme in RainbowKitProvider
const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const themeOptions: ThemeOptions = {
    fontStack: "system",
    overlayBlur: "small",
    accentColor: "#6366f1",
  };
  return (
    <RainbowKitProvider
      modalSize="compact"
      chains={chains}
      theme={
        theme === "dark" ? darkTheme(themeOptions) : lightTheme(themeOptions)
      }
    >
      {children}
    </RainbowKitProvider>
  );
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <RainbowKitProviderWrapper>
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </RainbowKitProviderWrapper>
      </ThemeProvider>
    </WagmiConfig>
  );
};

export default Providers;
