import React from 'react'

export default function Loader() {
  return (
    <div
    className="w-[20px] aspect-[2] animate-l3 m-[4px]"
    style={{
      background: `
        no-repeat radial-gradient(circle closest-side,#fff 90%,#0000) 0% 50%,
        no-repeat radial-gradient(circle closest-side,#fff 90%,#0000) 50% 50%,
        no-repeat radial-gradient(circle closest-side,#fff 90%,#0000) 100% 50%
      `,
      backgroundSize: "calc(100%/3) 50%",
      backgroundPosition: "0% 50%, 50% 50%, 100% 50%",
    }}
  />
  )
}
