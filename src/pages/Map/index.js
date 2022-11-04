import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavHeader from "../../components/NavHeader"
import { getCurrentLngLat } from "../../utils/location"
import axios from "axios"
import { Toast } from "antd-mobile"

import "./styles.scss"

function Map() {
  const navigate = useNavigate()

  const [houseList, setHouseList] = useState([])
  const [showHouseList, setShowHouseList] = useState(false)

  const AMap = window.AMap

  const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"))

  const textStyle = {
    fontSize: 12,
    fillColor: "#fff",
    padding: [3, 10],
    backgroundColor: "green",
    borderColor: "#fff",
    borderWidth: 1,
  }

  var map = null

  var labelsLayer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    // 该层内标注是否避让
    collision: false,
    // 设置 allowCollision：true，可以让标注避让用户的标注
    allowCollision: true,
  })

  async function createMap(data) {
    const { lat, lng } = data.geocodes[0].location
    var zoomNumber = 11
    map = new AMap.Map("container")

    // console.log(lat, lng)
    map.setCenter([lng, lat])
    map.setZoom(zoomNumber)

    map.on("movestart", () => {
      // console.log("movestart")
      setShowHouseList(() => false)
    })

    new AMap.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      map.addControl(new AMap.ToolBar())

      // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
      map.addControl(new AMap.Scale())
    })

    try {
      const res = await getHouseInfo(value)
      // console.log(res)
      const labelMakers = res.map((item) => {
        return createLabelMakers(
          item.label,
          item.count,
          item.value,
          item.coord.longitude,
          item.coord.latitude,
          zoomNumber
        )
      })

      labelsLayer.add(labelMakers)

      map.add(labelsLayer)
    } catch (error) {
      console.log(error)
    }
  }

  function createLabelMakers(dist, count, value, lng, lat, zoomNumber) {
    var text = {
      // 要展示的文字内容
      content: `${dist}${count}套`,
      // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
      direction: "center",
      // 文字样式
      style: textStyle,
    }

    var labelMarker = new AMap.LabelMarker({
      name: "标注2", // 此属性非绘制文字内容，仅最为标识使用
      position: [lng, lat],
      zIndex: 16,
      // 将第一步创建的 icon 对象传给 icon 属性
      // icon: icon,
      // 将第二步创建的 text 对象传给 text 属性
      text: text,
    })

    const areaZoomNumber = zoomNumber + 2

    labelMarker.on("click", async (e) => {
      try {
        if (zoomNumber < 15) {
          labelsLayer.clear()
          map.remove(labelsLayer)
          map.setZoom(areaZoomNumber)
          map.setCenter([lng, lat])

          const res = await getHouseInfo(value)

          // console.log(res)

          const labelMakers = res.map((item) => {
            return createLabelMakers(
              item.label,
              item.count,
              item.value,
              item.coord.longitude,
              item.coord.latitude,
              areaZoomNumber
            )
          })
          labelsLayer.add(labelMakers)
          map.add(labelsLayer)
        } else {
          const x = window.innerWidth / 2 - e.pixel.x
          const y = window.innerHeight / 4 - e.pixel.y

          // console.log(x, y)
          map.panBy(x, y)

          const res = await getHouseDetails(value)
          // console.log(dist, value)
          // console.log(res)
          setHouseList(() => res.list)
          setShowHouseList(() => true)
        }
      } catch (error) {
        console.log(error)
      }
    })

    return labelMarker
  }

  async function initMap() {
    try {
      const res = await getCurrentLngLat(label)
      createMap(res)
    } catch (error) {
      console.log(error)
    }
  }

  async function getHouseInfo(id) {
    try {
      Toast.show({
        icon: "loading",
        content: "加载中…",
        duration: 0,
      })
      const res = await axios.get("http://localhost:8080/area/map", {
        params: {
          id,
        },
      })
      Toast.clear()
      return res.data.body
    } catch (error) {
      console.log(error)
      Toast.clear()
    }
  }
  async function getHouseDetails(id) {
    try {
      Toast.show({
        icon: "loading",
        content: "加载中…",
        duration: 0,
      })
      const res = await axios.get(`http://localhost:8080/houses`, {
        params: {
          cityId: id,
        },
      })
      Toast.clear()
      return res.data.body
    } catch (error) {
      console.log(error)
      Toast.clear()
    }
  }
  useEffect(() => {
    initMap()
  }, [])

  function handleClick() {
    map.destroy()
    navigate(-1)
  }

  return (
    <>
      <NavHeader onLeftClick={handleClick}>地图找房</NavHeader>
      <div id="container"></div>

      <div className={`house-list ${showHouseList ? "show" : ""}`}>
        <div className="house-list-header">
          <h2>房屋列表</h2>
          <span>更多房源</span>
        </div>
        <div className="house-list-container">
          {houseList.map((item) => {
            return (
              <div className="house-list-item" key={item.houseCode}>
                <img src={`http://localhost:8080${item.houseImg}`} alt="" />

                <div className="house-list-item-detail">
                  <h3>{item.title}</h3>
                  <span className="house-list-item-detail-desc">{item.desc}</span>
                  <div className="house-list-item-detail-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <p>
                    <span className="house-list-item-detail-price">{item.price}</span>元/月
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Map
