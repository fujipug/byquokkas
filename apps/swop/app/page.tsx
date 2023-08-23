'use client'
import Table from "ui/Table";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Offer } from "../types";
import { getPublicOfferCount, getPublicOffers, getMorePublicOffers, getPrivateOffers, getPrivateOfferCount } from "../../../apis/swop";

const tableHeaders = ['Nfts Offered', 'Offer Name', 'Creator', 'Status', 'Created At'];

// TODO: This is more of a swop only component
export default function Page() {
  const [publicOffers, setPublicOffers] = useState([]) as Offer[];
  const [publicOfferCount, setPublicOfferCount] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [privateOffers, setPrivateOffers] = useState([]) as Offer[];
  const [privateOfferCount, setPrivateOfferCount] = useState(0);

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
    const unsubscribe = getPrivateOffers(setPrivateOffers);
    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  // Get Private Offer Count
  useEffect(() => {
    async function fetchPrivateOfferCount() {
      const count = await getPrivateOfferCount();
      setPrivateOfferCount(count);
    }

    fetchPrivateOfferCount();
  }, []);

  // Show More Button
  useEffect(() => {
    (privateOffers?.length) === privateOfferCount ? setShowMoreButton(false) : setShowMoreButton(true);
  }, [privateOffers?.length, privateOfferCount]);

  const handleButtonClick = (e, offerId) => {
    console.log('offerId', offerId);
    e.stopPropagation(); // Prevent event propagation
    window.location.href = `/accept-offer/${offerId}`;
  };

  return (
    <>
      <div className="bg-base-200">
        <div className="grid grid-cols-3 item-center mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 sm:py-12 px-4 drop-shadow-md">
          <div className="col-span-1 space-y-5 flex items-center">
            <div className="space-y-5">
              <Link href="/create-public-offer" className="btn btn-secondary drop-shadow-md">Create a public offfer</Link>
              <Link href="/create-private-offer" className="btn btn-secondary drop-shadow-md">Create a private offer</Link>
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-2xl sm:text-3xl">My Offers</label>
            <div className="z-0 transform animate-moveUpDown -mt-4 ml-36 fixed"><Image src="/images/Face_2.png" alt="Quokka Face" width={200} height={200}></Image></div>
            <div className="z-30 -mt-7 ml-36 fixed"><Image src="/images/Hands_2.png" alt="Quokka Hands" width={200} height={200}></Image></div>
            <div className="z-10 p-6 bg-neutral rounded-box drop-shadow-md h-96 space-y-2 overflow-y-scroll">
              {privateOffers?.map((offer, index) => (
                <div key={index} className="collapse bg-base-200">
                  <input type="radio" name="private-offers" />
                  <div className="collapse-title flex items-center justify-between">
                    <div className="flex items-center">
                      {offer?.offerA?.map((nft: any, index: number) => (
                        <Image key={index} className="rounded-lg mr-2 border-solid border-2 border-primary drop-shadow-md" src={nft?.metadata?.pImage} width={75} height={75} alt="Nft Image" />
                      ))}
                    </div>
                    <button onClick={e => handleButtonClick(e, offer.id)} className="btn btn-secondary z-50">See Offer</button>
                  </div>
                  <div className="collapse-content">
                    <div className="flex items-center">
                      {offer?.offerB?.map((nft: any, index: number) => (
                        <Image key={index} className="rounded-lg mr-2 border-solid border-2 border-secondary drop-shadow-md" src={nft?.metadata?.pImage} width={75} height={75} alt="Nft Image" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <h1 className="font-semibold text-2xl ml-3 my-2">Recent Public Offers</h1>
      <Table tableHeaders={tableHeaders} data={publicOffers} />
    </>
  );
}
