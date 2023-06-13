import React from 'react'
import theme from 'theme/theme'

import 'styles/App.css'
import 'styles/Contact.css'

import 'react-calendar/dist/Calendar.css'
import 'styles/MiniCalendar.css'
import Head from 'next/head'
import { AppPropsWithLayout } from 'types/Layout'
import AppProviders from 'AppProviders'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { filecoinCalibration } from 'wagmi/chains'
// @ts-ignore
import { publicProvider } from 'wagmi/providers/public'
// @ts-ignore
import {connectorsForWallets ,RainbowKitProvider,lightTheme} from '@rainbow-me/rainbowkit'
import {injectedWallet} from '@rainbow-me/rainbowkit/wallets';


  function MyApp({
    Component,
    pageProps: { session, ...pageProps },
  }: AppPropsWithLayout) {

  const getLayout = Component.getLayout || ((page) => page)
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [filecoinCalibration],
    [publicProvider()]
  )
  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet({ chains }),
   
      ],
    },
  ]);

  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient
  })

  return (
    
    <AppProviders session={null} theme={theme}>
      <WagmiConfig config={config}>
        <RainbowKitProvider
          chains={chains}
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
       
      <Head>
        <title>Waslah</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <React.StrictMode>
        {getLayout(<Component {...pageProps} />)}
      </React.StrictMode>
      </RainbowKitProvider>
      </WagmiConfig>
      
    </AppProviders>
    
  )
}

export default MyApp
