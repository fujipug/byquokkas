'use client';
import { useState } from 'react'
import Image from 'next/image'

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className='grid-cols-1 sm:flex sm:grid-cols-3 sm:justify-center sm:space-x-12'>
        <div className='col-span-1 flex justify-center mb-6 sm:mb-0'>
          <div className='flex items-center'>
            <img className='rounded-full h-36 w-36 drop-shadow-md' src='http://placekitten.com/300/300' alt='Quokka' width={120} height={120} />
            <div className='ml-8'>
              <div className='text-xl'>Nobsfud</div>
              <div className='text-sm mt-2'>nobs.avax</div>
              {/* <button className="btn mt-2">inbox</button> */}
            </div>
          </div>
        </div>
        <div className='col-span-1 sm:col-span-2 flex space-x-2 items-center sm:justify-center'>
          <div className="stats shadow">

            <div className="stat bg-neutral">
              <div className="stat-title">Offers Sent</div>
              <div className="stat-value text-warning">25</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="stats shadow">

            <div className="stat bg-neutral">
              <div className="stat-title">Offers Accepted</div>
              <div className="stat-value text-warning">12</div>
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

      <div className='flex justify-evenly mt-24'>
        {activeTab === 0 ?
          <>
            <div className="indicator">
              <span className="indicator-item badge badge-warning">99+</span>
              <button onClick={() => setActiveTab(0)} className="btn btn-outline btn-warning">Sent & Pending</button>
            </div>
            <div className="indicator">
              <span className="indicator-item badge">99+</span>
              <button onClick={() => setActiveTab(1)} className="btn btn-outline">Offer Inbox</button>
            </div>
          </>
          :
          <>
            <div className="indicator">
              <span className="indicator-item badge">99+</span>
              <button onClick={() => setActiveTab(0)} className="btn btn-outline">Sent & Pending</button>
            </div>
            <div className="indicator">
              <span className="indicator-item badge badge-warning">99+</span>
              <button onClick={() => setActiveTab(1)} className="btn btn-outline btn-warning">Offer Inbox</button>
            </div>
          </>
        }
      </div >

      {/* Sent & Pending */}
      {
        activeTab === 0 && (
          <div className="p-6 space-x-4 bg-base-300 rounded-box drop-shadow-md mt-6">
            <div className="w-full border-opacity-50">
              <div className="grid h-20 card bg-base-300 rounded-box px-4">
                <div className='flex justify-between items-center'>
                  <div>NFTS</div>
                  <div className='flex items-center'>
                    <div>
                      <button className="btn btn-outline block">Cancel Offer</button>
                    </div>
                    <button className="btn btn-warning rounded-full ml-2 cursor-default">Pending</button>
                  </div>
                </div>
              </div>
              <div className="divider text-sm my-8">Swap for your</div>
              <div className="grid h-20 card bg-base-300 rounded-box px-4">
                <div>NFTS</div>
              </div>
            </div>
          </div >
        )
      }

      {/* Offer Inbox */}
      {
        activeTab === 1 && (
          <div className="p-6 space-x-4 bg-base-300 rounded-box drop-shadow-md mt-6">
            <div className="w-full border-opacity-50">
              <div className="grid h-20 card bg-base-300 rounded-box px-4">
                <div className='flex justify-between items-center'>
                  <div>NFTS</div>
                  <div className='flex items-center'>
                    <div>
                      <button className="btn btn-neutral block mb-2">Accept Offer</button>
                      <button className="btn btn-outline block">Cancel Offer</button>
                    </div>
                    <button className="btn btn-warning rounded-full ml-2 cursor-default">Pending</button>
                  </div>
                </div>
              </div>
              <div className="divider text-sm my-8">Swap for your</div>
              <div className="grid h-20 card bg-base-300 rounded-box px-4">
                <div>NFTS</div>
              </div>
            </div>
          </div >
        )
      }
    </>
  )
}
