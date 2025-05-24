import React from 'react'
import NotFoundImage from "../../public/assets/images/Oops! 404 Error with a broken robot-rafiki.svg"
export default function NotFound() {
  return (
    <main className='w-full min-h-screen flex justify-center items-center'>
      <img src={NotFoundImage} alt="404" className='w-[clamp(320px,40%,450px)]'/>
    </main>
  )
}
