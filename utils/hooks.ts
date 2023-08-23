import { useEffect, useState } from "react";
import {
  getContract,
  getNetwork,
  getWalletClient,
} from "@wagmi/core";
import { swopContractAbi, swopTestContractAddress } from "../packages/swop-config";

export const useSwopContract = () => {
  const [contract, setContract] = useState<any | null>(null);
  const network = getNetwork();

  useEffect(() => {
    const address = swopTestContractAddress;
    const contract = getContract({
      address: address,
      abi: swopContractAbi,
      walletClient: getWalletClient(),
    });
    setContract(contract);
  }, [network.chain?.id]);

  return contract;
};

export const useFee = () => {
  const network = getNetwork();
  const [fee, setFee] = useState<bigint>(0n);
  let fees = new Map<number, bigint>([
    [43114, 0n], // avalanche
  ]);

  useEffect(() => {
    setFee(fees.get(network.chain?.id || 0) || 0n);
  }, [network.chain?.id]);

  return fee;
};