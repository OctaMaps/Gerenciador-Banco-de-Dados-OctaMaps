import React, { Component } from "react"
import Main from "../templates/Main"
import { del } from "idb-keyval"
import { Link } from "react-router-dom"

const headerProps = {
	icon: "times",
	title: "Sair",
	subtitle: "Sair da sessão"
}

export default class Login extends Component {
	loginStyle = {
		textAlign: "center",
		height: "100vh",
		alignItems: "center",
		justifyContent: "center"
	}

	exit = () => {
		del("token")
		del("name")
		del("right")
		del("siape")
		del("email")
	}

	goBack = () => {
		return <Link to="/" />
	}

	render() {
		return (
			<Main {...headerProps}>
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
			</Main>
		)
	}
}
