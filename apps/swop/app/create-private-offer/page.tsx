'use client'
import React, { useEffect, useState } from 'react'
import NftGrid from 'ui/NftGrid'
import { getPickassoNfts } from '../../../../apis/nfts'
import { useAccount } from 'wagmi';
import XScroll from 'ui/XScroll';
import OfferContainer from 'ui/OfferContainer';

export default function CreatePrivateOffer() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<any>([]);
  const [receiverWallet, setReceiverWallet] = useState<any>([]);
  const [viewMyWallet, setViewMyWallet] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState('');
  // const [myContainerActive, setMyContainerActive] = useState<boolean>(true);
  const [myOffers, setMyOffers] = useState<any>([]);
  const [receiverOffers, setReceiverOffers] = useState<any>([]);

  useEffect(() => {
    if (isConnected) {
      const getNfts = async () => {
        getPickassoNfts(address).then((nfts) => {
          setNfts(nfts)
        })
      }

      getNfts();
    }
  }, [address, isConnected])

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  }

  const walletSearch = () => {
    const getReceiverNfts = async () => {
      getPickassoNfts(inputValue).then((nfts) => {
        setViewMyWallet(false)
        setReceiverWallet(nfts)
      })
    }

    getReceiverNfts();
  }

  const handleSelectedNft = (nft: any) => {
    if (myOffers.length < 6) setMyOffers([...myOffers, nft])
  }

  return (
    <>
      <div className='flex justify-center items-center mb-12'>
        <span className='mr-4 text-lg'>Search Wallet:</span>
        <input type="text" onChange={handleInputChange} placeholder="Ex: 0x00000000000000" className="input input-bordered w-full max-w-xs" />
        <button onClick={() => walletSearch()} className="btn btn-secondary ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Search
        </button>
      </div>
      <div className='grid grid-cols-3 space-x-8'>
        <div className='col-span-1'>
          <div className='flex justify-between items-center mb-2'>
            <details className="dropdown">
              <summary className="btn bg-neutral rounded-box py-2 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                Filter
              </summary>
              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
              </ul>
            </details>
            <button onClick={() => setViewMyWallet(true)} className='btn bg-neutral rounded-box py-2 px-4'>My Wallet</button>
          </div>
          <div className='h-screen overflow-y-scroll'>
            <NftGrid nfts={viewMyWallet ? nfts : receiverWallet} onDataEmit={handleSelectedNft} />
          </div>
        </div>
        <div className='col-span-2'>
          <div>
            <div className='flex justify-start'>
              {viewMyWallet ?
                <div className='flex justify-center bg-teal-800 rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>You</div>
                :
                <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>You</div>
              }
            </div>
            <OfferContainer active={viewMyWallet} offers={myOffers} placeholderText={'Choose up to 6 NFTs to offer'} />
          </div>
          <div className='mt-8'>
            <div className='flex justify-end'>
              {!viewMyWallet ?
                <div className='flex justify-center bg-teal-800 rounded-box py-3 px-4 mb-2 drop-shadow-md w-fit'>{inputValue ? inputValue : 'Reciever'}</div>
                :
                <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-fit'>{inputValue ? inputValue : 'Reciever'}</div>
              }
            </div>
            <OfferContainer active={!viewMyWallet} offers={receiverOffers} placeholderText={'Choose up to 6 NFTs to receive'} />
          </div>
          <div className='flex justify-end'>
            <button className="btn btn-secondary mt-4">Send Private Offer</button>
          </div>
        </div>
      </div>
    </>
  )
}
