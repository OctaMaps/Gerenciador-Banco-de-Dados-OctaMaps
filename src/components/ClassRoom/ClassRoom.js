import React, { Component } from "react"
import ReactDOMServer from "react-dom/server"
import Fuse from "fuse.js"
import Main from "../templates/Main"
import API from "../../services/API"
import Form from "./Form"
import Table from "./Table"
import Filter from "./Filter"
import TableOptions from "./TableOptions"
const api = API("http://localhost:3001/classRooms")

const headerProps = {
	icon: "book",
	title: "Salas",
	subtitle: "Listagem das salas"
}

const initialState = {
	classRoom: {
		id: "",
		titulo_bloco: "Bloco A",
		numero_piso: "0",
		codigo_sala: "",
		titulo_sala: ""
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
	showFilter: false
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

const fuseOptions = {
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 3,
	keys: ["titulo_bloco", "codigo_sala", "titulo_sala"]
}

export default class ClassRoom extends Component {
	state = { ...initialState }

	async componentWillMount() {
		const list = await api.get(api.baseUrl)
		this.setState({ initialList: list })
		this.setState({ list })
		this.listSort("id")
	}

	clear = () => {
		const { classRoom } = this.state
		classRoom.codigo_sala = this.codigoSalaHandling(classRoom, "join")
		this.setState({ classRoom })
		this.setState({ classRoom: initialState.classRoom })
		this.formToggle()
		this.setState({ saveButtonText: initialState.saveButtonText })
	}

	save = async classRoom => {
		try {
			classRoom.codigo_sala = this.codigoSalaHandling(classRoom, "join")
			const response = await api.save(classRoom)
			const list = this.getUpdatedList(response.data)
			this.setState({
				list,
				classRoom: initialState.classRoom,
				saveButtonText: initialState.saveButtonText
			})
			this.formToggle()
		} catch (error) {
			throw new Error(error)
		}
	}

	load = classRoom => {
		classRoom.codigo_sala = this.codigoSalaHandling(classRoom, "slice")
		this.setState({ classRoom })
		this.setState({ saveButtonText: "Salvar alterações" })
		this.formToggle()
	}

	remove = async classRoom => {
		try {
			await api.remove(api.baseUrl, classRoom)
			const list = this.state.list.filter(element => element !== classRoom)
			this.setState({ list })
		} catch (error) {
			throw new Error(error)
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
			showTableOptions: !this.state.showTableOptions
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

	codigoSalaHandling = (classRoom, operation) => {
		let { codigo_sala } = classRoom
		if (operation === "join") {
			const { numero_piso, titulo_bloco } = classRoom
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

	getUpdatedList = classRoom => {
		const list = this.state.list.filter(el => el.id !== classRoom.id)
		list.unshift(classRoom)
		return list
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
		const { name, value } = event.target
		const classRoom = { ...this.state.classRoom }
		classRoom[name] = value
		await this.setState({ classRoom })
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
		api.fetchAndGetList(html)
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
					classRoom={this.state.classRoom}
					updateField={this.updateField}
					save={this.save}
					clear={this.clear}
					saveButtonText={this.state.saveButtonText}
				/>
			)
		}
	}

	render() {
		return (
			<Main {...headerProps}>
				{this.renderTableOptions()}
				{this.renderFilter()}
				{this.renderForm()}
				{this.renderTable()}
			</Main>
		)
	}
}
