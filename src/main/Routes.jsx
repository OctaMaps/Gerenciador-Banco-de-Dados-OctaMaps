import React from "react"
import { Switch, Route, Redirect } from "react-router"

import Login from "../components/Login/Login"
import MainPage from "../components/MainPage"
import Auth from "./auth"

const auth = Auth()
export default props => {
	if (auth.isAuthenticated()) {
		return <MainPage />
	}
	if (!auth.isAuthenticated()) {
		return (
			<Switch>
				<Route path="/login" component={Login} />
				<Redirect from="*" to={{ pathname: "/login", state: props.location }} />
			</Switch>
		)
	}
}
