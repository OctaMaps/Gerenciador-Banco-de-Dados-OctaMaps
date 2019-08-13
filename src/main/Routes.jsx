import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Login from "../components/Login/Login"
import MainPage from "../components/MainPage"
import Auth from "./auth"

const auth = Auth()
export default props => {
	const isAuthenticated = auth.isAuthenticated()
	console.log(isAuthenticated)
	if (isAuthenticated) {
		return <MainPage />
	}
	if (!isAuthenticated || isAuthenticated === undefined) {
		return (
			<Switch>
				<Route path="/login" component={Login} />
				<Redirect from="*" to={{ pathname: "/login", state: props.location }} />
			</Switch>
		)
	}
}
