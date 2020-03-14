import React from "react"
import { NavLink } from "react-router-dom"
import logo from "../../assets/images/octaMapsLogo4.png"
import "./Logo.css"

export default props => {
	return (
		<aside className="logo">
			<NavLink to="/gerenciador" className="logo">
				<img src={logo} alt="logo" />
			</NavLink>
		</aside>
	)
}
