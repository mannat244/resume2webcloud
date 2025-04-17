import React from 'react'

const NavBar = ({scrollfunc , refs}) => {
  return (
    <div className='bg-zinc-900 shadow-lg shadow-black/30 h-14 flex justify-center items-center text-white '>
      <img onClick={() => {window.location.href = "/"}} src='/rlogo.png' className=' h-10 ml-3 mr-auto'/>
      <div className='flex ml-2 items-center justify-center font-sans gap-10 font-semibold mr-10'>
        <button onClick={() => scrollfunc(refs?.Heroref)}>Home</button>
        <button onClick={() => scrollfunc(refs?.Aboutref)}>Features</button>
        <button onClick={() => scrollfunc(refs?.Featuresref)}>How It Works</button>
        <button onClick={() => scrollfunc(refs?.FAQref)}>FAQs</button>
      </div>
    </div>
  )
}

export default NavBar
