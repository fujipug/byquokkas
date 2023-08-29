import { useEffect, useState } from "react";
import {
  getAccount,
  getContract,
  getNetwork,
  getWalletClient,
} from "@wagmi/core";
import { useNetwork } from "wagmi";
import {
  swopContractAbi,
  swopMainContractAddress,
} from "../packages/swop-config";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://data.staging.arkiver.net/primata/swop-events/graphql",
  // uri: "http://localhost:4000/graphql",
});

export function useUserSwaps() {
  const [swaps, setSwaps] = useState([]);
  const account = getAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    function handleChainChange() {
      let swaps;
      const query = gql`query QuerySwaps {
                  Swaps(filter: {a: "${account.address}", chain: ${chain?.id}}) {
                    swapId
                    a
                    aCollections
                    aTokenIds
                    aAmount
                    b
                    bCollections
                    bTokenIds
                    bAmount
                    toDecide
                  }
                }`;
      console.log("query", query);
      client.query({
        query: query,
      }).then((result) => {
        swaps = [...result.data.Swaps];
        setSwaps(swaps);
      }).catch((e) => {
        console.log("set a swaps error", e);
      });
    }
    handleChainChange();
  }, [chain]);
  return swaps;
}

export function usePendingSwaps() {
  const [swaps, setSwaps] = useState([]);
  const addressZero = "0x00000000000000000000000000000000";
  const { chain } = useNetwork();

  useEffect(() => {
    function handleChainChange() {
      let swaps;
      const query = gql`query QuerySwaps {
                  Swaps(filter: {toDecide: ${addressZero}, chain: ${chain?.id}}) {
                    swapId
                    a
                    aCollections
                    aTokenIds
                    aAmount
                    b
                    bCollections
                    bTokenIds
                    bAmount
                    toDecide
                  }
                }`;
      client.query({
        query: query,
      }).then((result) => {
        swaps = [...result.data.Swaps];
        setSwaps(swaps);
      }).catch((e) => {
        console.log("set blacklist error", e);
      });
    }
    handleChainChange();
  }, [chain]);
  return swaps;
}

export const useSwopContract = () => {
  const [contract, setContract] = useState<any | null>(null);
  const network = getNetwork();

  useEffect(() => {
    const address = swopMainContractAddress;
    const contract = getContract({
      address: address,
      abi: swopContractAbi,
      walletClient: getWalletClient(),
    });
    setContract(contract);
  }, [network.chain?.id]);

  return contract;
};

// export const useFee = () => {
//   const network = getNetwork();
//   const [fee, setFee] = useState<bigint>(0n);
//   let fees = new Map<number, bigint>([
//     [43114, 0n], // avalanche
//   ]);

//   useEffect(() => {
//     setFee(fees.get(network.chain?.id || 0) || 0n);
//   }, [network.chain?.id]);

//   return fee;
// };
