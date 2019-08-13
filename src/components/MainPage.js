import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Home from "./home/Home"
import ClassRoom from "./ClassRoom/ClassRoom"
import Exit from "./Exit/Exit"
import Logo from "./templates/Logo"
import Nav from "./templates/Nav"
import Footer from "./templates/Footer"
export default props => {
	return (
		<>
			<Logo />
			<Nav />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/salas" component={ClassRoom} />
				<Route path="/sair" component={Exit} />
				<Redirect from="*" to="/" />
			</Switch>
			<Footer />
		</>
	)
}
