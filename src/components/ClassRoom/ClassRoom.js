import React, { Component } from "react"
// import ReactDOMServer from "react-dom/server"
import Fuse from "fuse.js"
import Main from "../templates/Main"
import API from "../../services/API"
import CheckBox from "./form/CheckBox"
import TextInput from "./form/TextInput"
import Dropdown from "./form/Dropdown"
import TextInputWithIcon from "./form/TextInputWithIcon"
import Rows from "./table/Rows"
import TableHeaders from "./table/TableHeaders"
import SearchBar from "../TableHeader/SearchBar"
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
	showTableHeader: true,
	showTable: true,
	showForm: false,
	showFilter: false
}

const tituloBlocoList = [
	"Bloco A",
	"Bloco B",
	"Bloco C",
	"Bloco D",
	"Bloco E",
	"Bloco F"
]

const numeroPisoList = [0, 1, 2]

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

const checkBoxStyle = {
	margin: "10px"
}

const tableHeaderBtnStyle = {
	color: "#FFF",
	backgroundColor: "#2c3e50",
	marginRight: "10px",
	marginLeft: "10px",
	marginBottom: "10px"
}
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
			showTableHeader: !this.state.showTableHeader
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
	renderTableHeader = () => {
		if (this.state.showTableHeader) {
			return (
				<div className="row">
					<div className="col">
						<button
							style={tableHeaderBtnStyle}
							className="btn float-left"
							onClick={() => this.formToggle()}
						>
							<i className="fa fa-plus fa-fw" />
							Adicionar Sala
						</button>
						<button
							style={tableHeaderBtnStyle}
							className="btn float-left"
							onClick={() => this.filterToggle()}
						>
							<i className="fa fa-filter fa-fw" />
							Filtro
						</button>
					</div>
					<div className="col">
						<SearchBar
							value={this.state.searchQuery}
							placeholder="Pesquisa"
							onChange={value => this.updateSearchQuery(value)}
						/>
					</div>
				</div>
			)
		}
	}

	renderFilter = () => {
		if (this.state.showFilter && this.state.showTableHeader) {
			return (
				<div className="form-group">
					<div style={checkBoxStyle} className="form-row">
						{this.renderCheckBoxes(tituloBlocoList, "titulo_bloco")}
					</div>
					<div style={checkBoxStyle} className="form-row">
						{this.renderCheckBoxes(numeroPisoList, "numero_piso")}
						<div className="col" />
						<div className="col" />
						<div className="col" />
					</div>
				</div>
			)
		}
	}

	renderCheckBoxes = (values, field) => {
		let complement = ""
		if (field === "numero_piso") complement = "Piso "
		return values.map(item => {
			return (
				<div className="col">
					<CheckBox
						label={`${complement}${item}`}
						value={item}
						onChange={event => this.checkBoxToggle(event, field)}
						isChecked={this.state.isChecked[field][item]}
					/>
				</div>
			)
		})
	}

	renderTable = () => {
		if (this.state.showTable) {
			return (
				<div>
					<table className="table mt-4">
						<thead>
							<tr>
								<TableHeaders
									values={thList}
									listOrder={this.state.listOrder}
									onClick={this.listSort}
								/>
							</tr>
						</thead>
						<tbody>
							<Rows
								values={this.state.list}
								remove={this.remove}
								load={this.load}
							/>
						</tbody>
					</table>
				</div>
			)
		}
	}

	renderTh = () => {
		let icon
		return thList.map(item => {
			if (item.showSort) {
				icon =
					this.state.listOrder === "increasing" ? "fa-sort-up" : "fa-sort-down"
			} else {
				icon = "fa-sort text-muted"
			}
			return (
				<th onClick={() => this.listSort(item.id)}>
					<span>
						{item.label}
						<i className={`fa ${icon} fa-fw`} />
					</span>
				</th>
			)
		})
	}

	renderForm = () => {
		if (this.state.showForm) {
			const {
				titulo_bloco,
				numero_piso,
				codigo_sala,
				titulo_sala
			} = this.state.classRoom
			return (
				<form className="form">
					<div className="row">
						<Dropdown
							values={tituloBlocoList}
							label="Titulo do Bloco"
							name="titulo_bloco"
							value={titulo_bloco}
							onChange={async event => await this.updateField(event)}
						/>

						<Dropdown
							values={numeroPisoList}
							label="Numero do Piso"
							name="numero_piso"
							value={numero_piso}
							onChange={async event => await this.updateField(event)}
						/>

						<TextInputWithIcon
							values={[titulo_bloco[6], numero_piso]}
							label="Codigo da Sala"
							name="codigo_sala"
							value={codigo_sala}
							onChange={async event => await this.updateField(event)}
							maxLength={3}
						/>

						<TextInput
							label="Titulo da Sala"
							name="titulo_sala"
							value={titulo_sala}
							onChange={async event => await this.updateField(event)}
						/>
					</div>
					<div className="row">
						<div className="col-12 d-flex justify-content-end">
							<button
								type="button"
								onClick={() => this.save(this.state.classRoom)}
								className="btn btn-primary"
							>
								{this.state.saveButtonText}
							</button>
							<button
								type="button"
								className="btn btn-secondary ml-2"
								onClick={() => this.clear()}
							>
								Cancelar
							</button>
						</div>
					</div>
				</form>
			)
		}
	}

	render() {
		return (
			<Main {...headerProps}>
				{this.renderTableHeader()}
				{this.renderFilter()}
				{this.renderForm()}
				{this.renderTable()}
			</Main>
		)
	}
}
