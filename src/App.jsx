import Header from "./components/Header/header";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "./Socket";
import { decrementCount, incrementCount } from "./store/subscribedaction.slice";
import Sidebar2 from "../src/components/sidebar/Sidebar2"
import { useLocation } from "react-router-dom";
function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
    const isSidebarStatus = useSelector((state) => state.ui.isSidebarOpen);
    const loaction = useLocation();
    const isWatchPage = location.pathname.startsWith("/watch");
  
  useEffect(() => {
    if (!authStatus) return;

    const handler = ({ subscriberId, action }) => {

      if (action === "UNSUBSCRIBE") {
        dispatch(decrementCount())
      }
      if (action === "SUBSCRIBE") {
        dispatch(incrementCount())
        incrementCount()
      }
    };

    socket.on("subscriber:update", handler);
    socket.on("subscription:update", ({ channelId, action }) => {
    })

    return () => {
      socket.off("subscriber:update", handler);
      socket.off("subscription:update");
    };
  }, [authStatus]);

  return (
  <div className="w-full h-screen flex flex-col overflow-hidden">
  <Header />
  <div className="flex flex-1 w-full overflow-hidden">
    {
      isSidebarStatus?( <div className={`z-10 w-56 mt-3 flex-shrink-0 ${isWatchPage ? "fixed": "relative"} overflow-hidden` }>
      <Sidebar2 />
    </div>): (<div></div>)
    }
   
    <main className="flex-1 mt-2">
      <Outlet />
    </main>
  </div>
</div>


  );
}

export default App;
