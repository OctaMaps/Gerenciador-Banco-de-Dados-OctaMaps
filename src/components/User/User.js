import React, { Component } from "react"
import exists from "../../utils/exists"
import Main from "../templates/Main"
import Table from "../Table"
import Form from "../Form"
import TableOptions from "../TableOptions"
import API from "../../services/API"
import ErrorTable from "../ErrorTable"
import updateFieldUtil from "../../utils/updateField"
import formValidationUtil from "../../utils/formValidation"
import getUpdatedList from "../../utils/getUpdatedList"

const api = API()
//Construir as funções e o formulário
//Ajeitar formulário

const thList = [
	{
		id: "id",
		label: "ID",
		showSort: false
	},
	{
		id: "name_user",
		label: "Nome",
		showSort: false
	},
	{
		id: "email_user",
		label: "Email",
		showSort: false
	},
	{
		id: "siape_user",
		label: "SIAPE",
		showSort: false
	},
	{
		id: "right_user",
		label: "Permissão",
		showSort: false
	}
]

const headerProps = {
	icon: "user",
	title: "Usuários",
	subtitle: "Listagem de usuários registrados"
}

const rightList = ["Root", "Admin", "Viewer"]

const initialState = {
	user: {
		id: "",
		name_user: "",
		email_user: "",
		siape_user: "",
		right_user: "Root",
		password_user: "12345678"
	},
	initialList: [],
	list: [],
	listOrder: "increasing",
	listSortKey: "id",
	showErrorTable: false,
	showTableOptions: true,
	showTable: true,
	showForm: false,
	errorsTable: [],
	errors: [],
	saveButtonText: "Adicionar Usuário",
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
			type: "TextInput",
			label: "SIAPE",
			name: "siape_user"
		},
		{
			type: "Dropdown",
			values: rightList,
			label: "Nível de permissão",
			name: "right_user"
		}
	]
}

export default class User extends Component {
	state = { ...initialState }
	// Ajustar questões de validação de formulário no server e client side

	async componentWillMount() {
		try {
			const list = await api.user.get()
			this.setState({ initialList: list })
			this.setState({ list })
			this.listSort("id")
		} catch (error) {
			let errorTitle = { title: "Undefined error, please contact the admin" }
			if (error.status && error.statusText) {
				const errorString = `${error.status}: ${error.statusText}`
				errorTitle = { title: errorString }
			}
			const { errorsTable } = this.state
			if (!exists(errorTitle, errorsTable, "title"))
				errorsTable.push(errorTitle)
			if (this.state.showForm) this.formToggle()
			await this.setState({ errorsTable, showErrorTable: true })
		}
	}

	load = user => {
		this.setState({ user })
		this.setState({
			fieldList: [
				{
					type: "Dropdown",
					values: rightList,
					label: "Nível de permissão",
					name: "right_user"
				}
			]
		})
		this.setState({ saveButtonText: "Salvar alterações" })
		if (!this.state.showForm) this.setState({ errors: [], errorsTable: [] })
		this.formToggle()
	}

	remove = async user => {
		try {
			await api.user.remove(user)
			const list = this.state.list.filter(element => element !== user)
			this.setState({ list })
		} catch (error) {
			if (error === 401) {
				const error = { title: "Sem permissão para essa operação" }
				const { errorsTable } = this.state
				if (!errorsTable.includes(error))
					if (!exists(error, errorsTable, "title")) errorsTable.push(error)
				this.formToggle()
				this.setState({ errorsTable, showErrorTable: true })
			}
			const { errorsTable } = this.state
			errorsTable.push({ title: error.message ? error.message : error })
			this.formToggle()
			this.setState({ errorsTable, showErrorTable: true })
		}
	}

	clear = () => {
		const { user } = this.state
		this.setState({ user })
		this.setState({ user: initialState.user })
		this.formToggle()
		this.setState({ saveButtonText: initialState.saveButtonText })
		this.setState({ fieldList: initialState.fieldList })
	}

