import React from "react"
import { NavLink } from "react-router-dom"
import "./Nav.css"

export default props => {
	return (
		<aside className="menu-area">
			<nav className="menu">
				<NavLink activeClassName="active-link" exact to="/home">
					<i className="fa fa-home fa-fw" /> Inicio
				</NavLink>
				<NavLink activeClassName="active-link" to="/salas">
					<i className="fa fa-book fa-fw" /> Salas
				</NavLink>
				<NavLink activeClassName="active-link" to="/sair">
					<i className="fa fa-times fa-fw" /> Sair
				</NavLink>
			</nav>
		</aside>
	)
}
