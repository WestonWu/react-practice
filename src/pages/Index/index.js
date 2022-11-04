import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Swiper, Grid } from "antd-mobile"
import axios from "axios"
import { getCurrentLocation } from "../../utils/location"

import Nav1 from "../../assets/images/nav-1.png"
import Nav2 from "../../assets/images/nav-2.png"
import Nav3 from "../../assets/images/nav-3.png"
import Nav4 from "../../assets/images/nav-4.png"

import "./styles.scss"

function Index() {
  const [swiper, setSwiper] = useState([])
  const [swiperLoad, setSwiperLoad] = useState(false)

  async function getSwipers() {
    const res = await axios.get("http://192.168.1.127:8080/home/swiper")
    setSwiper(() => {
      return res.data.body
    })
    setSwiperLoad(() => true)
    // console.log(res.data.body)
  }

  useEffect(() => {
    getSwipers()
  }, [])

  const swiperItems = swiper.map((item) => (
    <Swiper.Item key={item.id}>
      <a
        href="http://www.baidu.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: 212,
        }}
      >
        <img
          src={`http://192.168.1.127:8080${item.imgSrc}`}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            verticalAlign: "top",
          }}
        />
      </a>
    </Swiper.Item>
  ))

  const navigate = useNavigate()
  const navItems = [
    {
      id: 1,
      title: "整租",
      img: Nav1,
      path: "/houselist",
    },
    {
      id: 2,
      title: "合租",
      img: Nav2,
      path: "/houselist",
    },
    {
      id: 3,
      title: "地图找房",
      img: Nav3,
      path: "/map",
    },
    {
      id: 4,
      title: "去出租",
      img: Nav4,
      path: "/rent",
    },
  ]

  const [groups, setGroups] = useState([])

  async function getGroups() {
    const res = await axios.get("http://192.168.1.127:8080/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    })
    setGroups(() => res.data.body)
    // console.log(res)
  }

  useEffect(() => {
    getGroups()
  }, [])

  const [news, setNews] = useState([])

  async function getNews() {
    const res = await axios.get("http://192.168.1.127:8080/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    })
    // console.log(res)
    setNews(() => res.data.body)
  }

  useEffect(() => {
    getNews()
  }, [])

  const groupItems = groups.map((item) => (
    <Grid.Item key={item.id}>
      <div className="groups-item">
        <div className="desc">
          <p>{item.title}</p>
          <span>{item.desc}</span>
        </div>
        <img src={`http://192.168.1.127:8080${item.imgSrc}`} alt="" />
      </div>
    </Grid.Item>
  ))

  const [city, setCity] = useState("上海")

  async function getCityName() {
    const res = await getCurrentLocation()
    // console.log(addressComponent)

    setCity(() => res.label)
  }

  useEffect(() => {
    getCityName()
  }, [])

  return (
    <>
      <div className="top-container">
        {swiperLoad ? (
          <Swiper autoplay loop>
            {swiperItems}
          </Swiper>
        ) : (
          <div></div>
        )}

        <div className="search-container">
          <div className="search-box">
            <div className="city" onClick={() => navigate("/citylist")}>
              {city}
              <i className="iconfont icon-arrow" />
            </div>
            <div className="search" onClick={() => navigate("/search")}>
              <i className="iconfont icon-seach"></i>
              <span className="text">请输入小区地址</span>
            </div>
          </div>
          <i className="iconfont icon-map" onClick={() => navigate("/map")}></i>
        </div>
      </div>

      <div className="navigation">
        {navItems.map((item) => (
          <div className="navigation-item" key={item.id} onClick={() => navigate(item.path)}>
            <img src={item.img} alt="" />
            <h2>{item.title}</h2>
          </div>
        ))}
      </div>

      <div className="groups">
        <h3>
          租房小组 <span>更多</span>
        </h3>
        <Grid columns={2} gap={10}>
          {groupItems}
        </Grid>
      </div>

      <div className="news">
        <h3>最新资讯</h3>
        {news.map((item) => (
          <div className="news-item" key={item.id}>
            <img src={`http://192.168.1.127:8080${item.imgSrc}`} alt="" />
            <div className="news-info">
              <p>{item.title}</p>
              <div className="news-info-desc">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Index
