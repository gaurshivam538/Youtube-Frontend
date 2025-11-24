import React from "react";
import "./App.css";
import Header from "./components/Header/header";
import { Signup, Login } from "./components";
function App() {
  return (
    <div className="app">
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
      <Login/>
      <Signup/>

      {/* Channel Info */}
      <main className="channel-page">
        <section className="channel-info">
          <img
            src="channel-logo.png"
            alt="Channel Logo"
            className="channel-logo"
          />
          <div className="channel-details">
            <h1 className="channel-name">The Laughter Idol</h1>
            <p className="channel-handle">@SHIVAMGAUR-ht2py</p>
            <p className="channel-stats">5 subscribers • 11 videos</p>
            <div className="channel-buttons">
              <button>Customize channel</button>
              <button>Manage videos</button>
              <button>Visit Community</button>
            </div>
          </div>
        </section>

        {/* For You Section */}
        <section className="video-section">
          <h2>For You</h2>
          <div className="video-grid">
            {[
              { title: "Best funny video @$", views: "3 views" },
              { title: "Best funny video $$$@", views: "4 views" },
              { title: "Shahrukh Khan best ...", views: "96 views" },
              { title: "Best funny video$$@", views: "6 views" },
              { title: "Best funny video", views: "5 views" },
            ].map((video, i) => (
              <div key={i} className="video-card">
                <img
                  src={`thumbnail${i + 1}.jpg`}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <p className="video-title">{video.title}</p>
                <p className="video-views">{video.views}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section className="video-section">
          <h2>Videos</h2>
          <div className="video-grid">
            <div className="video-card">
              <img
                src="thumbnail6.jpg"
                alt="Best funny video"
                className="video-thumbnail"
              />
              <p className="video-title">Best funny video</p>
              <p className="video-views">4 views • 2 years ago</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
