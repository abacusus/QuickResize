import React from 'react'

const DisClaimer = () => {
  return (
    <div>
      <div className='w-full flex justify-center items-center h-12 bg-green-200 overflow-hidden'>
        <span className='font-bold text-sm sm:text-xl text-black disclaimer-marquee'>
            This is a private image resizing tool. We don’t store or share your data.
        </span>
      </div>
      <style>
        {`
          .disclaimer-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 12s linear infinite;
          }
          @keyframes marquee {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
          }
        `}
      </style>
    </div>
  )
}

export default DisClaimer
