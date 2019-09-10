import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Home from "./home/Home"
import Classroom from "./Classroom/Classroom"
import Exit from "./Exit/Exit"
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
				<Route exact path="/" component={props => <Home name={name} />} />
				<Route path="/salas" component={Classroom} />
				<Route path="/sair" component={props => <Exit {...props} />} />
				<Redirect to="/" />
			</Switch>
			<Footer />
		</>
	)
}
