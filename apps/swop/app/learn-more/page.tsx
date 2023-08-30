'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

function Tweets() {
  const tweets = ['rabblet', 'giraffe'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalDelay = 4200; // Time in milliseconds between each iteration

  useEffect(() => {
    const iterateArray = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % tweets.length);
    };
    const intervalId = setInterval(iterateArray, intervalDelay);

    return () => clearInterval(intervalId);
  }, [tweets.length, intervalDelay]);
  return (
    <Image src={`/images/${tweets[currentIndex]}.gif`} width={350} height={100} className="mt-6 drop-shadow-md rounded-lg" alt="Tweet" />
  )
}

export default function LearnMore() {
  return (
    <>
      <div className="hero bg-base-200 rounded-xl">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Image src={'/images/Quokka_Wave.png'} width={400} height={400} className="hidden sm:block max-w-sm" alt="Quokka Wave" />
          <div>
            <h1 className="text-5xl font-bold">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SWOP</span></h1>
            <p className="py-6 text-lg sm:text-xl">Swap your NFTs with the homies!</p>
          </div>
        </div>
      </div>

      <div className="collapse bg-base-200 my-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          What is the functionality of  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SWOP</span> ?
        </div>
        <div className="collapse-content">
          <p><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SWOP</span> provides a user-friendly and efficient method for discovering and exchanging offers.</p>
        </div>
      </div>

      <div className="collapse bg-base-200 my-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Generating a Public Offer
        </div>
        <div className="collapse-content">
          <p>Public lobbies are accessible to all users from the main page.
            These lobbies can be responded to by a single individual.After an offer is submitted, it transitions to a private status.</p>
        </div>
      </div>

      <div className="collapse bg-base-200 my-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Generating a Public Offer
        </div>
        <div className="collapse-content">
          <p>Public lobbies are accessible to all users from the main page.
            These lobbies can be responded to by a single individual.
            After an offer is submitted, it transitions to a private status.
            The creator of the lobby holds the authority to accept or decline the offer.</p>
        </div>
      </div>

      <div className="collapse bg-base-200 my-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Initiating a Private Offer
        </div>
        <div className="collapse-content">
          <p>A private offer pertains to the creation of an offer with a specific wallet in consideration. The process involves:</p>
          <ol>
            <br />
            <li>&nbsp;&nbsp;&nbsp;&nbsp; 1. Identifying a wallet</li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp; 2. Selecting NFTs and the wavax amount</li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp; 3. Receiving the offer</li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp; 4. Making a decision to accept, cancel, or propose a counteroffer</li>
          </ol>
        </div>
      </div>

      <div className="collapse bg-base-200 my-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Free of Charge Swap
        </div>
        <div className="collapse-content">
          <p>We have made the deliberate choice to refrain from imposing any fees on swaps.
            We believe that swapping with friends should be an expense - free endeavor.
            Enjoy swapping!</p>
        </div>
      </div>

      <div className="collapse bg-base-200 my-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Qualification of Collections
        </div>
        <div className="collapse-content">
          <p>Only collections verified on the Pickasso API platform are eligible for swapping.</p>
        </div>
      </div>

      <div className="collapse bg-base-200 mb-4">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Stay tuned for more:
        </div>
        <div className="collapse-content">
          <p>We are continuously working to bring you more exciting features and services. Your feedback and suggestions are valuable to us, so feel free to reach out to us on Twitter
            <Link className="text-sky-500 hover:text-sky-600" href="https://twitter.com/nobsfud"> @nobsfud</Link>.</p>
        </div>
      </div>

      <div className="flex items-center font-mono">
        <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.0} stroke="black" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <span>Developed by
          <Link className="cursor-pointer hover:text-indigo-400" href="https://twitter.com/pugs0x"> Pugs0x</Link>,
          <Link className="cursor-pointer hover:text-sky-500" href="https://twitter.com/nobsfud"> Nobs</Link> &
          <Link className="cursor-pointer hover:text-emerald-500" href="https://twitter.com/0xPrimata"> 0xPrimata</Link>
        </span>
      </div >
      <div>
        <div className="flex justify-start items-center">
          <Image src={'/images/pickasso_logo.png'} width={23} height={23} alt="Pickasso Logo" className="mr-1" />
          <span className="font-mono">Powered by <Link className="cursor-pointer hover:text-sky-400" href="https://twitter.com/0xpickasso">Pickasso</Link> API</span>
        </div>
      </div>
    </>
  )
}