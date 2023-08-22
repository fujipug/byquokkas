import React from 'react'
import Image from 'next/image'

export default function XScroll(props: { items: any }) {
  return (
    <div className="snap-mandatory snap-x flex p-6 space-x-4 bg-neutral rounded-box w-full overflow-x-scroll">
      {props.items.map((nft: any, index: number) => (
        <div key={index} className="snap-center">
          <span key={index} className="relative cursor-pointer">
            <div>
              <div className="relative group w-max">
                <>
                  {nft?.metadata?.pImage ?
                    <Image className="transform transition-transform rounded-lg drop-shadow-md outline outline-offset-1 outline-2 outline-accent group-hover:outline-success"
                      src={nft?.metadata?.pImage}
                      alt="NFT image unreachable" width={150} height={150} />
                    :
                    // No Image Available from Pickasso
                    <Image className="transform transition-transform rounded-lg drop-shadow-md outline outline-offset-1 outline-2 outline-accent group-hover:outline-success"
                      src="/images/no-image.png"
                      alt="NFT image unreachable" width={150} height={150} />}
                </>

                <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-center items-center opacity-0 transition-opacity hover:opacity-100">
                  <div className="absolute top-0 left-0 w-full h-full flex items-start justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-lg font-bold truncate px-2"># {nft.tokenId}</p>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-lg font-bold truncate px-2">{nft?.collectionName ? nft?.collectionName : nft?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
      ))}
    </div>
  )
}
