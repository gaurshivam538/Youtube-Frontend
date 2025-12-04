
import React, { useRef } from 'react';
import ShortVideo from './VideoType/ShortVideo';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const DashboardShortPortion = ({ data }) => {
    const scrollRef = useRef(null)
    let setData = Array.isArray(data) ?data :[];

    setData = setData.filter((video) => video.category === "short");
    setData = setData.slice(0, 10);
   const scroll = (direction) => {
       if (!scrollRef.current) return;
       const amount = 450; // YouTube style scroll value
   
       scrollRef.current.scrollBy({
         left: direction === "left" ? -amount : amount,
         behavior: "smooth",
       });
     };
   
     return (
       <div className="relative w-full ">
   
         {/* Left Arrow */}
         <button
           onClick={() => scroll("left")}
           className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                      bg-gray-200 dark:bg-neutral-800 p-2  rounded-full shadow 
                      hover:scale-110 transition"
         >
          <FaChevronLeft />
         </button>
   
         {/* Right Arrow */}
         <button
           onClick={() => scroll("right")}
           className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                      bg-gray-200 dark:bg-neutral-800 p-2  rounded-full shadow 
                      hover:scale-110 transition "
         >
           <FaChevronRight />
         </button>
   
         {/* Scrollable Section */}
         <div
           ref={scrollRef}
           className="flex gap-x-2 overflow-x-auto scrollbar-hide scroll-smooth py-2  "
         >
            {
                setData.map((video) => (
                    <div className='' key={video._id}>
                        <ShortVideo video={video} />
                    </div>
                ))
            }
        </div>
        </div>
    );
}

export default DashboardShortPortion;
