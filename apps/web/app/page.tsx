'use client'
import { useEffect, useState } from "react";
import Table from "ui/Table";
import { Offer } from "../../swop/types";
import { getPublicOffers } from "../../../apis/swop";
import Link from "next/link";

const swopTableHeaders = ['Nfts Offered', 'Offer Name', 'Creator', 'Status', 'Created At'];
const rabbleTableHeaders = ['Nfts Offered', 'Offer Name', 'Creator', 'Status', 'Created At'];

export default function Page() {
  const [publicOffers, setPublicOffers] = useState([]) as Offer[];

  // Get Public Offers
  useEffect(() => {
    const unsubscribe = getPublicOffers(setPublicOffers);
    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl text-center">Welcome to ByQuokkas</h1>

      <a href="https://rabblerabble.xyz">
        <button className="btn btn-lg rounded-2xl bg-neutral text-5xl w-full pt-5 pb-16 my-8">RABBLE RABBLE</button>
      </a>

      <Link href="/swop" className="btn btn-lg rounded-2xl bg-neutral text-5xl w-full pt-5 pb-16">SWOP</Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-12">
        <div className="cols-span-1">
          <span>RABBLE RABBLE LOBBIES</span>
        </div>
        <div className="cols-span-1">
          <h1 className="font-semibold text-2xl ml-3 my-2">Recent Public Offers</h1>
          <Table tableHeaders={swopTableHeaders} data={publicOffers} />
        </div>
      </div>
    </>
  );
}
