import React from "react";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import { Outlet } from "react-router-dom";
function App() {
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
