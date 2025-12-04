import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from "./store/store.js"
import { Provider } from 'react-redux'
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/pages/Home.jsx'
import LoginPage from './components/pages/Login.jsx'
import SignupPage from './components/pages/Signup.jsx'
import MainLongVideoCard from './components/VideoCard/mainLongVideoCard.jsx'
import UploadVideo from './components/pages/UploadVideo.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DashboardHomePage from './components/DashboardComponenet/DashboardPages/DashboardHomePage.jsx'
import UserDashboardPage from './components/pages/UserDashboard.jsx'
import DashboardVideosPage from './components/DashboardComponenet/DashboardPages/DashboardVideosPage.jsx'
import DashboardShortPage from './components/DashboardComponenet/DashboardPages/DashboardShortPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path:"/",
        element:<HomePage/>
      },
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        path:"/signup",
        element:<SignupPage/>
      },
      {
        path: "/watch",
        element:<MainLongVideoCard/>
      },
      {
        path:"/upload",
        element:<UploadVideo/>
      },
      {
        path: "/:username",
        element: <UserDashboardPage/>,
        children: [
          {
            index:true,
            element: <DashboardHomePage/>
          },
          {
            path:'features',
            element: <DashboardHomePage/>
          },
          {
            path:"videos",
            element: <DashboardVideosPage/>
          },
          {
            path:"shorts",
            element:<DashboardShortPage/>
          }

        ]
      }

    ]
  }
])

createRoot(document.getElementById('root')).render(
      <Provider store={store}>
       <RouterProvider router={router}/>
      </Provider>
)
