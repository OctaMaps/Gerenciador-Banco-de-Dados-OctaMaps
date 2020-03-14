import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Home from "./home/Home"
import Classroom from "./Classroom/Classroom"
import Exit from "./Exit/Exit"
import User from "./User/User"
import Account from "./Account/Account"
import Logo from "./templates/Logo"
import Nav from "./templates/Nav"
import Footer from "./templates/Footer"

export default props => {
	const { name } = props
	return (
		<>
			<Logo />
			<Nav />
			<Switch>
				<Route
					exact
					path="/gerenciador"
					component={props => <Home name={name} />}
				/>
				<Route path="/gerenciador/salas" component={Classroom} />
				<Route path="/gerenciador/usuarios" component={User} />
				<Route path="/gerenciador/conta" component={Account} />
				<Route
					path="/gerenciador/sair"
					component={props => <Exit {...props} />}
				/>
				<Redirect to="/gerenciador" />
			</Switch>
			<Footer />
		</>
	)
}
