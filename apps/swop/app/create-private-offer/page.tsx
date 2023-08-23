'use client'
import React, { useEffect, useState } from 'react'
import NftGrid from 'ui/NftGrid'
import { getPickassoNfts } from '../../../../apis/nfts'
import { useAccount, useContractWrite } from 'wagmi';
import OfferContainer from 'ui/OfferContainer';
import RenderName from 'ui/RenderName';
import Image from 'next/image'
import { verifyApproval } from '../../../../utils/contract-funtions';
import { swopContractAbi } from '../../../../packages/swop-config';
import { useSwopContract, useFee } from '../../../../utils/hooks';
import { initializeApp } from "firebase/app";
import { Timestamp, addDoc, collection, getFirestore } from "firebase/firestore";
import { firebaseConfig } from '../../../../packages/firebase-config';
import { Offer } from '../../types';

//Initialize firebase backend
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

declare global {
  interface Window {
    nftInfoModal: any;
  }
}

export default function CreatePrivateOffer() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<any>([]);
  const [receiverNfts, setReceiverNfts] = useState<any>([]);
  const [viewMyWallet, setViewMyWallet] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState('');
  const [myOffers, setMyOffers] = useState<any>([]);
  const [receiverOffers, setReceiverOffers] = useState<any>([]);
  const [collectionList, setCollectionList] = useState([] as string[]);
  const [imutableNftList, setImutableNftList] = useState([] as any[]);
  const [receiverImutableNftList, setReceiverImutableNftList] = useState([] as any[]);
  const [nftInfoModal, setNftInfoModal] = useState<any>();
  const swopContract = useSwopContract();
  const fee = useFee();
  let { data, isLoading, isSuccess, write } = useContractWrite<any, any, any>({
    address: swopContract?.address,
    abi: swopContractAbi,
    functionName: 'createSwap',
    args: [
      myOffers.map((offer: any) => offer.collectionAddress), // collectionAAddresses
      myOffers.map((offer: any) => offer.numTokenId), // tokenAIds
      0, // AAmount
      receiverOffers.map((offer: any) => offer.collectionAddress), // collectionBAddresses
      receiverOffers.map((offer: any) => offer.numTokenId), // tokenBIds
      0
    ],
    value: fee,
    onSuccess: (res: any) => {
      // TODO: Call read to get swapId
      console.log('sucess: ', res);
      createFirebaseOffer();
    },
    onError(error) {
      // Display Error Message
    },
  });

  useEffect(() => {
    if (isConnected) {
      const getNfts = async () => {
        getPickassoNfts(address).then((nfts) => {
          setNfts(nfts)
          setImutableNftList(nfts)
        })
      }

      getNfts();
    }
  }, [address, isConnected])

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  }

  // TODO: Check for valid address
  const walletSearch = () => {
    const getReceiverNfts = async () => {
      getPickassoNfts(inputValue).then((nfts) => {
        setViewMyWallet(false)
        setReceiverNfts(nfts)
        setReceiverImutableNftList(nfts)
      })
    }

    setReceiverOffers([]) // Clear receiver nfts
    getReceiverNfts();
  }

  // Get dropdown list of collections filter
  useEffect(() => {
    const uniqueArray: any[] = [];
    imutableNftList?.map((item: any) => {
      if (!uniqueArray.includes(item?.collectionName ? item?.collectionName : item?.name)) {
        uniqueArray.push(item?.collectionName ? item?.collectionName : item?.name);
      }
      setCollectionList(uniqueArray);
    });
  }, [imutableNftList]);

  // Filter NFT grid by collection
  function filterCollection(collection: string) {
    const resetNftList = imutableNftList;
    if (collection !== 'all') {
      const filtered = resetNftList.filter((nft: any) => (nft?.collectionName ? nft?.collectionName : nft?.name) == collection);
      setNfts(filtered);
    } else {
      setNfts(resetNftList);
    }
  }

  // Get dropdown list of collections filter for receiver
  useEffect(() => {
    const uniqueArray: any[] = [];
    receiverImutableNftList?.map((item: any) => {
      if (!uniqueArray.includes(item?.collectionName ? item?.collectionName : item?.name)) {
        uniqueArray.push(item?.collectionName ? item?.collectionName : item?.name);
      }
      setCollectionList(uniqueArray);
    });
  }, [receiverImutableNftList]);

  // Filter NFT grid by collection for receiver
  function filterReceiverCollection(collection: string) {
    const resetNftList = receiverImutableNftList;
    if (collection !== 'all') {
      const filtered = resetNftList.filter((nft: any) => (nft?.collectionName ? nft?.collectionName : nft?.name) == collection);
      setReceiverNfts(filtered);
    } else {
      setReceiverNfts(resetNftList);
    }
  }

  const handleSelectedNft = (nft: any) => {
    // Set disabled items with a disabled flag
    let myDisabledNfts;
    if (viewMyWallet && myOffers.length < 6) {
      setMyOffers([...myOffers, nft])
      myDisabledNfts = nfts.map((original) => original.numTokenId === nft.numTokenId ? { ...original, disabled: true } : original)
      setNfts(myDisabledNfts);
    }
    if (!viewMyWallet && receiverOffers.length < 6) {
      setReceiverOffers([...receiverOffers, nft])
      myDisabledNfts = receiverNfts.map((original) => original.numTokenId === nft.numTokenId ? { ...original, disabled: true } : original)
      setReceiverNfts(myDisabledNfts);
    }
  }

  // Remove nft from the disabled list
  const handleOnRemove = (offer: any) => {
    const myFiltered = myOffers.filter((item: any) => item.numTokenId !== offer.numTokenId);
    setMyOffers(myFiltered);
    const myDisabledNfts = nfts.map((original) => original.numTokenId === offer.numTokenId ? { ...original, disabled: false } : original)
    setNfts(myDisabledNfts);

    const receiverFiltered = receiverOffers.filter((item: any) => item.numTokenId !== offer.numTokenId);
    setReceiverOffers(receiverFiltered);
    const receiverDisabledNfts = receiverNfts.map((original) => original.numTokenId === offer.numTokenId ? { ...original, disabled: false } : original)
    setReceiverNfts(receiverDisabledNfts);
  }

  const handleNftInfoModal = (nft: any) => {
    setNftInfoModal(nft)
    window.nftInfoModal.showModal()
  };

  // Finalize offer and create the offer in the blockchain
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const handleFinalizePrivateOffer = async () => {
    if (myOffers.length > 0) {
      const collectionAAddresses = myOffers.map((offer: any) => offer.collectionAddress);
      console.log(collectionAAddresses);
      verifyApproval(collectionAAddresses, write, (isApprovalStatusLoading: boolean) => {
        setIsApprovalLoading(isApprovalStatusLoading);
      });
    }
  }

  // Create Firebase offer
  const createFirebaseOffer = async () => {
    const offer: Offer = {
      sender: address,
      receiver: inputValue,
      offerA: myOffers,
      amountA: 0,
      offerB: receiverOffers,
      amountB: 0,
      status: 'Open',
      type: 'Private',
      createdAt: Timestamp.now(),
    }
    addDoc(collection(db, 'offers'), offer).then((response) => {
      // TODO: Maybe a share link to the offer
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
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
              <summary tabIndex={0} className="btn bg-neutral rounded-box py-2 px-4 drop-shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                <span>Filter</span>
              </summary>

              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 bg-base-100 rounded-box w-52 mt-2">
                {collectionList.map((collectionName: string, index: any) => (
                  <li key={index}><a onClick={() => viewMyWallet ? filterCollection(collectionName) : filterReceiverCollection(collectionName)}>{collectionName}</a></li>
                ))}
                <li><a onClick={() => viewMyWallet ? filterCollection('all') : filterReceiverCollection('all')}>Show All</a></li>
              </ul>
            </details>
            <button onClick={() => setViewMyWallet(true)} className='btn bg-neutral rounded-box py-2 px-4 drop-shadow-md'>My Wallet</button>
          </div>
          <div className='h-screen overflow-y-scroll'>
            <NftGrid nfts={viewMyWallet ? nfts : receiverNfts} onDataEmit={handleSelectedNft} />
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
            <OfferContainer active={viewMyWallet} offers={myOffers} placeholderText={'Choose up to 6 NFTs to offer'}
              onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
          </div>
          <div className='mt-8'>
            <div className='flex justify-end'>
              {!viewMyWallet ?
                <div className='flex justify-center bg-teal-800 rounded-box py-3 px-4 mb-2 drop-shadow-md w-fit'>
                  {inputValue ?
                    <RenderName address={inputValue} classData={''} />
                    :
                    <span>Receiver</span>
                  }
                </div>
                :
                <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-fit'>
                  {inputValue ?
                    <RenderName address={inputValue} classData={''} />
                    :
                    <span>Receiver</span>
                  }
                </div>
              }
            </div>
            <OfferContainer active={!viewMyWallet} offers={receiverOffers} placeholderText={'Choose up to 6 NFTs to receive'}
              onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
          </div>
          <div className='flex justify-end'>
            <button onClick={() => handleFinalizePrivateOffer()} className="btn btn-secondary mt-4 drop-shadow-md">Send Private Offer</button>
          </div>
        </div>
      </div>
      {/* You can open the modal using ID.showModal() method */}
      <dialog id="nftInfoModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 sm:space-x-6">
            <div className="col-span-1">
              <figure>
                <Image src={nftInfoModal?.metadata?.pImage ? nftInfoModal?.metadata?.pImage : 'http://placekitten.com/200/200'} className="rounded-lg drop-shadow-md"
                  width={200} height={200}
                  alt="NFT image unreachable" />
              </figure>
            </div>
            <div className="col-span-1 mt-4 sm:mt-0 flex flex-col">
              <div>
                <p><span className="font-semibold">Collection:</span> {nftInfoModal?.collectionName}</p>
                <div className="divider"></div>
                <p><span className="font-semibold">Symbol:</span> {nftInfoModal?.collectionSymbol}</p>
                <p><span className="font-semibold">Token ID:</span> {nftInfoModal?.tokenId}</p>
              </div>
            </div>
          </div >
        </form >
      </dialog>
    </>
  )
}