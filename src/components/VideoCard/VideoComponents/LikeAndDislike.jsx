import React from 'react';
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
const LikeAndDislike = ({like, dislike, videoInfo,toggleLike, toggleDislike, likeCount }) => {
  return (
   <div className="flex gap-2">
               <div className="bg-[#272727] px-4 py-2 rounded-full text-sm flex justify-center">
               <button className=" mr-4">
                 <div className="flex justify-center gap-2" onClick={toggleLike}>
                  {
                   like ?(<AiFillLike 
                   className="h-5 w-5"
                   />):( <SlLike 
                  className="h-5 w-5"
                  />)
                  
                  }
                  <p
                  className="text-md text-bol"
                  >{likeCount}</p>
   
                 </div>
               </button>
               <button 
               onClick={toggleDislike}
               className="">
                { 
                 dislike ? (<AiFillDislike 
                 className="h-5 w-5"
                 />):(
                   <SlDislike 
                 className="h-5 w-5"
                 />
                   )
                 
                 }
               </button>
               </div>
               <button className="bg-[#272727] px-4 py-2 rounded-full text-sm">
                 Share
               </button>
             </div>
  );
}

export default LikeAndDislike;
