import Header from "./components/Header/header";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "./Socket";
import { decrementCount, incrementCount } from "./store/subscribedaction.slice";
function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
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
    <div className="text-black h-screen overflow-hidden">
      <Header />
      
      <main>
        <Outlet />
      </main>
    </div>

  );
}

export default App;
