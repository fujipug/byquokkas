'use client'
import Table from "ui/Table";
import Image from "next/image";
import Link from "next/link";
import { getAccount } from "@wagmi/core";
import { useEffect, useState } from "react";
import { Offer } from "../types";
import { getPublicOfferCount, getPublicOffers, getMorePublicOffers, getPrivateOffers, getPrivateOfferCount } from "../../../apis/swop";
import { fireAction } from "../../../utils/functions";

const tableHeaders = ['Nfts Offered', 'Offer Name', 'Creator', 'Status', 'Created At'];

// TODO: This is more of a swop only component
export default function Page() {
  const [publicOffers, setPublicOffers] = useState([]) as Offer[];
  const [publicOfferCount, setPublicOfferCount] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [privateOffers, setPrivateOffers] = useState([]) as Offer[];
  const [privateOfferCount, setPrivateOfferCount] = useState(0);
  const account = getAccount();

  // Get Public Offers
  useEffect(() => {
    const unsubscribe = getPublicOffers(setPublicOffers);
    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  // Get Public Offer Count
  useEffect(() => {
    async function fetchPublicOfferCount() {
      const count = await getPublicOfferCount();
      setPublicOfferCount(count);
    }

    fetchPublicOfferCount();
  }, []);

  // Show More Button
  useEffect(() => {
    (publicOffers?.length) === publicOfferCount ? setShowMoreButton(false) : setShowMoreButton(true);
  }, [publicOffers?.length, publicOfferCount]);

  const fetchMorePublicOffers = async () => {
    const morePublicOffers = await getMorePublicOffers();
    const fetchedPublicOffers = setPublicOffers([...publicOffers, ...morePublicOffers]);
    (fetchedPublicOffers?.length) < publicOfferCount ? setShowMoreButton(true) : setShowMoreButton(false);
  };

  // Get Private Offers
  useEffect(() => {
    if (account && account?.address) {
      const unsubscribe = getPrivateOffers(account?.address, setPrivateOffers);
      return () => {
        unsubscribe(); // Clean up the listener when the component unmounts
      };
    }
  }, [account, account?.address]);

  // Get Private Offer Count
  useEffect(() => {
    async function fetchPrivateOfferCount() {
      const count = await getPrivateOfferCount(account?.address);
      setPrivateOfferCount(count);
    }

    fetchPrivateOfferCount();
  }, [account?.address]);

  const handleButtonClick = (e, offerId) => {
    e.stopPropagation(); // Prevent event propagation
    window.location.href = `/accept-offer/${offerId}`;
  };

  return (
    <>
      <div className="bg-base-200">
        <div className="grid grid-cols-3 item-center mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 sm:py-12 px-4 drop-shadow-md">
          <div className="col-span-1 space-y-5 flex">
            <div className="space-y-5 block">
              <div>
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a onClick={() => fireAction()} className="inline-flex space-x-6 cursor-pointer">
                    <div className="badge badge-outline p-3">What&apos;s new</div>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6">
                      <span>Just shipped Beta v1.0  🎉</span>
                    </span>
                  </a>
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SWOP</span> With A Partner</h1>
              </div>
              <div><Link href="/create-public-offer" className="btn btn-secondary drop-shadow-md">Create a public offfer</Link></div>
              <div><Link href="/create-private-offer" className="btn btn-secondary drop-shadow-md">Create a private offer</Link></div>
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-2xl sm:text-3xl">My Offers</label>
            {/* Chat Bubble */}
            <div className="z-0 transform animate-moveUpDown ml-80 fixed">
              <div className="chat chat-start">
                <div className="chat-bubble border">Swap with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">ZERO</span> fees!</div>
              </div>
            </div>
            <div className="z-0 transform animate-moveUpDown -mt-4 ml-36 fixed">
              <Image src="/images/Face_2.png" alt="Quokka Face" width={200} height={200}></Image>
            </div>
            <div className="z-30 -mt-7 ml-36 fixed"><Image src="/images/Hands_2.png" alt="Quokka Hands" width={200} height={200}></Image></div>
            <div className="z-10 p-6 bg-neutral rounded-box drop-shadow-md h-96 space-y-2 overflow-y-scroll">
              {privateOffers?.map((offer, index) => (
                <div key={index} className="indicator w-full">
                  {!offer?.viewed &&
                    <span className="indicator-item indicator-start badge badge-secondary ml-2">New</span>
                  }
                  <div className="collapse bg-base-200">
                    <input type="radio" name="private-offers" />
                    <div className="collapse-title flex items-center justify-between">
                      <div className="flex items-center">
                        {offer?.offerA?.map((nft: any, index: number) => (
                          <Image key={index} className="rounded-lg mr-2 border-solid border-2 border-primary drop-shadow-md" src={nft?.metadata?.pImage ? nft?.metadata?.pImage : "/images/no-image.png"} width={75} height={75} alt="Nft Image" />
                        ))}
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                        </svg>

                        <button onClick={e => handleButtonClick(e, offer.id)} className="btn btn-secondary z-50">See Offer</button>
                      </div>
                    </div>
                    <div className="collapse-content -mt-4">
                      <div className="divider my-1 text-sm">Swap for your</div>
                      <div className="flex items-center">
                        {offer?.offerB?.map((nft: any, index: number) => (
                          <Image key={index} className="rounded-lg mr-2 border-solid border-2 border-secondary drop-shadow-md" src={nft?.metadata?.pImage ? nft?.metadata?.pImage : "/images/no-image.png"} width={75} height={75} alt="Nft Image" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div >
      <h1 className="font-semibold text-2xl ml-3 my-2">Recent Public Offers</h1>
      <Table tableHeaders={tableHeaders} data={publicOffers} />
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center pl-2" aria-hidden="true">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-end">
          <span className="bg-base-100 pl-2 text-sm">
            <span className="badge badge-outline mr-2">
              {publicOffers?.length}/{publicOfferCount}
            </span></span>
        </div>
      </div>
      {
        showMoreButton &&
        <div className="flex justify-center my-2">
          <button onClick={() => fetchMorePublicOffers()} className="btn btn-outline btn-primary">Load More</button>
        </div>
      }
    </>
  );
}
