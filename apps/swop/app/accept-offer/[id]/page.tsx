'use client'
import React, { useEffect } from 'react'
import OfferContainer from 'ui/OfferContainer'
import { getOfferById } from '../../../../../apis/swop'
import RenderName from 'ui/RenderName';

export default function AcceptOffer({ params }: { params: { id: string } }) {
  const [offer, setOffer] = React.useState<any>(null);
  useEffect(() => {
    getOfferById(params.id).then((res) => {
      console.log(res)
      setOffer(res)
    });
  }, [params.id]);

  return (
    <>
      <h1 className='text-3xl text-center'>Thank you for choosing SWOP</h1>
      <div className='my-6'>
        <div className='flex justify-end'>
          <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>You</div>
        </div>
        <OfferContainer active={false} offers={offer?.offerA} showRemove={false} />
      </div>
      <div className='my-6'>
        <div className='flex justify-start'>
          <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>
            <RenderName address={offer?.sender} classData={''} />
          </div>
        </div>
        <OfferContainer active={false} offers={offer?.offerB} showRemove={false} />
      </div>
      <div>
        <button className='btn btn-secondary'>Accept Offer</button>
      </div>
    </>
  )
}
