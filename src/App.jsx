import React from "react";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "./Socket";
import { decrementCount, incrementCount } from "./store/subscribedaction.slice";
function App() {
  const authStatus = useSelector((state) => state.auth.userData);
  useEffect(() => {
   if (!authStatus) {
    console.log("LoggedIn is required");
    return;
   }
   socket.on("subscription:update",({subscriberId, action}) => {
    if (action === "UNSUBSCRIBE") {
      decrementCount();
    }

    if (action === "SUBSCRIBE") {
      incrementCount();
    }
   } )

  }, [authStatus]);
  
  return (
    <div className="text-black">
      {/* Header */}
      {/* <header className="header">
        <div className="logo">YouTube</div>
        <input type="text" className="search-bar" placeholder="Search" />
        <div className="user-actions">
          <button className="create-btn">Create</button>
          <button className="notifications-btn">🔔</button>
          <img
            src="user-avatar.png"
            alt="User"
            className="user-avatar"
          />
        </div>
      </header> */}
      <Header/>
      <main>
        <Outlet/>
      </main>
      {/* <Footer/> */}
      {/* <Login/>
      <Signup/> */}

      {/* Channel Info */}
     
    </div>

  );
}

export default App;
