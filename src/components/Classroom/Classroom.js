import React, { Component } from "react"
import ReactDOMServer from "react-dom/server"
import Fuse from "fuse.js"
import exists from "../../utils/exists"
import Main from "../templates/Main"
import API from "../../services/API"
import Form from "../Form"
import Table from "../Table"
import Filter from "./Filter"
import TableOptions from "../TableOptions"
import ErrorTable from "../ErrorTable"
import updateFieldUtil from "../../utils/updateField"
import formValidationUtil from "../../utils/formValidation"
import getUpdatedList from "../../utils/getUpdatedList"
const api = API()

const headerProps = {
	icon: "book",
	title: "Salas",
	subtitle: "Listagem das salas"
}

const initialState = {
	classroom: {
		id: "",
		titulo_bloco: "Bloco A",
		numero_piso: "0",
		codigo_sala: "",
		titulo_sala: "",
		titulo_campus: "Octayde Jorge Da Silva"
	},
	initialList: [],
	list: [],
	listOrder: "increasing",
	listSortKey: "id",
	searchQuery: "",
	isChecked: {
		titulo_bloco: {
			"Bloco A": false,
			"Bloco B": false,
			"Bloco C": false,
			"Bloco D": false,
			"Bloco E": false,
			"Bloco F": false
		},
		numero_piso: {
			"0": false,
			"1": false,
			"2": false
		}
	},

	saveButtonText: "Adicionar Sala",
	showTableOptions: true,
	showTable: true,
	showForm: false,
	showFilter: false,
	showErrorTable: false,
	errors: [],
	errorsTable: []
}

const thList = [
	{
		id: "id",
		label: "ID",
		showSort: false
	},
	{
		id: "titulo_bloco",
		label: "Bloco",
		showSort: false
	},
	{
		id: "numero_piso",
		label: "Numero do Piso",
		showSort: false
	},
	{
		id: "codigo_sala",
		label: "Código da Sala",
		showSort: false
	},
	{
		id: "titulo_sala",
		label: "Titulo da Sala",
		showSort: false
	}
]

const tituloBlocoList = [
	"Bloco A",
	"Bloco B",
	"Bloco C",
	"Bloco D",
	"Bloco E",
	"Bloco F"
]
const numeroPisoList = ["0", "1", "2"]

const fuseOptions = {
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 3,
	keys: ["titulo_bloco", "codigo_sala", "titulo_sala"]
}

export default class Classroom extends Component {
	state = { ...initialState }

	fieldList = [
		{
			type: "Dropdown",
			values: tituloBlocoList,
			label: "Titulo do Bloco",
			name: "titulo_bloco"
		},
		{
			type: "Dropdown",
			values: numeroPisoList,
			label: "Número do Piso",
			name: "numero_piso"
		},
		{
			type: "TextInputWithIcon",
			label: "Código da Sala",
			name: "codigo_sala",
			maxLength: 3
		},
		{
			type: "TextInput",
			label: "Titulo da Sala",
			name: "titulo_sala"
		}
	]

	async componentWillMount() {
		try {
			const list = await api.classroom.get()
			this.setState({ initialList: list })
			this.setState({ list })
			this.listSort("id")
			api.refreshToken()
		} catch (error) {
			let errorTitle = { title: "Undefined error, please contact the admin" }
			if (error.status && error.statusText) {
				const errorString = `${error.status}: ${error.statusText}`
				errorTitle = { title: errorString }
			}
			const { errorsTable } = this.state
			if (!errorsTable.includes(errorTitle))
				if (!exists(errorTitle, errorsTable, "title"))
					errorsTable.push(errorTitle)
			if (this.state.showForm) this.formToggle()
			await this.setState({ errorsTable, showErrorTable: true })
		}
	}

	clear = () => {
		const { classroom } = this.state
		classroom.codigo_sala = this.codigoSalaHandling(classroom, "join")
		this.setState({ classroom })
		this.setState({ classroom: initialState.classroom })
		this.formToggle()
		this.setState({ saveButtonText: initialState.saveButtonText })
	}

	save = async () => {
		const { classroom } = this.state
		if (this.state.errors.length < 1) {
			try {
				if (classroom.numero_piso)
					classroom.numero_piso = String(classroom.numero_piso)
				classroom.codigo_sala = this.codigoSalaHandling(classroom, "join")
				classroom.titulo_campus = "Octayde Jorge Da Silva"
				const response = await api.classroom.save(classroom)
				const list = getUpdatedList(
					classroom.id ? classroom : response,
					this.state.list
				)
				this.setState({
					list,
					classroom: initialState.classroom,
					saveButtonText: initialState.saveButtonText
				})
				await this.setState({ errors: [] })
				this.formToggle()
			} catch (error) {
				if (error === 401) {
					const error = { title: "Sem permissão para essa operação" }
					const { errorsTable } = this.state
					if (!errorsTable.includes(error))
						if (!exists(error, errorsTable, "title")) errorsTable.push(error)
					this.formToggle()
					await this.setState({ errorsTable, showErrorTable: true })
				}
				const { errorsTable } = this.state
				errorsTable.push({ title: error.message ? error.message : error })
				this.formToggle()
				await this.setState({ errorsTable, showErrorTable: true })
			}
		}
	}

