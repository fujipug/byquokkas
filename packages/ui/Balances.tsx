import { useEffect, useState } from "react";
import {
    getNetwork,
    getContract,
    getWalletClient,
    getAccount
} from "@wagmi/core";

import { wavaxAddress, wavaxAbi } from "../swop-config";

export const Balances = () => {
    const [balance, setBalance] = useState<bigint[]>([0n, 0n]);
    const [walletClient, setWalletClient] = useState<any>(null);
    const { chain } = getNetwork();
    const account = getAccount();

    const wavaxContract = getContract({
        address: wavaxAddress,
        abi: wavaxAbi,
        walletClient: walletClient as any,
    });
    useEffect(() => {
        async function retrieveWalletClient() {
            const client = await getWalletClient();
            setWalletClient(client);
        }
        async function handleChainChange() {
            if (walletClient) {
                const avaxBalance = await walletClient.read.getBalance([
                    account.address,
                ]);
                const wavaxBalance = await wavaxContract.read.balanceOf([
                    account.address,
                ]);
                setBalance([avaxBalance, wavaxBalance]);
            }
        }
        handleChainChange();
        retrieveWalletClient();
    }, [account, chain]);

    return balance;
};