'use client';
import { useEffect, useState } from 'react'
// import { useUserSwaps } from '../../../../utils/hooks';
import { useAccount, useContractWrite } from 'wagmi';
import RenderName from 'ui/RenderName';
import { getCounterOffers, getSentOffers } from '../../../../apis/swop';
import Image from 'next/image';
import { cancelSwap, verifyApproval } from '../../../../utils/contract-funtions';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { fireAction } from '../../../../utils/functions';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../../packages/firebase-config';
import { swopContractAbi } from '../../../../packages/swop-config';
import { useSwopContract } from '../../../../utils/hooks';
import { Offer } from '../../types';

//Initialize firebase backend
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const [sentOffers, setSentOffers] = useState([]);
  const [counterOffers, setCounterOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  // const userSwaps = useUserSwaps();
  const swopContract = useSwopContract();
  const { address } = useAccount();
  let { data, isLoading, isSuccess, write } = useContractWrite<any, any, any>({
    address: swopContract?.address,
    abi: swopContractAbi,
    functionName: 'acceptSwap',
    args: [(selectedOffer && selectedOffer?.swapId) && BigInt(selectedOffer?.swapId)],
    onSuccess: (res: any) => {
      updateFirebaseOffer(selectedOffer.id);
    },
    onError(error) {
      // Display Error Message
    },
  });

  useEffect(() => {
    if (address) {
      const unsubscribe = getSentOffers(address, setSentOffers);
      return () => {
        unsubscribe(); // Clean up the listener when the component unmounts
      };
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      const unsubscribe2 = getCounterOffers(address, setCounterOffers);
      return () => {
        unsubscribe2(); // Clean up the listener when the component unmounts
      };
    }
  }, [address]);

  const handleCancelOffer = (swapId: number, offerId: string) => {
    cancelSwap(swapId).then(() => {
      cancelFirebaseOffer(offerId);
    }).catch((err) => {
      console.log('err', err);
    })
  }

  // Finalize and accept offer
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const handleAcceptOffer = (offer) => {
    setSelectedOffer(offer);
    const collectionBAddresses = offer.offerB.map((offer: any) => offer.collectionAddress);
    verifyApproval(collectionBAddresses, write, (isApprovalStatusLoading: boolean) => {
      setIsApprovalLoading(isApprovalStatusLoading);
    });
  }

  const cancelFirebaseOffer = async (offerId: string) => {
    const offerRef = doc(db, 'offers', offerId);
    await updateDoc(offerRef, {
      status: 'Cancelled',
      type: null
    }).then(() => {
      fireAction();
    });
  }

  const updateFirebaseOffer = async (offerId: string) => {
    const offerRef = doc(db, 'offers', offerId);
    await updateDoc(offerRef, {
      status: 'Accepted',
      type: null
    }).then(() => {
      fireAction();
    });
  }

  return (
    <>
      <div className='grid-cols-1 sm:flex sm:grid-cols-3 sm:justify-center sm:space-x-12'>
        <div className='col-span-1 flex justify-center mb-6 sm:mb-0'>
          <div className='flex items-center'>
            <img className='rounded-full h-36 w-36 drop-shadow-md' src='http://placekitten.com/300/300' alt='Quokka' width={120} height={120} />
            <div className='ml-8'>
              <div className='text-xl'>
                <RenderName address={address} classData={''} />
              </div>
              <div className="badge badge-primary badge-outline mt-2">Big Pug</div>
              {/* <button className="btn mt-2">inbox</button> */}
            </div>
          </div>
        </div>
        {/* <div className='col-span-1 sm:col-span-2 flex space-x-2 items-center sm:justify-center'>
          <div className="stats shadow">

            <div className="stat bg-neutral">
              <div className="stat-title">Offers Sent</div>
              <div className="stat-value text-warning">25</div>
            </div>
          </div>
          <div className="stats shadow">

            <div className="stat bg-neutral">
              <div className="stat-title">Offers Accepted</div>
              <div className="stat-value text-warning">12</div>
            </div>
          </div>
        </div> */}
      </div >

      <div className='flex justify-evenly mt-24'>
        {activeTab === 0 ?
          <>
            <div className="indicator">
              <span className="indicator-item badge badge-warning">{sentOffers?.length}</span>
              <button onClick={() => setActiveTab(0)} className="btn btn-outline btn-warning">Sent & Pending</button>
            </div>
            <div className="indicator">
              <span className="indicator-item badge">{counterOffers?.length}</span>
              <button onClick={() => setActiveTab(1)} className="btn btn-outline">Offer Inbox</button>
            </div>
          </>
          :
          <>
            <div className="indicator">
              <span className="indicator-item badge">{sentOffers?.length}</span>
              <button onClick={() => setActiveTab(0)} className="btn btn-outline">Sent & Pending</button>
            </div>
            <div className="indicator">
              <span className="indicator-item badge badge-warning">{counterOffers?.length}</span>
              <button onClick={() => setActiveTab(1)} className="btn btn-outline btn-warning">Offer Inbox</button>
            </div>
          </>
        }
      </div >

      {/* Sent & Pending */}
      {
        activeTab === 0 && (
          <>
            {sentOffers?.map((offer, index) => (
              <div key={index} className="p-6 space-x-4 bg-base-300 rounded-box drop-shadow-md mt-6">
                <div className="w-full border-opacity-50">
                  <div className="grid h-20 card bg-base-300 rounded-box px-4">
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        {offer?.offerA?.map((nft: any, index: number) => (
                          <div key={index} className="rounded-md bg-gradient-to-b from-yellow-400 to-orange-500 p-0.5 mr-2 drop-shadow-md">
                            <Image key={index} className="rounded-md" src={nft?.metadata?.pImage ? nft?.metadata?.pImage : "/images/no-image.png"} width={75} height={75} alt="Nft Image" />
                          </div>
                        ))}
                      </div>
                      <div className='flex items-center'>
                        <div>
                          <button onClick={() => handleCancelOffer(offer.swapId, offer.id)} className="btn btn-outline block">Cancel Offer</button>
                        </div>
                        {/* <button className="btn btn-warning rounded-full ml-2 cursor-default">{offer.status}</button> */}
                      </div>
                    </div>

                  </div>
                  <div className="divider text-sm my-1">Swap for your</div>
                  <div className="grid h-20 card bg-base-300 rounded-box px-4">
                    <div className='flex items-center'>
                      {offer?.offerB?.map((nft: any, index: number) => (
                        <div key={index} className="rounded-md bg-gradient-to-b from-yellow-400 to-orange-500 p-0.5 mr-2 drop-shadow-md">
                          <Image key={index} className="rounded-md" src={nft?.metadata?.pImage ? nft?.metadata?.pImage : "/images/no-image.png"} width={75} height={75} alt="Nft Image" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div >
            ))}
          </>
        )
      }

      {/* Offer Inbox */}
      {
        activeTab === 1 && (
          <>
            {counterOffers?.map((offer, index) => (
              <div key={index} className="p-6 space-x-4 bg-base-300 rounded-box drop-shadow-md mt-6">
                <div className="w-full border-opacity-50">
                  <div className="grid h-20 card bg-base-300 rounded-box px-4">
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        {offer?.offerA?.map((nft: any, index: number) => (
                          <div key={index} className="rounded-md bg-gradient-to-b from-yellow-400 to-orange-500 p-0.5 mr-2 drop-shadow-md">
                            <Image key={index} className="rounded-md" src={nft?.metadata?.pImage ? nft?.metadata?.pImage : "/images/no-image.png"} width={75} height={75} alt="Nft Image" />
                          </div>
                        ))}
                      </div>
                      <div className='flex items-center'>
                        <div>
                          <button onClick={() => handleAcceptOffer(offer)} className="btn btn-neutral block mb-2">Accept Offer</button>
                          <button onClick={() => handleCancelOffer(offer.swapId, offer.id)} className="btn btn-outline block">Cancel Offer</button>
                        </div>
                        {/* <button className="btn btn-warning rounded-full ml-2 cursor-default">{offer.status}</button> */}
                      </div>
                    </div>
                  </div>
                  <div className="divider text-sm my-8">Swap for your</div>
                  <div className="grid h-20 card bg-base-300 rounded-box px-4">
                    <div className='flex items-center'>
                      {offer?.offerB?.map((nft: any, index: number) => (
                        <div key={index} className="rounded-md bg-gradient-to-b from-yellow-400 to-orange-500 p-0.5 mr-2 drop-shadow-md">
                          <Image key={index} className="rounded-md" src={nft?.metadata?.pImage ? nft?.metadata?.pImage : "/images/no-image.png"} width={75} height={75} alt="Nft Image" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div >
            ))}
          </>
        )
      }
    </>
  )
}
