import React, { Component } from "react"
import { del } from "idb-keyval"
import { Link } from "react-router-dom"

export default class Login extends Component {
	loginStyle = {
		textAlign: "center",
		height: "100vh",
		// display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}

	exit = () => {
		del("token")
	}

	goBack = () => {
		return <Link to="/" />
	}

	render() {
		return (
			<div style={this.loginStyle}>
				<button
					onClick={() => {
						this.goBack()
					}}
					className="btn btn-secondary"
					type="button"
				>
					Continuar
				</button>
				<button
					onClick={() => {
						this.exit()
					}}
					className="btn btn-danger"
					type="button"
				>
					Sair
				</button>
			</div>
		)
	}
}
