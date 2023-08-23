import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface ChildProps {
  active: boolean,
  offers: any[],
  placeholderText?: string
  showRemove: boolean,
  onDataEmit?: (data: any) => void;
  onSelectedNftEmit?: (data: any) => void;
}

export default function OfferContainer({ active, offers, placeholderText, showRemove, onDataEmit, onSelectedNftEmit }: ChildProps) {
  const [parentOffers, setParentOffers] = useState<any>([]);

  useEffect(() => {
    if (offers?.length < 6)
      setParentOffers(offers)
  }, [offers, parentOffers])

  const handleSelectedNftInfo = (offer: any) => {
    if (onSelectedNftEmit) onSelectedNftEmit(offer)
  }

  const handleOnRemove = (offer: any) => {
    if (onDataEmit) onDataEmit(offer);
  }

  return (
    <>
      {offers?.length > 0 ?
        <>
          {active ?
            <div className="p-6 space-x-4 bg-teal-800 rounded-box flex snap-mandatory snap-x overflow-x-scroll drop-shadow-md">
              {offers.map((offer: any, index: any) => (
                <div key={index} className="card card-compact w-40 bg-base-100 shadow-xl snap-center">
                  <figure onClick={() => handleSelectedNftInfo(offer)} className='cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="w-5 h-5 absolute right-2 top-2 bg-base-200 rounded-full cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <Image src={offer.metadata.pImage} height={200} width={200} alt="NFT Image" />
                  </figure>
                  <div className="card-body w-40">
                    {showRemove &&
                      <span onClick={() => handleOnRemove(offer)} className='text-red-500 flex items-center justify-center -ml-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </span>
                    }
                  </div>
                </div>
              ))}
            </div >
            :
            <div className="p-6 space-x-4 bg-neutral rounded-box flex snap-mandatory snap-x overflow-x-scroll drop-shadow-md">
              {offers.map((offer: any, index: any) => (
                <div key={index} className="card card-compact w-40 bg-base-100 shadow-xl snap-center">
                  <figure onClick={() => handleSelectedNftInfo(offer)} className='cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="w-5 h-5 absolute right-2 top-2 bg-base-200 rounded-full cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <Image src={offer.metadata.pImage} height={200} width={200} alt="NFT Image" />
                  </figure>
                  <div className="card-body w-40">
                    {showRemove &&
                      <span onClick={() => handleOnRemove(offer)} className='text-red-500 flex items-center justify-center -ml-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </span>
                    }
                  </div>
                </div>
              ))}
            </div >
          }
        </>
        :
        <>
          {active ?
            <span className="relative block w-full rounded-lg border-2 border-dashed border-teal-600 p-24 text-center hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="mt-2 block text-sm font-semibold">{placeholderText}</span>
            </span >
            :
            <span className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-24 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="mt-2 block text-sm font-semibold">{placeholderText}</span>
            </span >
          }
        </>
      }
    </>
  )
}