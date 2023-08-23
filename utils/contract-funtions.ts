import {
  getAccount,
  getContract,
  getNetwork,
  getWalletClient,
} from "@wagmi/core";
import { nftAbi, swopTestContractAddress } from "../packages/swop-config";

export const verifyApproval = async (
  collectionAAddresses: any[],
  write: () => void,
  isApprovalStatusLoading: any,
) => {
  const network = getNetwork();
  const account = getAccount();
  const address = swopTestContractAddress;
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
      address,
    ]);
    try {
      if (!approved) {
        // @ts-ignore
        await collectionContract.write.setApprovalForAll([
          address,
          true,
        ]);

        isApprovalStatusLoading(true);
        const unwatch = collectionContract.watchEvent.ApprovalForAll(
          { from: getAccount().address },
          {
            onLogs() {
              isApprovalStatusLoading(false);
              write();
              unwatch();
            },
          },
        );
        console.log("a", unwatch);
      } else {
        write();
      }
    } catch (e) {
      console.log("approval error", e);
    }
  });
};
