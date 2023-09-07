import {
  getAccount,
  getContract,
  getNetwork,
  getWalletClient,
  readContract,
} from "@wagmi/core";
import {
  nftAbi,
  swopContractAbi,
  swopMainContractAddress,
} from "../packages/swop-config";

export const verifyApproval = async (
  collectionAAddresses: any[],
  write: () => void,
  isApprovalStatusLoading: any,
) => {
  const network = getNetwork();
  const account = getAccount();
  const walletClient = await getWalletClient({
    chainId: network.chain?.id,
  });
  collectionAAddresses = collectionAAddresses.map(async (address) => {
    const collectionContract = getContract({
      address: address,
      abi: nftAbi,
      walletClient: walletClient as any,
    });
    const approved = await collectionContract.read.isApprovedForAll([
      account.address,
      swopMainContractAddress,
    ]);
    try {
      if (!approved) {
        // @ts-ignore
        await collectionContract.write.setApprovalForAll([
          swopMainContractAddress,
          true,
        ]);

        isApprovalStatusLoading(true);
        const unwatch = collectionContract.watchEvent.ApprovalForAll(
          { from: getAccount().address },
          {
            onLogs() {
              isApprovalStatusLoading(false);
              unwatch();
            },
          },
        );
        console.log("a", unwatch);
      }
    } catch (e) {
      console.log("approval error", e);
    }
  });
  write();
};

export const getSwapId = async () => {
  const swapId = await readContract({
    address: swopMainContractAddress,
    abi: swopContractAbi,
    functionName: "swapId",
  });

  return swapId;
};
