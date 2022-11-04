import { Outlet } from "react-router-dom"

import React from "react"

import Bottom from "./components/BottomTabBar"

import "./styles.css"

function Root() {
  return (
    <div className="Root">
      <div className="app">
        {/* <div className="top">
          <NavBar>配合路由使用</NavBar>
        </div> */}
        <div className="body">
          <Outlet></Outlet>
        </div>
        <div className="bottom">
          <Bottom />
        </div>
      </div>
    </div>
  )
}

export default Root
