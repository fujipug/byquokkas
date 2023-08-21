import Table from "ui/Table";
import Image from "next/image";
import Link from "next/link";

const tableHeaders = ['test1', 'test2', 'test3', 'test4'];

export default function Page() {
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
      <Table label={'Recent public offers'} tableHeaders={tableHeaders} />
    </>
  );
}
