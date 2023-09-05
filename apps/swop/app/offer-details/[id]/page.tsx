'use client'
import React, { useEffect, useState } from 'react'
import NftGrid from 'ui/NftGrid'
import { getPickassoNfts } from '../../../../../apis/nfts'
import { useAccount, useContractWrite } from 'wagmi';
import OfferContainer from 'ui/OfferContainer';
import RenderName from 'ui/RenderName';
import Image from 'next/image'
import { verifyApproval } from '../../../../../utils/contract-funtions';
import { swopContractAbi } from '../../../../../packages/swop-config';
import { useSwopContract } from '../../../../../utils/hooks';
import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseConfig } from '../../../../../packages/firebase-config';
import { Offer } from '../../../types';
import { getOfferById } from '../../../../../apis/swop';
import { fireAction, maskDecimalInput } from '../../../../../utils/functions';

//Initialize firebase backend
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

declare global {
  interface Window {
    nftInfoModal: any;
  }
}

export default function OfferDetails({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<any>([]);
  const [myOffers, setMyOffers] = useState<any>([]);
  const [senderAddress, setSenderAddress] = useState<string>('');
  const [senderOffers, setSenderOffers] = useState<any>([]);
  const [collectionList, setCollectionList] = useState([] as string[]);
  const [imutableNftList, setImutableNftList] = useState([] as any[]);
  const [nftInfoModal, setNftInfoModal] = useState<any>();
  const [details, setDetails] = useState<any>();
  const [inputBAmountValue, setInputBAmountValue] = useState('');
  const swopContract = useSwopContract();
  const [stepper, setStepper] = useState(() => 0);
  let { data, isLoading, isSuccess, write } = useContractWrite<any, any, any>({
    address: swopContract?.address,
    abi: swopContractAbi,
    functionName: 'counterSwap',
    args: [
      details?.swapId,
      senderOffers?.map((offer: any) => offer.collectionAddress), // collectionAAddresses
      senderOffers?.map((offer: any) => offer.numTokenId), // tokenAIds
      details?.amountA ? BigInt(details?.amountA) : 0,
      myOffers?.map((offer: any) => offer.collectionAddress), // collectionBAddresses
      myOffers?.map((offer: any) => offer.numTokenId), // tokenBIds
      inputBAmountValue ? BigInt(inputBAmountValue) : 0
    ],
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
    getOfferById(params.id).then((res: Offer) => {
      setDetails(res)
      setSenderAddress(res?.sender)
      setSenderOffers(res?.offerA)
    });
  }, [params.id]);

  useEffect(() => {
    if (isConnected) {
      const getNfts = async () => {
        getPickassoNfts(address).then((nfts) => {
          setNfts(nfts)
          setImutableNftList(nfts)
        })
      }

      setMyOffers([]);
      getNfts();
    }
  }, [address, isConnected])

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

  const handleSelectedNft = (nft: any) => {
    // Set disabled items with a disabled flag
    let myDisabledNfts;
    if (myOffers.length < 6) {
      setMyOffers([...myOffers, nft])
      myDisabledNfts = nfts.map((original) => original.numTokenId === nft.numTokenId ? { ...original, disabled: true } : original)
      setNfts(myDisabledNfts);
    }
  }

  // Remove nft from the disabled list
  const handleOnRemove = (offer: any) => {
    const myFiltered = myOffers.filter((item: any) => item.numTokenId !== offer.numTokenId);
    setMyOffers(myFiltered);
    const myDisabledNfts = nfts.map((original) => original.numTokenId === offer.numTokenId ? { ...original, disabled: false } : original)
    setNfts(myDisabledNfts);
  }

  const handleNftInfoModal = (nft: any) => {
    setNftInfoModal(nft)
    window.nftInfoModal.showModal()
  };

  // Finalize offer request
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const handleOfferRequest = async () => {
    if (myOffers.length > 0) {
      const collectionBAddresses = myOffers.map((offer: any) => offer.collectionAddress);
      verifyApproval(collectionBAddresses, write, (isApprovalStatusLoading: boolean) => {
        setIsApprovalLoading(isApprovalStatusLoading);
      });
    }
  }

  // Create Firebase offer request
  const createFirebaseOffer = async () => {
    const offerRef = doc(db, 'offers', params.id);
    await updateDoc(offerRef, {
      receiver: address,
      offerB: myOffers,
      amountB: inputBAmountValue ? Number(inputBAmountValue) : 0,
      status: 'Pending',
      type: 'Private',
      pubToPri: true,
      viewed: false
    }).then(() => {
      setStepper(1);
      fireAction();
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });;
  }

  const handleInputBAmountChange = (event) => {
    const newValue = event.target.value;
    const maskedValue = maskDecimalInput(newValue);
    setInputBAmountValue(maskedValue);
  };

  return (
    <>
      {stepper === 0 &&
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
                    <li key={index}><a onClick={() => filterCollection(collectionName)}>{collectionName}</a></li>
                  ))}
                  <li><a onClick={() => filterCollection('all')}>Show All</a></li>
                </ul>
              </details>
              <span className='bg-neutral rounded-box py-3 px-4 drop-shadow-md'>My Wallet</span>
            </div>
            <div className='h-5/6 overflow-y-scroll'>
              {/* Hydration errors */}
              <NftGrid nfts={nfts} onDataEmit={handleSelectedNft} />
            </div>
          </div>
          <div className='col-span-1 sm:col-span-2'>
            <div>
              <div className='flex justify-between mb-2'>
                <div className='flex justify-center bg-neutral rounded-box py-3 px-4 drop-shadow-md w-fit'>
                  <RenderName address={senderAddress} classData={''} />
                </div>
                {/* {details?.amountA !== 0 &&
                  <div className="hidden join items-center">
                    <div className='flex justify-center bg-neutral rounded-l-lg rounded-r-none py-3 px-4 drop-shadow-md w-fit'>
                      <span>{details?.amountA}</span>
                    </div>
                    <div className="dropdown join-item">
                      <label tabIndex={0} className="btn bg-neutral rounded-r-lg rounded-l-none ml-1 cursor-default">WAVAX</label>
                 
                    </div>
                  </div>
                } */}
              </div>
              <OfferContainer active={false} offers={senderOffers} placeholderText={'Choose up to 6 NFTs to receive'} showRemove={false}
                onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
            </div>
            <div className='mt-8'>
              <div className='flex justify-end mb-2'>
                {/* <div className="hidden join items-center">
                  <input type="text" value={inputBAmountValue} onChange={handleInputBAmountChange} placeholder="Amount (Optional)" className="join-item input bg-teal-800 w-full max-w-xs" />
                  <div className="dropdown join-item">
                    <label tabIndex={0} className="btn bg-teal-800 rounded-r-lg rounded-l-none ml-1 cursor-default">WAVAX</label>
                   
                  </div>
                </div> */}
                {address !== details?.sender ?
                  <div className='flex justify-center bg-teal-800 rounded-box py-3 px-4 drop-shadow-md sm:w-36'>You</div>
                  :
                  <div className='flex justify-center bg-red-800 rounded-box py-3 px-4 drop-shadow-md sm:w-36'>You</div>
                }
              </div>
              {address !== details?.sender ?
                <OfferContainer active={true} offers={myOffers} placeholderText={'Choose up to 6 NFTs to offer'} showRemove={true}
                  onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
                :
                <span className="relative block w-full rounded-lg border-2 border-dashed border-red-600 p-24 text-center hover:red-teal-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>

                  <span className="mt-2 block text-sm font-semibold">Find someone else to SWOP with</span>
                </span >
              }
            </div>
            <div className='flex justify-end'>
              {address !== details?.sender ?
                <button onClick={() => handleOfferRequest()} className="btn btn-warning mt-4 drop-shadow-md">Send Offer Request</button>
                :
                <button onClick={() => handleOfferRequest()} disabled className="btn btn-error mt-4 drop-shadow-md">Send Offer Request</button>
              }
            </div>
          </div>
        </div>
      }

      {stepper === 1 &&
        <div className='bg-neutral rounded-box py-3 px-4 drop-shadow-md'>
          <h1 className="font-semibold text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Private Offer Sent</h1>
          <div className="text-lg flex items-center justify-center leading-8">
            A notification has been sent to: &nbsp;
            <RenderName address={senderAddress} classData="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500" />
          </div>
          <p className='text-center text-md'>You will be notified if they accept your offer or provide a counter offer.</p>
        </div>
      }

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
