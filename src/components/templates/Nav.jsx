import React from "react"
import { NavLink } from "react-router-dom"
import "./Nav.css"

export default props => {
	return (
		<aside className="menu-area">
			<nav className="menu">
				<NavLink activeClassName="active-link" exact to="/">
					<i className="fa fa-home fa-fw" /> Inicio
				</NavLink>
				<NavLink activeClassName="active-link" to="/salas">
					<i className="fa fa-book fa-fw" /> Salas
				</NavLink>
				<NavLink activeClassName="active-link" to="/imprimirLista">
					<i className="fa fa-print fa-fw" /> Imprimir
				</NavLink>
			</nav>
		</aside>
	)
}
