import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import store from "./store/store.js"
import { Provider } from 'react-redux'
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
// import dotenv from 'dotenv';//This field is required for core javascript
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
import UploadedVideoAndAllVideo from './components/SpecificUserAllVideo/uploadedVideoAndAllVideo.jsx'
import { ProtectedRoute ,ForgotPassword} from './components/index.js'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/forgot-password",
       element: <ForgotPassword/>
      },
      {
        path: "/signup",
        element: <SignupPage />
      },
      {
        path: "/watch",
        element: <MainLongVideoCard />
      },

      //  PROTECTED ROUTES START
      {
        element: <ProtectedRoute />,
        children: [

          {
            path: "/upload",
            element: <UploadVideo />
          },
          {
            path: "/:username",
            element: <UserDashboardPage />,
            children: [
              {
                index: true,
                element: <DashboardHomePage />
              },
              {
                path: "features",
                element: <DashboardHomePage />
              },
              {
                path: "videos",
                element: <DashboardVideosPage />
              },
              {
                path: "shorts",
                element: <DashboardShortPage />
              }
            ]
          },
          {
            path: "/getallfiles",
            element: <UploadedVideoAndAllVideo />
          }
        ]
      }
      //  PROTECTED ROUTES END
    ]
  }
]);

const ClientId =import.meta.env.VITE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={ClientId}>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  </GoogleOAuthProvider>
)
