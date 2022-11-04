import React, { useEffect, useState } from "react"
import { useNavigate, useLoaderData } from "react-router-dom"
import { IndexBar, List, Toast } from "antd-mobile"
import axios from "axios"
import { getCurrentLocation } from "../../utils/location"
import NavHeader from "../../components/NavHeader"

import "./styles.scss"

export async function loader() {
  const resCityList = await axios.get("http://192.168.1.127:8080/area/city?level=1")
  const resHotCity = await axios.get("http://192.168.1.127:8080/area/hot")
  return { cityList: resCityList.data.body, hotCity: resHotCity.data.body }
}

function formatCityList(cityList) {
  const groups = []

  cityList.forEach((item) => {
    const itemF = item.pinyin.substring(0, 1).toUpperCase()
    const groupsIndex = groups.findIndex((groupItem) => groupItem.title === itemF)
    if (groupsIndex === -1) {
      groups.push({
        title: itemF,
        items: [item],
      })
    } else {
      groups[groupsIndex].items.push(item)
    }
  })

  const sortGroups = groups.sort((a, b) => {
    if (a.title < b.title) {
      return -1
    }
    if (a.title > b.title) {
      return 1
    }
    return 0
  })

  return sortGroups
}

export default function CityList() {
  const navigate = useNavigate()
  const { cityList, hotCity } = useLoaderData()

  const [groups, setGroups] = useState([])

  async function getCurrentCity() {
    // console.log("123")
    const res = await getCurrentLocation().catch((err) => err)
    var tempGroups = []
    // console.log(res)
    tempGroups = formatCityList(cityList)
    tempGroups.unshift({
      title: "热门城市",
      items: hotCity,
    })
    tempGroups.unshift({
      title: "#",
      items: [res],
    })
    // console.log(groups)
    setGroups(() => tempGroups)
  }

  useEffect(() => {
    getCurrentCity()
  }, [])

  const handleClick = async (item) => {
    try {
      console.log(item)
      const res = await axios.get("http://localhost:8080/area/map", {
        params: { id: item.value },
      })
      console.log(res)
      if (res.data.body.length !== 0) {
        localStorage.setItem("hkzf_city", JSON.stringify(item))
        navigate(-1)
      } else {
        Toast.show({
          content: "该城市暂无房源数据！",
          maskClickable: false,
          duration: 2000,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="city-list">
      {/* <NavBar
        className="navbar"
        backArrow={<i className="iconfont icon-back" />}
        style={{
          "--border-bottom": "1px #eee solid",
        }}
        onBack={back}
      >
        城市选择
      </NavBar> */}
      <NavHeader>城市选择</NavHeader>

      <div className="list" style={{ height: window.innerHeight }}>
        <IndexBar>
          {groups.map((group) => {
            const { title, items } = group
            return (
              <IndexBar.Panel index={title} title={title === "#" ? "当前城市" : title} key={title}>
                <List>
                  {items.map((item) => {
                    return (
                      <List.Item key={item.value} onClick={() => handleClick(item)}>
                        {item.label}
                      </List.Item>
                    )
                  })}
                </List>
              </IndexBar.Panel>
            )
          })}
        </IndexBar>
      </div>
    </div>
  )
}
