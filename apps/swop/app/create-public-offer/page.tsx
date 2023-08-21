'use client'
import React, { useEffect, useState } from 'react'
import NftGrid from 'ui/NftGrid'
import { getPickassoNfts } from '../../../../apis/nfts'
import { useAccount } from 'wagmi';
import XScroll from 'ui/XScroll';

export default function CreatePublicLobby() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<any>([]);
  const [otherWallet, setOtherWallet] = useState<any>([]);
  const [viewMyWallet, setViewMyWallet] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState('');

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
    const getOtherNfts = async () => {
      getPickassoNfts(inputValue).then((nfts) => {
        setViewMyWallet(false)
        setOtherWallet(nfts)
      })
    }

    getOtherNfts();
  }

  return (
    <>
      <div className='flex justify-center items-center mb-12'>
        <span className='mr-4 text-lg'>Wallets:</span>
        <input type="text" onChange={handleInputChange} placeholder="Wallet address goes here" className="input input-bordered w-full max-w-xs" />
        <button onClick={() => walletSearch()} className="btn btn-secondary ml-4">Search</button>
      </div>
      <div className='grid grid-cols-3 space-x-8'>
        <div className='col-span-1'>
          <div className='flex justify-between items-center mb-2'>
            <details className="dropdown">
              <summary className="btn bg-neutral rounded-box py-2 px-4">Filter</summary>
              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
              </ul>
            </details>
            <button onClick={() => setViewMyWallet(true)} className='btn bg-neutral rounded-box py-2 px-4'>My Wallet</button>
          </div>
          <div className='h-3/4 overflow-y-scroll'>
            <NftGrid nfts={viewMyWallet ? nfts : otherWallet} columns={3} />
          </div>
        </div>
        <div className='col-span-2'>
          <div>
            <div className='flex justify-start'>
              <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>You</div>
            </div>
            <XScroll items={nfts} />
          </div>
          <div className='mt-32'>
            <div className='flex justify-end'>
              <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>{inputValue}</div>
            </div>
            <XScroll items={nfts} />
          </div>
          <div className='flex justify-end'>
            <button className="btn btn-secondary mt-4">Send Private Offer</button>
          </div>
        </div>
      </div>
    </>
  )
}
