import React, { useEffect, useState, useRef, useCallback } from "react";
import { getAllVideos } from "../../services/video.service";
import { HomeLongVideoCard } from "../VideoCard/homeLongVideoCard";
import { useSelector } from "react-redux";
import Sidebar1 from "../sidebar/Sidebar1";

function HomePage() {
  const [videoInfo, setVideoInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isSidebarStatus = useSelector((state) => state.ui.isSidebarOpen);

  const scrollRef = useRef(null);

  const fetchVideoInfo = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const result = await getAllVideos(page);

      if (result?.status === 200) {
        const response = result?.data?.videos || [];

        setVideoInfo((prev) => {
          const newUniqueVideos = response.filter(
            (newVideo) =>
              !prev.some((oldVideo) => oldVideo._id === newVideo._id)
          );

          return [...prev, ...newUniqueVideos];
        });

        if (page >= result?.data?.totalPages) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }

    setLoading(false);
  }, [page, hasMore, loading]);

  //  Initial Load
  useEffect(() => {
    fetchVideoInfo();
  }, []);

  //  Infinite Scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 200
      ) {
        fetchVideoInfo();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [fetchVideoInfo]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!isSidebarStatus && <Sidebar1 />}

      <div
        ref={scrollRef}
        className="mt-5 flex-1 h-full overflow-y-auto bg-white text-black"
      >
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoInfo.length > 0 &&
              videoInfo.map((video) => (
                <HomeLongVideoCard key={video._id} data={video} />
              ))}

            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <HomeLongVideoSkeleton key={i} />
              ))}
          </div>

          {!hasMore && (
            <p className="text-center mt-5 text-gray-500">
               No more videos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

// 🔥 Skeleton Loader
const HomeLongVideoSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-56 bg-gray-300 rounded-lg"></div>
      <div className="w-full flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="h-6 bg-gray-300 rounded w-4/5"></div>
          <div className="h-6 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};
