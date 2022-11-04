import React from "react"
import { NavBar } from "antd-mobile"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

import "./styles.scss"

export default function NavHeader(props) {
  const navigate = useNavigate()

  const back = () => navigate(-1)
  return (
    <NavBar
      className="navbar"
      backArrow={<i className="iconfont icon-back" />}
      style={{
        "--border-bottom": "1px #eee solid",
      }}
      onBack={props.onLeftClick || back}
    >
      {props.children}
    </NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
}
