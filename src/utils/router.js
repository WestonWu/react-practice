import { createBrowserRouter } from "react-router-dom"

import Root from "../Root"
import Home from "../pages/Home"
import ErrorPage from "../pages/ErrorPage"
import News from "../pages/News"
import HouseList from "../pages/HouseList"
import Profile from "../pages/Profile"
import CityList, { loader as cityListLoader } from "../pages/CityList"
import Map from "../pages/Map"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // loader: rootLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "houseList",
        element: <HouseList />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/citylist",
    loader: cityListLoader,
    element: <CityList />,
  },
  {
    path: "/map",
    element: <Map />,
  },
])

export default router
