import React from "react"
import TextInput from "./TextInput"
import Dropdown from "./Dropdown"
import TextInputWithIcon from "./TextInputWithIcon"
import ErrorAlert from "../ErrorAlert"

export default props => {
	const { errors } = props
	const tituloBlocoList = [
		"Bloco A",
		"Bloco B",
		"Bloco C",
		"Bloco D",
		"Bloco E",
		"Bloco F"
	]
	const numeroPisoList = [0, 1, 2]
	const {
		titulo_bloco,
		numero_piso,
		codigo_sala,
		titulo_sala
	} = props.classroom

	const renderError = field => {
		// Execução só uma vez
		if (errors.length >= 1) {
			const fieldsWithError = errors.reduce((accumulator, currentError) => {
				const { fields } = currentError
				accumulator = [...accumulator] + [...fields]
				return accumulator
			}, [])
			const errorInputStyle = {
				borderColor: "rgb(248, 215, 218)",
				boxShadow: "0 0 0 0.2rem rgba(205, 50, 65, 0.7)",
				backgroundColor: "rgb(248, 215, 218)"
			}
			if (fieldsWithError.includes(field)) {
				console.log(field)
				return errorInputStyle
			}
		} else {
			return null
		}
	}

	const renderErrorAlert = () => {
		if (errors.length >= 1) {
			return <ErrorAlert errors={errors} />
		}
	}

	return (
		<div>
			{renderErrorAlert()}
			<form className="form" onSubmit={props.handleSubmit}>
				<div className="row">
					<Dropdown
						style={renderError("titulo_bloco")}
						values={tituloBlocoList}
						label="Titulo do Bloco"
						name="titulo_bloco"
						value={titulo_bloco}
						onChange={event => props.updateField(event)}
					/>

					<Dropdown
						style={renderError("numero_piso")}
						values={numeroPisoList}
						label="Numero do Piso"
						name="numero_piso"
						value={numero_piso}
						onChange={event => props.updateField(event)}
					/>

					<TextInputWithIcon
						style={renderError("codigo_sala")}
						values={[titulo_bloco[6], numero_piso]}
						label="Codigo da Sala"
						name="codigo_sala"
						value={codigo_sala}
						onChange={event => props.updateField(event)}
						maxLength={3}
					/>

					<TextInput
						style={renderError("titulo_sala")}
						label="Titulo da Sala"
						name="titulo_sala"
						value={titulo_sala}
						onChange={event => props.updateField(event)}
					/>
				</div>
				<div className="row">
					<div className="col-12 d-flex justify-content-end">
						<button type="submit" className="btn btn-primary">
							{props.saveButtonText}
						</button>
						<button
							type="button"
							className="btn btn-secondary ml-2"
							onClick={() => props.clear()}
						>
							Cancelar
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}
