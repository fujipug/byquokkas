import React from 'react'
import { Offer } from '../../apps/swop/types'
import Image from 'next/image'
import RenderName from './RenderName';

export default function Table(props: { tableHeaders: string[], data: Offer[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {props.tableHeaders.map((header) => {
              return (
                <th key={header}>{header}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <>
            {props?.data?.map((offer, index) =>
              <tr key={index}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        {offer?.offerA.map((nft: any, index: number) =>
                          <Image key={index} src={nft?.metadata?.pImage} height={100} width={100} alt="Avatar Tailwind CSS Component" />
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{offer?.offerName}</td>
                <td><RenderName address={offer?.sender} classData={''} /></td>
                <td>{offer?.status}</td>
                <td>{`${(offer?.createdAt)?.toDate().toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}`} at {`${(offer?.createdAt)?.toDate().toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}`}</td>
                <th>
                  <button className="btn btn-ghost btn-xs">details</button>
                </th>
              </tr>
            )}
          </>
        </tbody>
      </table>
    </div>
  )
}
