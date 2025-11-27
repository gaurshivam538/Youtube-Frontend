import React from 'react'

const HomeShortVideoCard = () =>{
  return (
    <div className=' max-w-screen-sm md:h-[800px] pl-2 flex flex-col flex-wrap '>
      <div className='  w-full h-[600px]   overflow-hidden object-cover rounded-lg'>
        <img
        className='w-full h-full rounded-lg '
         src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s'
         />
      </div>
      <div className='flex flex-col'>
      <div className='mx-2 text-white text-3xl'>
        <h3>Lorem ipsum dolor sit amet consectetur.</h3>
      </div>
      <div className='mb-2 text-gray-700 text-xl'>
        <p>45M views</p>
      </div>
      </div>
      
    </div>
  )
}

export default HomeShortVideoCard
