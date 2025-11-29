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
      }

    ]
  }
])

createRoot(document.getElementById('root')).render(
      <Provider store={store}>
       <RouterProvider router={router}/>
      </Provider>
)
