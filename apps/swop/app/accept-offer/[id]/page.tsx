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
        <OfferContainer active={false} offers={offer?.offerA} placeholderText='Loading ...' showRemove={false} />
      </div>
      <div className='my-6'>
        <div className='flex justify-start'>
          <div className='flex justify-center bg-neutral rounded-box py-3 px-4 mb-2 drop-shadow-md w-36'>
            <RenderName address={offer?.sender} classData={''} />
          </div>
        </div>
        <OfferContainer active={false} offers={offer?.offerB} placeholderText='Loading ...' showRemove={false} />
      </div>
      <div className='flex justify-evenly items-center'>
        <button className='btn btn-secondary'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
          </svg>
          Accept Offer
        </button>
        <button className='btn btn-secondary'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
          Counter Offer
        </button>
      </div>
    </>
  )
}
