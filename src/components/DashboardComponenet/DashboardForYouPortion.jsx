import React, { useRef } from "react";
import LongVideo from "./For_You_Portion/LongVideo";
import ShortVideo from "./For_You_Portion/ShortVideo";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
const DashboardForYouPortion = ({ data }) => {

  const scrollRef = useRef(null);

  const safeData = Array.isArray(data) ? data : [];
  const sortedData = [...safeData].sort(
    (a, b) => (b?.views || 0) - (a?.views || 0)
  );

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 650; // YouTube style scroll value

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };



  return (
    <div className="relative w-full">

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
        className="flex gap-x-2 overflow-x-auto scrollbar-hide scroll-smooth py-2"
      >
        {sortedData.length === 0 && (
          <p className="text-gray-400 text-center w-full">
            No videos found.
          </p>
        )}

        {sortedData.map((video) => (
          <div className="" key={video._id}>
            {video.category === "short" && <ShortVideo video={video} />}
            {video.category === "video" && <LongVideo video={video} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardForYouPortion;