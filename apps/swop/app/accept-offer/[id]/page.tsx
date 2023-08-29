'use client'
import React, { use, useEffect, useState } from 'react'
import OfferContainer from 'ui/OfferContainer'
import { getOfferById } from '../../../../../apis/swop'
import RenderName from 'ui/RenderName';
import Image from 'next/image'
import { useContractWrite } from 'wagmi';
import { useSwopContract } from '../../../../../utils/hooks';
import { swopContractAbi } from '../../../../../packages/swop-config';
import { getSwapId, verifyApproval } from '../../../../../utils/contract-funtions';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../../../packages/firebase-config';
import { Offer } from '../../../types';

declare global {
  interface Window {
    nftInfoModal: any;
  }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function AcceptOffer({ params }: { params: { id: string } }) {
  const [offer, setOffer] = useState<Offer>(null);
  const [nftInfoModal, setNftInfoModal] = useState<any>();
  const [swapId, setSwapId] = useState<any>(null);
  const swopContract = useSwopContract();
  let { data, isLoading, isSuccess, write } = useContractWrite<any, any, any>({
    address: swopContract?.address,
    abi: swopContractAbi,
    functionName: 'acceptSwap',
    args: [swapId && BigInt(swapId)],
    onSuccess: (res: any) => {
      // TODO: Call read to get swapId
      console.log('sucess: ', res);
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

    getSwapId().then((swapId) => {
      console.log('swapId: ', swapId);
      setSwapId(swapId);
    });
  }, [params.id]);

  const handleInfoModal = (info: any) => {
    setNftInfoModal(info);
    window.nftInfoModal.showModal();
  }

  // Finalize and accept offer
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const handleAcceptOffer = async () => {
    const collectionBAddresses = offer.offerB.map((offer: any) => offer.collectionAddress);
    verifyApproval(collectionBAddresses, write, (isApprovalStatusLoading: boolean) => {
      setIsApprovalLoading(isApprovalStatusLoading);
    });
  }

  useEffect(() => {
    const updateViewed = async () => {
      const offerRef = doc(db, 'offers', offer.id);
      await updateDoc(offerRef, {
        viewed: true,
      });
    }

    if (offer && !offer?.viewed) {
      updateViewed();
    }
  }, [offer, offer?.id, offer?.viewed]);

  const updateFirebaseOffer = async () => {
    const offerRef = doc(db, 'offers', offer.id);
    await updateDoc(offerRef, {
      status: 'Closed',
    });
  }

  return (
    <>
      <h1 className='text-3xl text-center'>Thank you for choosing SWOP</h1>
      <div className='my-6'>
        <div className='flex justify-between items-center mb-2'>
          <div className="join items-center">
            <input type="text" placeholder="Amount (Optional)" className="join-item input bg-neutral w-full max-w-xs" />
            <div className="dropdown join-item">
              <label tabIndex={0} className="btn btn-neutral rounded-r-lg rounded-l-none ml-1 cursor-default">WAVAX</label>
              {/* <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>WAVAX</a></li>
                <li><a>WETH</a></li>
              </ul> */}
            </div>
          </div>
          <div className='flex justify-center bg-neutral rounded-box py-3 px-4 drop-shadow-md sm:w-36'>You</div>
        </div>
        <OfferContainer active={false} offers={offer?.offerA} placeholderText='Loading ...' showRemove={false} onSelectedNftEmit={handleInfoModal} />
      </div>
      <div className='my-6'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex justify-center bg-neutral rounded-box py-3 px-4 drop-shadow-md sm:w-36'>
            <RenderName address={offer?.sender} classData={''} />
          </div>
          <div className="join items-center">
            <input type="text" placeholder="Amount (Optional)" className="join-item input bg-neutral w-full max-w-xs" />
            <div className="dropdown join-item">
              <label tabIndex={0} className="btn btn-neutral rounded-r-lg rounded-l-none ml-1 cursor-default">WAVAX</label>
              {/* <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>WAVAX</a></li>
                <li><a>WETH</a></li>
              </ul> */}
            </div>
          </div>
        </div>
        <OfferContainer active={false} offers={offer?.offerB} placeholderText='Loading ...' showRemove={false} onSelectedNftEmit={handleInfoModal} />
      </div>
      <div className='flex justify-evenly items-center'>
        <button onClick={() => handleAcceptOffer()} className='btn btn-warning'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
          </svg>
          Accept Offer
        </button>
        <button className='btn btn-warning'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
          Counter Offer
        </button>
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
