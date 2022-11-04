import React from "react"
import { TabBar } from "antd-mobile"

import { useLocation, useNavigate } from "react-router-dom"

const Bottom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    navigate(value)
  }

  const tabs = [
    {
      key: "/",
      title: "首页",
      icon: <i className="iconfont icon-ind"></i>,
    },
    {
      key: "/houselist",
      title: "找房",
      icon: <i className="iconfont icon-findHouse"></i>,
    },
    {
      key: "/news",
      title: "资讯",
      icon: <i className="iconfont icon-infom"></i>,
    },
    {
      key: "/profile",
      title: "我的",
      icon: <i className="iconfont icon-my"></i>,
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)} hidden>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

export default Bottom