	load = classroom => {
		classroom.codigo_sala = this.codigoSalaHandling(classroom, "slice")
		classroom.numero_piso = classroom.numero_piso.toString()
		this.setState({ classroom })
		this.setState({ saveButtonText: "Salvar alterações" })
		if (!this.state.showForm) this.setState({ errors: [], errorsTable: [] })
		this.formToggle()
	}

	remove = async classroom => {
		try {
			await api.classroom.remove(classroom)
			const list = this.state.list.filter(element => element !== classroom)
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

	checkBoxToggle = (event, field) => {
		const { value } = event.target
		const isChecked = this.state.isChecked
		isChecked[field][value] = !isChecked[field][value]
		this.setState({ isChecked })
		this.listFilter()
	}

	filterToggle = () => {
		const { showFilter } = this.state
		this.setState({ showFilter: !showFilter })
	}

	handleSubmit = async event => {
		event.preventDefault()
		const valid = await this.formValidation()
		if (valid) this.save()
	}

	formValidation = async () => {
		const { classroom, errors } = this.state
		const { isValid, formErrors } = await formValidationUtil(classroom, errors)
		if (!isValid) {
			this.setState({ errors: formErrors })
			return false
		}
		if (isValid) {
			this.setState({ errors: [] })
			return true
		}
	}

	codigoSalaHandling = (classroom, operation) => {
		let { codigo_sala } = classroom
		if (operation === "join") {
			const { numero_piso, titulo_bloco } = classroom
			codigo_sala = this.addZeroToCodigoSala(codigo_sala)
			const new_codigo_sala = titulo_bloco[6] + numero_piso + codigo_sala
			return new_codigo_sala
		}
		if (operation === "slice") {
			codigo_sala = this.addZeroToCodigoSala(codigo_sala)
			return codigo_sala.slice(2)
		}
	}

	addZeroToCodigoSala = codigo_sala => {
		if (codigo_sala.length < 3) {
			if (
				(isNaN(codigo_sala) && codigo_sala.length === 2) ||
				(!isNaN(codigo_sala) && codigo_sala.length === 1)
			) {
				return "0" + codigo_sala
			}
			return codigo_sala
		}
		return codigo_sala
	}

	updateSearchQuery = event => {
		const searchQuery = event.target.value
		this.setState({ searchQuery })
		if (searchQuery === "" || searchQuery.length < 4) {
			this.setState({ list: this.state.initialList })
		} else {
			this.listSearch(this.state.searchQuery)
		}
	}

	updateField = async event => {
		const classroom = await updateFieldUtil(event, this.state.classroom)
		this.setState({ classroom })
	}

	listSearch = term => {
		const fuse = new Fuse(this.state.initialList, fuseOptions)
		const list = fuse.search(term)
		this.setState({ list })
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

	listFilter = () => {
		const { isChecked, initialList } = this.state
		const filterTerms = {
			titulo_bloco: Object.keys(isChecked.titulo_bloco).filter(
				value => isChecked.titulo_bloco[value]
			),
			numero_piso: Object.keys(isChecked.numero_piso).filter(
				value => isChecked.numero_piso[value]
			)
		}

		if (!filterTerms.titulo_bloco.length && !filterTerms.numero_piso.length) {
			this.setState({ list: initialList })
		} else {
			const list = this.state.initialList.filter(item => {
				item.numero_piso = String(item.numero_piso)
				if (filterTerms.titulo_bloco.length && !filterTerms.numero_piso.length)
					return filterTerms.titulo_bloco.includes(item.titulo_bloco)
				if (filterTerms.numero_piso.length && !filterTerms.titulo_bloco.length)
					return filterTerms.numero_piso.includes(item.numero_piso)
				if (filterTerms.titulo_bloco.length && filterTerms.numero_piso.length)
					return (
						filterTerms.titulo_bloco.includes(item.titulo_bloco) &&
						filterTerms.numero_piso.includes(item.numero_piso)
					)
				return false
			})
			this.setState({ list })
		}
	}

	generatePDF = () => {
		const html = ReactDOMServer.renderToStaticMarkup(
			<Table
				thList={thList}
				listOrder={this.state.listOrder}
				onClick={this.listSort}
				list={this.state.list}
				remove={this.remove}
				load={this.load}
			/>
		)
		api.classroom.fetchAndGetList(html)
	}

	renderTableOptions = () => {
		if (this.state.showTableOptions) {
			return (
				<TableOptions
					formToggle={this.formToggle}
					filterToggle={this.filterToggle}
					searchQuery={this.state.searchQuery}
					searchOnChange={this.updateSearchQuery}
					generatePDF={this.generatePDF}
					showAddButton={true}
					showFilterButton={true}
					showPrintButton={true}
					showSearchBar={true}
					addButtonText={"Adicionar sala"}
				/>
			)
		}
	}

	renderFilter = () => {
		if (this.state.showFilter && this.state.showTableOptions) {
			return (
				<Filter
					isChecked={this.state.isChecked}
					onChange={this.checkBoxToggle}
				/>
			)
		}
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

	renderForm = () => {
		if (this.state.showForm) {
			return (
				<Form
					errors={this.state.errors}
					updateField={this.updateField}
					handleSubmit={this.handleSubmit}
					clear={this.clear}
					saveButtonText={this.state.saveButtonText}
					fieldState={this.state.classroom}
					fieldList={this.fieldList}
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
				{this.renderFilter()}
				{this.renderForm()}
				{this.renderTable()}
			</Main>
		)
	}
}
