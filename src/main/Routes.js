import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router"
import { get, set } from "idb-keyval"

import Login from "../components/Login/Login"
import MainPage from "../components/MainPage"
import Auth from "../services/auth"

export default class Routes extends Component {
	state = { isAuthenticated: false, name: "" }
	componentWillMount() {
		const auth = Auth()
		auth
			.isAuthenticated()
			.then(isAuthenticated => this.setState({ isAuthenticated }))
		get("name").then(name => this.setState({ name }))
	}
	render() {
		const { isAuthenticated } = this.state
		if (!isAuthenticated) {
			return (
				<Switch>
					<Route path="/login" component={Login} />
					<Redirect from="*" to={{ pathname: "/login" }} />
				</Switch>
			)
		}
		return (
			<Switch>
				<Route
					path="/"
					component={props => <MainPage name={this.state.name} />}
				/>
				<Redirect to={{ pathname: "/" }} />
			</Switch>
		)
	}
}
