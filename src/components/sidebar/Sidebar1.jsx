

import { IoMdHome } from "react-icons/io";
import { MdSubscriptions } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdPersonOutline } from "react-icons/md";
import { TbBolt } from "react-icons/tb";
import { FaBolt } from "react-icons/fa6";
import { Link } from "react-router-dom";


const Sidebar1 = () => {

 
  return (
   <div>
       <div className='flex flex-col space-y-9 pl-2 pt-2 pb-2 mt-4 justify-center items-center'>
        <Link
        to = "/"
        >
         <div  className='flex flex-col space-y-1 items-center cursor-pointer'>
           <MdOutlineHome 
           className='h-7 w-7'/>
           <p className='text-sm text-gray-500'>Home</p>
           {/* <IoMdHome /> */}
         </div>
         </Link>
         <div  className='flex flex-col space-y-1 items-center cursor-pointer'>
          <TbBolt 
            className='h-7 w-7'
          />
           {/* <FaBolt 
            className='h-7 w-7'/>
            */}
           <p className='text-sm text-gray-500'>Shorts</p>
           
         </div>
         <div className='flex flex-col space-y-1 items-center cursor-pointer'>
           <MdOutlineSubscriptions 
           className='h-7 w-7'/>
           <p className='text-sm text-gray-500'>Subscriptions</p>
           {/* <MdSubscriptions /> */}
         </div>
         <div  className='flex flex-col space-y-1 items-center cursor-pointer'>
           <MdPersonOutline 
            className='h-7 w-7'/>
           <p className='text-sm text-gray-500'>You</p>
           {/* <BsFillPersonFill /> */}
         </div>
       </div>
       </div>
     )
 
}

export default Sidebar1;
