import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Home from "../components/home/Home"
import Classroom from "../components/Classroom/Classroom"

export default props => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/salas" component={Classroom} />
			<Redirect from="*" to="/" />
		</Switch>
	)
}
