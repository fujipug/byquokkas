import { useAccount } from 'wagmi';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import CustomConnectButton from './CustomConnectButton';

interface ChildProps {
  nfts: any;
  onDataEmit?: (data: any) => void;
}

export default function NftGrid({ nfts, onDataEmit }: ChildProps) {
  const [nftsFromParent, setNftsFromParent] = useState<any>([]);
  const { address, isConnected } = useAccount();
  const handleNftSelect = (nft: any) => {
    if (onDataEmit) onDataEmit(nft);
  }

  useEffect(() => {
    setNftsFromParent(nfts);
  }, [nfts])

  return (
    <>
      {(!address && !isConnected && nftsFromParent) ?
        <div className="bg-neutral rounded-box p-5 drop-shadow-md mb-6 sm:mb-0">
          <h1 className="font-semibold text-xl mb-4 text-center">Sign into your wallet to continue</h1>
          <div className="w-full flex justify-center">
            <CustomConnectButton />
          </div>
        </div>
        :
        <div className="flex justify-center bg-neutral rounded-box p-5 drop-shadow-md">
          {address && isConnected && nftsFromParent && nftsFromParent?.length > 0 ?
            <span role="list" className="grid grid-cols-3 gap-x-3 gap-y-3">
              {nftsFromParent?.map((nft: any, index: any) => (
                <span id={nft.tokenId} onClick={() => !nft.disabled && handleNftSelect(nft)} key={index} className="relative cursor-pointer">
                  <div>
                    <div className="relative group">
                      <>
                        {nft?.metadata?.pImage ?
                          <Image className="transform transition-transform rounded-lg drop-shadow-md outline outline-offset-1 outline-2 outline-warning group-hover:outline-success"
                            src={nft?.metadata?.pImage}
                            alt="NFT image unreachable" width={150} height={150} />
                          :
                          // No Image Available from Pickasso
                          <Image className="transform transition-transform rounded-lg drop-shadow-md outline outline-offset-1 outline-2 outline-warning group-hover:outline-success"
                            src="/images/no-image.png"
                            alt="NFT image unreachable" width={150} height={150} />
                        }
                      </>
                      {nft.disabled ?
                        <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex justify-center items-center opacity-100">
                          <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center opacity-100">
                            <p className="text-white text-md font-bold truncate px-2">Selected</p>
                          </div>
                        </div>
                        :
                        <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-center items-center opacity-0 transition-opacity hover:opacity-100">
                          <div className="absolute top-0 left-0 w-full h-full flex items-start justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-lg font-bold truncate px-2"># {nft.tokenId}</p>
                          </div>
                          <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-lg font-bold truncate px-2">{nft?.collectionName ? nft?.collectionName : nft?.name}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </span>
              ))}
            </span>
            :
            <div className='flex items-center'>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                <h1 className="font-semibold text-xl mb-4 text-center">This wallet has no NFTs</h1>
              </div>
            </div>
          }
        </div>
      }

    </>
  )
}