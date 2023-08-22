import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function OfferContainer(props: { active: boolean, offers: any[], placeholderText: string }) {
  const [offers, setOffers] = useState<any>([]);
  useEffect(() => {
    if (offers.length < 6)
      setOffers(props.offers)
  }, [props.offers, offers])

  return (
    <>
      {offers.length > 0 ?
        <>
          <div className="p-6 space-x-4 bg-teal-800 rounded-box flex snap-mandatory snap-x overflow-x-scroll">
            {offers.map((offer: any, index: any) => (
              <div key={index} className="card card-compact w-36 bg-base-100 shadow-xl snap-center">
                <figure><Image src={offer.metadata.pImage} height={150} width={150} alt="NFT Image" /></figure>
                <div className="card-body">
                  <h2 className="card-title"><span className='truncate'>{offer.collectionName}</span> #{offer.tokenId}</h2>
                  <p className='truncate'>Symbol: {offer.collectionSymbol}</p>
                  {/* <div className="card-actions justify-end">
                    <button className="btn btn-primary">Remove</button>
                  </div> */}
                </div>
              </div>
            ))}
          </div >
        </>
        :
        <>
          {props.active ?
            <span className="relative block w-full rounded-lg border-2 border-dashed border-teal-600 p-12 text-center hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="mt-2 block text-sm font-semibold">{props.placeholderText}</span>
            </span >
            :
            <span className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="mt-2 block text-sm font-semibold">{props.placeholderText}</span>
            </span >
          }
        </>
      }
    </>
  )
}