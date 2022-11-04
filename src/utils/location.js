import axios from "axios"

const AMap = window.AMap

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    const localCity = JSON.parse(localStorage.getItem("hkzf_city"))
    if (!localCity) {
      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量
          needAddress: true,
        })

        geolocation.getCurrentPosition(function (status, result) {
          if (status === "complete") {
            onComplete(result)
          } else {
            onError(result)
          }
        })

        async function onComplete(data) {
          // data是具体的定位信息
          const { addressComponent } = data
          // console.log(addressComponent)
          const cityName = addressComponent.city === "" ? addressComponent.province : addressComponent.city
          // console.log(city)

          try {
            const res = await axios.get("http://192.168.1.127:8080/area/info", {
              params: {
                name: cityName,
              },
            })
            localStorage.setItem("hkzf_city", JSON.stringify(res.data.body))
            resolve(res.data.body)
          } catch (error) {
            reject(error)
          }
        }

        function onError(data) {
          // 定位出错
          reject(data)
        }
      })
    } else {
      resolve(localCity)
    }
  })
}

export function getCurrentLngLat(label) {
  return new Promise((resolve, reject) => {
    new AMap.plugin("AMap.Geocoder", function () {
      var geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: "全国",
      })

      // 使用geocoder做地理/逆地理编码
      geocoder.getLocation(label, (status, result) => {
        // console.log(status, result)
        if (status === "complete") {
          resolve(result)
        } else {
          reject(result)
        }
      })
    })
  })
}
