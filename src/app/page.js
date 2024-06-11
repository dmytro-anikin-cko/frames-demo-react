"use client"

import { useState } from "react";

import PaymentFrameSingle from "@/components/PaymentFrameSingle";
import PaymentFrameMultiple from "@/components/PaymentFrameMultiple";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(1); // Default to tab 1

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
  };
  return (
    <main className='mt-24 container'>
      <div className='w-full'>
        <div className='w-full flex justify-between items-start'>
          <section className='w-full'>
            <h1 className="w-full text-center text-2xl font-bold mb-4">Frames Demo</h1>
            <div className='bg-slate-200 rounded-xl p-8'>
              <div className='italic'>
                <p>
                  Use one of the following <a className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" href="https://www.checkout.com/docs/developer-resources/testing/test-cards">test cards</a>.
                </p>
              </div>
            </div>
            <div className='my-4 pb-4 border-b-2 border-gray-300'>

              <div role="tablist" className="tabs tabs-bordered">
                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Single Line" checked={selectedTab === 1} onChange={() => handleTabChange(1)} />
                <div role="tabpanel" className="tab-content p-10">
                  {selectedTab === 1 && <PaymentFrameSingle />}
                </div>

                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Separate Lines" checked={selectedTab === 2} onChange={() => handleTabChange(2)} />
                <div role="tabpanel" className="tab-content p-10">
                  {selectedTab === 2 && <PaymentFrameMultiple />}
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
