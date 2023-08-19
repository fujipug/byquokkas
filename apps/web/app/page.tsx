export default function Page() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl text-center">Welcome to ByQuokkas</h1>

      <div className="p-6 bg-neutral rounded-box flex justify-center my-8">
        <span className="text-3xl sm:text-5xl">RABBLE RABBLE</span>
      </div>

      <div className="p-6 bg-neutral rounded-box flex justify-center">
        <span className="text-3xl sm:text-5xl">SWOP</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-12">
        <div className="cols-span-1">
          <span>RABBLE RABBLE LOBBIES</span>
        </div>
        <div className="cols-span-1">
          <span>SWOP OFFERS</span>
        </div>
      </div>
    </>
  );
}
