'use client'
import React, { useEffect, useState } from 'react'
import NftGrid from 'ui/NftGrid'
import { getPickassoNfts } from '../../../../apis/nfts'
import { useAccount, useContractWrite } from 'wagmi';
import OfferContainer from 'ui/OfferContainer';
import Image from 'next/image'
import { getSwapId, verifyApproval } from '../../../../utils/contract-funtions';
import { swopContractAbi } from '../../../../packages/swop-config';
import { useSwopContract } from '../../../../utils/hooks';
import { initializeApp } from "firebase/app";
import { Timestamp, addDoc, collection, getFirestore } from "firebase/firestore";
import { firebaseConfig } from '../../../../packages/firebase-config';
import { Offer } from '../../types';
import { fireAction, maskDecimalInput } from '../../../../utils/functions';

//Initialize firebase backend
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

declare global {
  interface Window {
    nftInfoModal: any;
  }
}

export default function CreatePublicOffer() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<any>([]);
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [myOffers, setMyOffers] = useState<any>([]);
  const [collectionList, setCollectionList] = useState([] as string[]);
  const [imutableNftList, setImutableNftList] = useState([] as any[]);
  const [nftInfoModal, setNftInfoModal] = useState<any>();
  const [showError, setShowError] = useState<boolean>(false);
  const [inputAAmountValue, setInputAAmountValue] = useState('');
  const swopContract = useSwopContract();
  let { data, isLoading, isSuccess, write } = useContractWrite<any, any, any>({
    address: swopContract?.address,
    abi: swopContractAbi,
    functionName: 'createPublicSwap',
    args: [
      myOffers.map((offer: any) => offer.collectionAddress), // collectionAAddresses
      myOffers.map((offer: any) => offer.numTokenId), // tokenAIds
      inputAAmountValue ? BigInt(inputAAmountValue) : 0, // AAmount
    ],
    onSuccess: (res: any) => {
      console.log('sucess: ', res);
      getSwapId().then((swapId) => {
        console.log('swapId: ', swapId);
        const updatedSwapId = Number(swapId) + 1;
        createFirebaseOffer(updatedSwapId);
      })
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

  const handleTextAreaChange = (e: any) => {
    setTextAreaValue(e.target.value);
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

  // Finalize offer and create the offer in the blockchain
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const handleFinalizePublicOffer = async () => {
    if (myOffers.length > 0) {
      const collectionAAddresses = myOffers.map((offer: any) => offer.collectionAddress);
      verifyApproval(collectionAAddresses, write, (isApprovalStatusLoading: boolean) => {
        setIsApprovalLoading(isApprovalStatusLoading);
      });
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }

  // Create Firebase offer
  const createFirebaseOffer = async (swapId) => {
    const offer: Offer = {
      swapId: swapId,
      sender: address,
      offerA: myOffers,
      amountA: inputAAmountValue ? Number(inputAAmountValue) : 0,
      offerName: inputValue && inputValue,
      description: textAreaValue && textAreaValue,
      status: 'Open',
      type: 'Public',
      createdAt: Timestamp.now(),
    }
    addDoc(collection(db, 'offers'), offer).then((response) => {
      // TODO: Maybe a share link to the offer
      fireAction();
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  const handleInputAAmountChange = (event) => {
    const newValue = event.target.value;
    const maskedValue = maskDecimalInput(newValue);
    setInputAAmountValue(maskedValue);
  };

  return (
    <>
      {showError &&
        <div className="z-50 toast toast-center toast-middle">
          <div className="alert alert-error">
            <span>Sender must have at least 1 NFT.</span>
          </div>
        </div>
      }
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
          </div>
          <div className='h-5/6 overflow-y-scroll'>
            <NftGrid nfts={nfts} onDataEmit={handleSelectedNft} />
          </div>
        </div>
        <div className='col-span-1 sm:col-span-2'>
          <div>
            <div className='flex justify-between items-center mb-2'>
              <div className='flex justify-center bg-teal-800 rounded-box py-3 px-4 drop-shadow-md sm:w-36'>You</div>
              <div className="join items-center">
                <input type="text" value={inputAAmountValue} onChange={handleInputAAmountChange} placeholder="Amount (Optional)" className="join-item input bg-teal-800 w-full max-w-xs" />
                <div className="dropdown join-item">
                  <label tabIndex={0} className="btn bg-teal-800 rounded-r-lg rounded-l-none ml-1 cursor-default">WAVAX</label>
                  {/* <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>WAVAX</a></li>
                <li><a>WETH</a></li>
              </ul> */}
                </div>
              </div>
            </div>
            <OfferContainer active={true} offers={myOffers} placeholderText={'Choose up to 6 NFTs to offer'} showRemove={true}
              onDataEmit={handleOnRemove} onSelectedNftEmit={handleNftInfoModal} />
          </div>
          <div className='mt-8'>
            <div className='flex justify-end items-center mb-4'>
              <input onChange={handleInputChange} type="text" placeholder="Lobby name (optional)" className="input input-bordered w-full max-w-lg" />
            </div>
            <div className='flex justify-end items-center'>
              <textarea onChange={handleTextAreaChange} className="textarea textarea-bordered w-full max-w-lg" placeholder="Description of your offer. What are you looking for? (optional)"></textarea>
            </div>
          </div>
          <div className='flex justify-end'>
            <button onClick={() => handleFinalizePublicOffer()} className="btn btn-warning mt-4 drop-shadow-md">Create Public Offer</button>
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