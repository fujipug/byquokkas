'use client'
import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseConfig } from '../../../../../packages/firebase-config';
import { useSwopContract } from "../../../../../utils/hooks";
import { useAccount, useContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { getOfferById } from "../../../../../apis/swop";
import { swopContractAbi } from '../../../../../packages/swop-config'
import { Offer } from "../../../types";
import NftGrid from "ui/NftGrid";
import { getPickassoNfts } from "../../../../../apis/nfts";
import RenderName from "ui/RenderName";
import OfferContainer from "ui/OfferContainer";
import Image from "next/image";
import { getSwapById, verifyApproval } from "../../../../../utils/contract-funtions";
import { fireAction } from "../../../../../utils/functions";

//Initialize firebase backend
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

declare global {
  interface Window {
    nftInfoModal: any;
  }
}

export default function CounterOffer({ params }: { params: { id: string } }) {
  const [offer, setOffer] = useState<Offer>(null);
  const [viewMyWallet, setViewMyWallet] = useState<boolean>(true);
  const [nftInfoModal, setNftInfoModal] = useState<any>();
  const [senderNfts, setSenderNfts] = useState<any>([]);
  const [receiverNfts, setReceiverNfts] = useState<any>([]);
  const [senderImutableNftList, setSenderImutableNftList] = useState([] as any[]);
  const [receiverImutableNftList, setReceiverImutableNftList] = useState([] as any[]);
  const [collectionList, setCollectionList] = useState([] as string[]);
  const [isSenderPrevOffer, setIsSenderPrevOffer] = useState(false);
  const [isReceiverPrevOffer, setIsReceiverPrevOffer] = useState(false);
  const [senderCounterOffers, setSenderCounterOffers] = useState<any>([]);
  const [receiverCounterOffers, setReceiverCounterOffers] = useState<any>([]);
  const [stepper, setStepper] = useState(0);
  const { address, isConnected } = useAccount();
  const swopContract = useSwopContract();
  let { data, isLoading, isSuccess, write } = useContractWrite<any, any, any>({
    address: swopContract?.address,
    abi: swopContractAbi,
    functionName: 'counterSwap',
    args: [
      offer?.swapId && BigInt(offer?.swapId),
      senderCounterOffers?.length > 0 ? senderCounterOffers?.map((offer: any) => offer.collectionAddress) : offer?.offerA.map((offer: any) => offer.collectionAddress), // collectionAAddresses
      senderCounterOffers?.length > 0 ? senderCounterOffers?.map((offer: any) => offer.numTokenId) : offer?.offerA.map((offer: any) => offer.numTokenId), // tokenAIds
      0, // amountA
      receiverCounterOffers?.length > 0 ? receiverCounterOffers?.map((offer: any) => offer.collectionAddress) : offer?.offerB.map((offer: any) => offer.collectionAddress), // collectionBAddresses
      receiverCounterOffers?.length > 0 ? receiverCounterOffers?.map((offer: any) => offer.numTokenId) : offer?.offerB.map((offer: any) => offer.numTokenId), // tokenBIds
      0, // amountB
    ],
    onSuccess: (res: any) => {
      updateFirebaseOffer();
    },
    onError(error) {
      // Display Error Message
    },
  });

  useEffect(() => {
    getOfferById(params.id).then((res) => {
      setOffer(res)
    });
  }, [params.id, offer?.sender]);

  // Sender
  useEffect(() => {
    if (isConnected) {
      const getNfts = async () => {
        getPickassoNfts(offer?.sender).then((nfts) => {
          setSenderNfts(nfts)
          setSenderImutableNftList(nfts)
        })
      }

      getNfts();
    }
  }, [isConnected, offer?.sender]);

  // Receiver
  useEffect(() => {
    if (isConnected) {
      const getNfts = async () => {
        getPickassoNfts(offer?.receiver).then((nfts) => {
          setReceiverNfts(nfts)
          setReceiverImutableNftList(nfts)
        })
      }

      getNfts();
    }
  }, [isConnected, offer?.receiver]);

  // Get dropdown list of collections filter
  useEffect(() => {
    const uniqueArray: any[] = [];
    senderImutableNftList?.map((item: any) => {
      if (!uniqueArray.includes(item?.collectionName ? item?.collectionName : item?.name)) {
        uniqueArray.push(item?.collectionName ? item?.collectionName : item?.name);
      }
      setCollectionList(uniqueArray);
    });
  }, [senderImutableNftList]);

  useEffect(() => {
    const uniqueArray: any[] = [];
    receiverImutableNftList?.map((item: any) => {
      if (!uniqueArray.includes(item?.collectionName ? item?.collectionName : item?.name)) {
        uniqueArray.push(item?.collectionName ? item?.collectionName : item?.name);
      }
      setCollectionList(uniqueArray);
    });
  }, [receiverImutableNftList]);

  // Filter NFT grid by collection
  function filterSenderCollection(collection: string) {
    const resetNftList = senderImutableNftList;
    if (collection !== 'all') {
      const filtered = resetNftList.filter((nft: any) => (nft?.collectionName ? nft?.collectionName : nft?.name) == collection);
      setSenderNfts(filtered);
    } else {
      setSenderNfts(resetNftList);
    }
  }

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
    if (!viewMyWallet && senderCounterOffers.length < 6) {
      setSenderCounterOffers([...senderCounterOffers, nft])
      myDisabledNfts = senderNfts.map((original) => original.numTokenId === nft.numTokenId ? { ...original, disabled: true } : original)
      setSenderNfts(myDisabledNfts);
    }
    if (viewMyWallet && receiverCounterOffers.length < 6) {
      setReceiverCounterOffers([...receiverCounterOffers, nft])
      myDisabledNfts = receiverNfts.map((original) => original.numTokenId === nft.numTokenId ? { ...original, disabled: true } : original)
      setReceiverNfts(myDisabledNfts);
    }
  }

  // Remove nft from the disabled list
  const handleOnRemove = (offer: any) => {
    const myFiltered = senderCounterOffers.filter((item: any) => item.numTokenId !== offer.numTokenId);
    setSenderCounterOffers(myFiltered);
    const myDisabledNfts = senderNfts.map((original) => original.numTokenId === offer.numTokenId ? { ...original, disabled: false } : original)
    setSenderNfts(myDisabledNfts);

    const receiverFiltered = receiverCounterOffers.filter((item: any) => item.numTokenId !== offer.numTokenId);
    setReceiverCounterOffers(receiverFiltered);
    const receiverDisabledNfts = receiverNfts.map((original) => original.numTokenId === offer.numTokenId ? { ...original, disabled: false } : original)
    setReceiverNfts(receiverDisabledNfts);
  }

  const handleNftInfoModal = (nft: any) => {
    setNftInfoModal(nft)
    window.nftInfoModal.showModal()
  };

  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const isSender = address === offer?.sender;
  const handleCounterOffer = async () => {
    // if (senderCounterOffers.length > 0) {
    const collectionAddresses = isSender ? senderCounterOffers.map((offer: any) => offer.collectionAddress) : receiverCounterOffers.map((offer: any) => offer.collectionAddress);
    verifyApproval(collectionAddresses, write, (isApprovalStatusLoading: boolean) => {
      setIsApprovalLoading(isApprovalStatusLoading);
    });
    // } else {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    // }
  }

  const updateFirebaseOffer = async () => {
    const offerRef = doc(db, 'offers', offer.id);
    await getSwapById(offer?.swapId).then(async (res) => {
      await updateDoc(offerRef, {
        offerA: senderCounterOffers?.length > 0 ? senderCounterOffers : offer?.offerA,
        offerB: receiverCounterOffers?.length > 0 ? receiverCounterOffers : offer?.offerB,
        status: 'Pending',
        type: 'Private',
        viewed: false,
        toDecide: res[4].toLowerCase() === offer?.sender.toLowerCase() ? offer.receiver.toLowerCase() : offer.sender.toLowerCase()
      }).then(() => {
        setStepper(1);
        fireAction();
      });
    });
  }

  return (
    <>
      {stepper === 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-3 sm:space-x-8'>
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
                    <li key={index}><a onClick={() => !viewMyWallet ? filterSenderCollection(collectionName) : filterReceiverCollection(collectionName)}>{collectionName}</a></li>
                  ))}
                  <li><a onClick={() => !viewMyWallet ? filterSenderCollection('all') : filterReceiverCollection('all')}>Show All</a></li>
                </ul>
              </details>
            </div>
            <div className='h-5/6 overflow-y-scroll'>
              <NftGrid nfts={!viewMyWallet ? senderNfts : receiverNfts} onDataEmit={handleSelectedNft} />
            </div>
          </div>


          <div className='col-span-1 sm:col-span-2'>
            {!viewMyWallet ?
              <div>
                <div className='flex justify-between mb-2'>
                  <div className="join">
                    <button onClick={() => setViewMyWallet(false)} className="btn bg-teal-800 join-item hover:bg-teal-800 normal-case rounded-l-xl">
                      {address.toLowerCase() === offer?.sender.toLowerCase() ? 'You' : <RenderName address={offer?.sender} classData={''} />}
                    </button>
                    {isSenderPrevOffer ?
                      <button onClick={() => setIsSenderPrevOffer(false)} className="btn bg-teal-800 join-item normal-case rounded-r-xl">
                        New Offer
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      :
                      <button onClick={() => setIsSenderPrevOffer(true)} className="btn bg-teal-800 join-item normal-case rounded-r-xl">
                        Previous Offer
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    }
                  </div>
                </div>
                {isSenderPrevOffer ?
                  <OfferContainer active={true} offers={offer?.offerA} placeholderText={'Loading previous offer ...'} showRemove={false}
                    onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                  :
                  <OfferContainer active={true} offers={senderCounterOffers} placeholderText={'Choose up to 6 NFTs to counter swap'} showRemove={true}
                    onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                }
              </div>
              :
              <div>
                <div className='flex justify-between mb-2'>
                  <div className="join">
                    <button onClick={() => setViewMyWallet(false)} className="btn bg-neutral join-item hover:bg-neutral normal-case rounded-l-xl">
                      {address.toLowerCase() === offer?.sender.toLowerCase() ? 'You' : <RenderName address={offer?.sender} classData={''} />}
                    </button>
                    {isSenderPrevOffer ?
                      <button onClick={() => setIsSenderPrevOffer(false)} className="btn bg-neutral join-item normal-case rounded-r-xl">
                        New Offer
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      :
                      <button onClick={() => setIsSenderPrevOffer(true)} className="btn bg-neutral join-item normal-case rounded-r-xl">
                        Previous Offer
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    }
                  </div>
                </div>
                {isSenderPrevOffer ?
                  <OfferContainer active={false} offers={offer?.offerA} placeholderText={'Loading previous offer ...'} showRemove={false}
                    onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                  :
                  <OfferContainer active={false} offers={senderCounterOffers} placeholderText={'Choose up to 6 NFTs to counter swap'} showRemove={true}
                    onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                }
              </div>
            }

            <div className='mt-8'>
              {viewMyWallet ?
                <div>
                  <div className='flex justify-end mb-2'>
                    <div className="join">
                      <button onClick={() => setViewMyWallet(true)} className="btn bg-teal-800 join-item hover:bg-teal-800 normal-case rounded-l-xl px-6">
                        {address.toLowerCase() === offer?.receiver.toLowerCase() ? 'You' : <RenderName address={offer?.receiver} classData={''} />}
                      </button>
                      {isReceiverPrevOffer ?
                        <button onClick={() => setIsReceiverPrevOffer(false)} className="btn bg-teal-800 join-item normal-case rounded-r-xl">
                          New Offer
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        :
                        <button onClick={() => setIsReceiverPrevOffer(true)} className="btn bg-teal-800 join-item normal-case rounded-r-xl">
                          Previous Offer
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      }
                    </div>
                  </div>
                  {isReceiverPrevOffer ?
                    <OfferContainer active={true} offers={offer?.offerB} placeholderText={'Loading previous offer ...'} showRemove={false}
                      onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                    :
                    <OfferContainer active={true} offers={receiverCounterOffers} placeholderText={'Choose up to 6 NFTs to counter swap'} showRemove={true}
                      onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                  }
                </div>
                :
                <div>
                  <div className='flex justify-end mb-2'>
                    <div className="join">
                      <button onClick={() => setViewMyWallet(true)} className="btn bg-neutral join-item hover:bg-neutral normal-case rounded-l-xl px-6">
                        {address.toLowerCase() === offer?.receiver.toLowerCase() ? 'You' : <RenderName address={offer?.receiver} classData={''} />}
                      </button>
                      {isReceiverPrevOffer ?
                        <button onClick={() => setIsReceiverPrevOffer(false)} className="btn bg-neutral join-item normal-case rounded-r-xl">
                          New Offer
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        :
                        <button onClick={() => setIsReceiverPrevOffer(true)} className="btn bg-neutral join-item normal-case rounded-r-xl">
                          Previous Offer
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      }
                    </div>
                  </div>
                  {isReceiverPrevOffer ?
                    <OfferContainer active={false} offers={offer?.offerB} placeholderText={'Loading previous offer ...'} showRemove={false}
                      onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                    :
                    <OfferContainer active={false} offers={receiverCounterOffers} placeholderText={'Choose up to 6 NFTs to counter swap'} showRemove={true}
                      onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                  }
                </div>
              }
            </div>
            <div className='flex justify-end'>
              <button onClick={() => handleCounterOffer()} className="btn btn-warning mt-4 drop-shadow-md">
                {isLoading || isApprovalLoading ?
                  <span className="loading loading-spinner loading-md"></span>
                  :
                  <span>Send Counter Offer</span>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {stepper === 1 && (
        <div className='bg-neutral rounded-box py-3 px-4 drop-shadow-md'>
          <h1 className="font-semibold text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Counter Offer Sent</h1>
          <div className="text-lg flex items-center justify-center leading-8">
            A notification has been sent to: &nbsp;
            <RenderName address={address === offer?.sender ? offer?.receiver : offer?.sender} classData="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500" />
          </div>
          <p className='text-center text-md'>You will be notified if they accept your offer or provide a counter offer.</p>
        </div>
      )}

      {/* You can open the modal using ID.showModal() method */}
      <dialog id="nftInfoModal" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 sm:space-x-6">
            <div className="col-span-1">
              <figure>
                <Image src={nftInfoModal?.metadata?.pImage ? nftInfoModal?.metadata?.pImage : '/images/no-image.png'} className="rounded-lg drop-shadow-md"
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
