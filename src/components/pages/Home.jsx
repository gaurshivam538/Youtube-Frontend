import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { getAllVideos } from "../../services/video.service";
import { HomeLongVideoCard } from "../VideoCard/homeLongVideoCard";
import Sidebar1 from "../sidebar/Sidebar1";

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

  const loaderRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // ✅ Fetch Function
const isFetchingRef = useRef(false);

const fetchVideos = useCallback(async () => {
  if (isFetchingRef.current || !hasMore) return;

  isFetchingRef.current = true;
  setLoading(true);

  try {
    const result = await getAllVideos(page);

    if (result?.status === 200) {
      const newVideos = result?.data?.videos || [];

      setVideos((prev) => {
        const uniqueVideos = newVideos.filter(
          (newVideo) =>
            !prev.some((oldVideo) => oldVideo._id === newVideo._id)
        );
        return [...prev, ...uniqueVideos];
      });

      if (page >= result?.data?.totalPages) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
  } finally {
    setLoading(false);
    isFetchingRef.current = false;
  }
}, [page, hasMore]);


  //  Initial Load
  useEffect(() => {
    fetchVideos();
  }, []);

  //  Intersection Observer (Correct Scroll Root)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchVideos();
        }
      },
      {
        root: scrollContainerRef.current, 
        threshold: 1,
        // rootMargin: "200px",
      }
    );

    const loaderElement = loaderRef.current;

    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [fetchVideos]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!isSidebarOpen && <Sidebar1 />}

      <div
        ref={scrollContainerRef}
        className="mt-5 flex-1 h-full overflow-y-auto bg-white text-black"
      >
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <HomeLongVideoCard key={video._id} data={video} />
            ))}

            {loading &&
              Array.from({ length: 9 }).map((_, i) => (
                <HomeLongVideoSkeleton key={i} />
              ))}
          </div>

          {hasMore && (
            <div
              ref={loaderRef}
              className="flex justify-center py-6"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

// ✅ Skeleton Loader
const HomeLongVideoSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-56 bg-gray-300 rounded-lg"></div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="h-5 bg-gray-300 rounded w-4/5"></div>
        <div className="h-5 bg-gray-300 rounded w-3/5"></div>
      </div>
    </div>
  </div>
);
