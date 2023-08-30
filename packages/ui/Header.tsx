'use client'
import Link from "next/link";
import Image from "next/image";
import CustomConnectButton from "./CustomConnectButton";

export default function Header(props: { appName: string, showLogo?: boolean }) {
  return (
    <div className="navbar bg-neutral flex justify-between drop-shadow-md items-center">
      <Link className="flex sm:hidden" href="/"><Image src="/images/Face_2.png" alt="ByQuokkas Logo" width={60} height={60} /></Link>
      <div className="hidden sm:flex items-center ml-2">
        <Link className="-ml-2" href="/"><Image src="/images/Face_2.png" alt="ByQuokkas Logo" width={60} height={60} /></Link>
        {props?.showLogo ?
          <div className="mb-2">
            <Link href="/"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-xl">{props.appName}</span><br /></Link>
            <span className="text-xs absolute -mt-1.5">ByQuokkas</span>
          </div>
          :
          <Link href="/"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-xl">{props.appName}</span><br /></Link>
        }
      </div>
      <div className="flex items-center">
        <CustomConnectButton />
        <Link className="hidden" href={"/profile"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-10 h-10 ml-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </div >

  )
}