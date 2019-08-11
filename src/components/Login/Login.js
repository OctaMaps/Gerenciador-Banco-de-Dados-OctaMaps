import React, { Component } from "react"
import Auth from "../../main/auth"

const auth = Auth()

export default class Login extends Component {
	state = {
		email: "",
		password: ""
	}

	loginStyle = {
		textAlign: "center",
		height: "100vh",
		// display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}

	updateField = async event => {
		const { name, value } = event.target
		const valueHandle = value.trim()
		await this.setState({ [name]: valueHandle })
	}

	login = async () => {
		await auth.signin(this.state.email, this.state.password)
	}

	render() {
		return (
			<div style={this.loginStyle}>
				<form className="form">
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							className="form-control"
							type="email"
							name="email"
							placeholder="Digite seu Email"
							value={this.state.email}
							onChange={async event => await this.updateField(event)}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Senha</label>
						<input
							className="form-control"
							type="password"
							name="password"
							placeholder="Digite sua senha secreta"
							value={this.state.password}
							onChange={this.updateField}
						/>
					</div>
					<button
						type="button"
						onClick={async () => {
							await this.login()
						}}
						className="btn btn-primary"
					>
						Fazer login
					</button>
				</form>
			</div>
		)
	}
}
