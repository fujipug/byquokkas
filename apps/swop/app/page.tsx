'use client'
import Table from "ui/Table";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Offer } from "../types";
import { getOfferCount, getOffers, getMoreOffers } from "../../../apis/swop";

const tableHeaders = ['Nfts Offered', 'Offer Name', 'Creator', 'Status', 'Created At'];

// TODO: This is more of a swop only component
export default function Page() {
  const [offers, setOffers] = useState([]) as Offer[];
  const [offerCount, setOfferCount] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(false);

  // Get Offers
  useEffect(() => {
    const unsubscribe = getOffers(setOffers);
    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  // Get Offer Count
  useEffect(() => {
    async function fetchOfferCount() {
      const count = await getOfferCount();
      setOfferCount(count);
    }

    fetchOfferCount();
  }, []);

  // Show More Button
  useEffect(() => {
    (offers?.length) === offerCount ? setShowMoreButton(false) : setShowMoreButton(true);
  }, [offers?.length, offerCount]);

  const fetchMoreOffers = async () => {
    const moreOffers = await getMoreOffers();
    const fetchedOffers = setOffers([...offers, ...moreOffers]);
    (fetchedOffers?.length) < offerCount ? setShowMoreButton(true) : setShowMoreButton(false);
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
            <div className="z-10 p-6 bg-neutral rounded-box drop-shadow-md flex justify-center h-96">
            </div>
          </div>
        </div>
      </div>
      <h1 className="font-semibold text-2xl ml-3 my-2">Recent Offers</h1>
      <Table tableHeaders={tableHeaders} data={offers} />
    </>
  );
}
