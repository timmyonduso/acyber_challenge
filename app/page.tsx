'use client'

export default function CampaignsLanding() {
  return (
    <main className="relative isolate px-6 lg:px-8 bg-gray-900 text-white min-h-screen flex items-center justify-center overflow-y-auto">
      <div className="mx-auto max-w-3xl py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Discover and Engage with Top Influencers
        </h1>
        <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
          Connect with the best influencers to boost your brand's reach and impact.
        </p>
        <div className="mt-8 flex justify-center gap-x-6">
          <a
            href="all"
            className="rounded-lg bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-indigo-400 transition-all"
          >
            Get Started
          </a>
          <a 
            href="#" 
            className="text-lg font-semibold text-gray-300 hover:text-white transition-all"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  )
}