	save = async () => {
		const { user } = this.state
		if (this.state.errors.length < 1) {
			try {
				const response = await api.user.save(user)
				const list = getUpdatedList(user.id ? user : response, this.state.list)
				this.setState({
					list,
					user: initialState.user,
					saveButtonText: initialState.saveButtonText
				})
				await this.setState({ errors: [] })
				this.formToggle()
				this.setState({ fieldList: initialState.fieldList })
			} catch (error) {
				if (error === 401 || error === 403) {
					const error = { title: "Sem permissão para essa operação" }
					const { errorsTable } = this.state
					if (!exists(error, errorsTable, "title")) errorsTable.push(error)
					this.formToggle()
					return await this.setState({ errorsTable, showErrorTable: true })
				}
				const { errorsTable } = this.state
				errorsTable.push({ title: error.message ? error.message : error })
				this.formToggle()
				return await this.setState({ errorsTable, showErrorTable: true })
			}
		}
	}

	handleSubmit = async event => {
		event.preventDefault()
		const valid = await this.formValidation()
		if (valid) this.save()
	}

	formValidation = async () => {
		const { user, errors } = this.state
		const { isValid, formErrors } = await formValidationUtil(user, errors)
		if (!isValid) {
			this.setState({ errors: formErrors })
			return false
		}
		if (isValid) return true
	}

	listOrderToggle = async state => {
		if (state.listOrder === "increasing")
			await this.setState({ listOrder: "decreasing" })
		if (state.listOrder === "decreasing")
			await this.setState({ listOrder: "increasing" })
	}

	thListToggle = field => {
		thList.forEach(item => {
			if (item.id === field) {
				item.showSort = true
			} else {
				item.showSort = false
			}
		})
	}

	formToggle = () => {
		this.setState({
			showForm: !this.state.showForm,
			showTable: !this.state.showTable,
			showTableOptions: !this.state.showTableOptions,
			errors: []
		})
	}

	listSort = async field => {
		if (this.state.listSortKey === field) {
			await this.listOrderToggle(this.state)
			this.thListToggle(field)
		} else {
			this.setState({ listSortKey: field })
			this.thListToggle(field)
		}
		let list = undefined
		const { listOrder } = this.state
		list = this.state.list.sort((a, b) => {
			a[field] = Number(a[field]) ? Number(a[field]) : a[field]
			b[field] = Number(b[field]) ? Number(b[field]) : b[field]
			if (listOrder === "increasing") {
				if (a[field] > b[field]) return 1
				if (a[field] < b[field]) return -1
			}
			if (listOrder === "decreasing") {
				if (a[field] > b[field]) return -1
				if (a[field] < b[field]) return 1
			}
			return 0
		})
		this.setState({ list })
	}

	updateField = async event => {
		const user = await updateFieldUtil(event, this.state.user)
		this.setState({ user })
	}

	renderTable = () => {
		if (this.state.showTable) {
			return (
				<Table
					thList={thList}
					listOrder={this.state.listOrder}
					onClick={this.listSort}
					list={this.state.list}
					remove={this.remove}
					load={this.load}
				/>
			)
		}
	}

	renderTableOptions = () => {
		if (this.state.showTableOptions) {
			return (
				<TableOptions
					formToggle={this.formToggle}
					showAddButton={true}
					showFilterButton={false}
					showPrintButton={false}
					showSearchBar={false}
					addButtonText={"Adicionar usuário"}
				/>
			)
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
					saveButtonText={this.state.saveButtonText}
					fieldState={this.state.user}
					fieldList={this.state.fieldList}
				/>
			)
		}
	}

	renderErrorTable = () => {
		if (this.state.showErrorTable) {
			const { errorsTable } = this.state
			return <ErrorTable errorsTable={errorsTable} />
		}
	}

	render() {
		return (
			<Main {...headerProps}>
				{this.renderErrorTable()}
				{this.renderTableOptions()}
				{this.renderTable()}
				{this.renderForm()}
			</Main>
		)
	}
}
