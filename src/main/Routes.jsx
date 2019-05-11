import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Home from "../components/home/Home"
import ClassRoom from "../components/ClassRoom/ClassRoom"
import PrintList from "../components/printList/PrintList"

export default props => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/salas" component={ClassRoom} />
			<Route path="/imprimirLista" component={PrintList} />
			<Redirect from="*" to="/" />
		</Switch>
	)
}
