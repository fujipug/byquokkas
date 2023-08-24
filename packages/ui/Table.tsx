import { Offer } from '../../apps/swop/types'
import Image from 'next/image'
import RenderName from './RenderName';
import Link from 'next/link';

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
                  <Link href={`/offer-details/${offer.id}`}>
                    <div className="avatar-group -space-x-6">
                      {offer?.offerA.map((nft: any, index: number) =>
                        <div key={index} className="avatar">
                          <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <Image key={index} src={nft?.metadata?.pImage} height={150} width={150} alt="Nft Image" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </td>
                <td>
                  <Link href={`/offer-details/${offer.id}`} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {offer?.offerName ? offer?.offerName : offer.id}
                  </Link>
                </td>
                <td><RenderName address={offer?.sender} classData={''} /></td>
                <td>
                  {offer?.status === 'Open' ?
                    <div className="badge badge-success badge-outline">{offer?.status}</div>
                    :
                    <div className="badge badge-error badge-outline">{offer?.status}</div>
                  }
                </td>
                <td>{`${(offer?.createdAt)?.toDate().toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}`}</td>
              </tr>
            )}
          </>
        </tbody>
      </table>
    </div >
  )
}
