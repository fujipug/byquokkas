import React from 'react'
import Image from 'next/image'

export default function Profile() {
  return (
    <div className='grid grid-cols-3'>
      <div className='col-span-1 flex items-start'>
        <div className='flex items-center'>
          <img className='rounded-full h-36 w-36 drop-shadow-md' src='http://placekitten.com/300/300' alt='Quokka' width={120} height={120} />
          <div className='ml-8'>
            <div className='text-xl'>Nobsfud</div>
            <div className='text-sm mt-2'>nobs.avax</div>
            <button className="btn mt-2">inbox</button>
          </div>
        </div>
      </div>
      <div className='col-span-2 flex space-x-2 items-center'>
        <div className="stats shadow">

          <div className="stat bg-neutral">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div className="stat-title">Total Likes</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow">

          <div className="stat bg-neutral">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">Page Views</div>
            <div className="stat-value text-secondary">2.6M</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow">

          <div className="stat bg-neutral">
            <div className="stat-figure text-secondary">
            </div>
            <div className="stat-value">86%</div>
            <div className="stat-title">Tasks done</div>
            <div className="stat-desc text-secondary">31 tasks remaining</div>
          </div>

        </div>
      </div>
    </div >
  )
}
