import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Login from "../components/Login/Login"
import MainPage from "../components/MainPage"
import { isAuthenticated } from "./auth"

export default props => {
	if (isAuthenticated()) {
		return <MainPage />
	}
	if (!isAuthenticated()) {
		return (
			<Switch>
				<Route path="/login" component={Login} />
				<Redirect from="*" to={{ pathname: "/login", state: props.location }} />
			</Switch>
		)
	}
}
