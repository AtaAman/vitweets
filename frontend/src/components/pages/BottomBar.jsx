import React from 'react'

function BottomBar() {
  return (
    <section className="z-50 flex-between bg-transparent  w-screen text-white sticky bottom-0 bg-[#1010ac] py-4 md:hidden">
       

       <ul className="flex justify-around items-center">
        <li>home</li>
        <li>search</li>
        <li>create</li>
        <li>notification</li>
        <li>profile</li>
      </ul>

    </section>
  )
}

export default BottomBar