import React, { Component } from "react"
import Main from "../templates/Main"
import Form from "../Form"
import updateFieldUtil from "../../utils/updateField"
import formValidationUtil from "../../utils/formValidation"
import getCacheData from "../../services/getCacheData"
import API from "../../services/API"

// Trabalhar nas funções da sessão

const api = API()

const headerProps = {
	icon: "user-circle",
	title: "Conta",
	subtitle: "Configurações da conta"
}

const warningList = [
	'A senha padrão de uma conta recém criada é "12345678"',
	"Apenas o usuário responsável pelo gerenciamento de usuários pode alterar as permissões de cada usuário"
]

const initialState = {
	account: {
		id: "",
		name_user: "",
		email_user: "",
		siape_user: "",
		old_password_user: "",
		new_password_user: "",
		right_user: ""
	},
	fieldList: [
		{
			type: "TextInput",
			label: "Nome do Usuário",
			name: "name_user"
		},
		{
			type: "TextInput",
			label: "Email do Usuário",
			name: "email_user"
		},
		{
			type: "Password",
			label: "Senha atual",
			name: "old_password_user"
		},
		{
			type: "Password",
			label: "Nova senha",
			name: "new_password_user"
		},
		{
			type: "TextInput",
			label: "SIAPE",
			name: "siape_user"
		}
	],
	saveButtonText: "Salvar Alterações",
	errors: [],
	showForm: true
}

export default class User extends Component {
	state = { ...initialState }
	async componentWillMount() {
		const {
			userName,
			userEmail,
			userSiape,
			userID,
			userRight
		} = await getCacheData()
		const account = {
			id: userID,
			name_user: userName,
			email_user: userEmail,
			siape_user: userSiape,
			right_user: userRight,
			old_password_user: "",
			new_password_user: ""
		}
		this.setState({ account })
		api.refreshToken()
	}

	clear = async () => {
		const { account } = this.state
		this.setState({ account })
		const { userName, userEmail, userSiape } = await getCacheData()
		const originalAccount = {
			name_user: userName,
			email_user: userEmail,
			siape_user: userSiape
		}
		this.setState({ account: originalAccount })
		this.setState({ saveButtonText: initialState.saveButtonText })
		this.setState({ fieldList: initialState.fieldList })
	}

	save = async () => {
		const { account } = this.state
		if (this.state.errors.length < 1) {
			try {
				await api.account.save(account)
				this.setState({
					account: initialState.account
				})
				await this.setState({ errors: [] })
			} catch (error) {
				if (error === 401 || error === 403) {
					const error = { title: "Sem permissão para essa operação" }
					const { errors } = this.state
					errors.push(error)
					// Evitar adicionar erro repetido no array de erros
					return await this.setState({ errors })
				}
				if (error.title) {
					const { errors } = this.state
					errors.push({ title: error.title })
					return await this.setState({ errors })
				}
				const { errors } = this.state
				errors.push({ title: "Erro desconhecido" })
				return await this.setState({ errors })
			}
		}
	}

	updateField = async event => {
		const account = await updateFieldUtil(event, this.state.account)
		this.setState({ account })
	}

	handleSubmit = async event => {
		event.preventDefault()
		const valid = await this.formValidation()
		if (valid) this.save()
	}

	formValidation = async () => {
		const { account, errors } = this.state
		const { isValid, formErrors } = await formValidationUtil(account, errors)
		if (!isValid) {
			this.setState({ errors: formErrors })
			return false
		}
		if (isValid) {
			this.setState({ errors: [] })
			return true
		}
	}

	renderForm = () => {
		if (this.state.showForm) {
			return (
				<Form
					errors={this.state.errors}
					updateField={this.updateField}
					handleSubmit={this.handleSubmit}
					clear={this.clear}
					clearButtonText="Restaurar informações originais"
					saveButtonText={this.state.saveButtonText}
					fieldState={this.state.account}
					fieldList={this.state.fieldList}
					warnings={warningList}
				/>
			)
		}
	}
	render() {
		return <Main {...headerProps}>{this.renderForm()}</Main>
	}
}
