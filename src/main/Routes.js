import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router"
import { get } from "idb-keyval"

import Login from "../components/Login/Login"
import MainPage from "../components/MainPage"
import API from "../services/API"

const api = API()

export default class Routes extends Component {
	state = { isAuthenticated: false, name: "" }
	async componentWillMount() {
		const isAuthenticated = await api.auth.isValidToken()
		const name = await get("name")
		this.setState({ isAuthenticated })
		this.setState({ name })
	}
	render() {
		const { isAuthenticated } = this.state
		if (!isAuthenticated) {
			return (
				<Switch>
					<Route path="/gerenciador/login" component={Login} />
					<Redirect
						from="*"
						to={{ pathname: "/gerenciador/login" }}
					/>
				</Switch>
			)
		}
		return (
			<Switch>
				<Route
					path="/gerenciador"
					component={props => <MainPage name={this.state.name} />}
				/>
				<Redirect to={{ pathname: "/gerenciador" }} />
			</Switch>
		)
	}
}
