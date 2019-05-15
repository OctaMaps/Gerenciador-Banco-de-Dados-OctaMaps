import React from "react"
import SearchBar from "./SearchBar"

export default props => {
	const tableOptionsBtnStyle = {
		color: "#FFF",
		backgroundColor: "#2c3e50",
		marginRight: "10px",
		marginLeft: "10px",
		marginBottom: "10px",
		fontWeight: "bold"
	}

	const {
		formToggle,
		filterToggle,
		searchQuery,
		searchOnChange,
		generatePDF
	} = props

	return (
		<div className="row">
			<div className="col">
				<button
					style={tableOptionsBtnStyle}
					className="btn float-left"
					onClick={() => formToggle()}
				>
					<i className="fa fa-plus fa-fw" />
					Adicionar Sala
				</button>
				<button
					style={tableOptionsBtnStyle}
					className="btn float-left"
					onClick={() => filterToggle()}
				>
					<i className="fa fa-filter fa-fw" />
					Filtro
				</button>
				<button
					style={tableOptionsBtnStyle}
					className="btn float-left"
					onClick={() => generatePDF()}
				>
					<i className="fa fa-print fa-fw" />
					Imprimir Tabela
				</button>
			</div>
			<div className="col">
				<SearchBar
					value={searchQuery}
					placeholder="Pesquisa"
					onChange={value => searchOnChange(value)}
				/>
			</div>
		</div>
	)
}
