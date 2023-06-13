
import Layout from 'layouts/Layout';
// @ts-ignore
import { ConnectButton  } from '@rainbow-me/rainbowkit';
import { NextPageWithLayout } from 'types/Layout'


const connections:NextPageWithLayout  = () => {


  return (
    
        <ConnectButton  chainStatus="name"  />
         
  );
};

connections.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default connections;
