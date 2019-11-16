import React, { Component } from "react"
import API from "../../services/API"

const api = API()

export default class Login extends Component {
	state = {
		email: "",
		password: "",
		showMessage: false,
		message: "",
		colorOfMessage: ""
	}

	loginStyle = {
		textAlign: "center",
		height: "100vh",
		// display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}

	showMessage = (message, color) => {
		if (this.state.showMessage) {
			const { colorOfMessage, message } = this.state
			return <p style={{ color: colorOfMessage }}>{message}</p>
		}
	}

	updateField = async event => {
		const { name, value } = event.target
		const valueHandle = value.trim()
		await this.setState({ [name]: valueHandle })
	}

	login = async () => {
		const response = await api.auth.signin(
			this.state.email,
			this.state.password
		)
		try {
			const { color, message } = response
			if (color && message) {
				let colorOfMessage
				if (color === "red") {
					colorOfMessage = "#fc0f03"
				}
				if (color === "green") {
					colorOfMessage = "#32e809"
				}
				await this.setState({ message, colorOfMessage })
				this.setState({ showMessage: true })
			}
		} catch (error) {
			const message = "Erro interno - Servidor Indisponível"
			const colorOfMessage = "#fc0f03"
			await this.setState({ message, colorOfMessage })
			this.setState({ showMessage: true })
		}
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
					{this.showMessage()}
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
