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
	} = props.classRoom

	// const errors = [
	// 	{
	// 		title: "erro",
	// 		fields: "titulo_campus"
	// 	}
	// ]

	// Problemas para renderizar

	const renderError = field => {
		if (errors.length >= 1) {
			const fieldsWithError = errors.filter(error =>
				error.fields.includes(field)
			)
			const errorInputStyle = {
				borderColor: "#cc0000",
				boxShadow: "0 0 0 0.2rem #ff3333"
			}
			if (fieldsWithError.includes(field)) return errorInputStyle
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
			<form className="form">
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
						<button
							type="submit"
							onClick={() => props.save(props.classRoom)}
							className="btn btn-primary"
						>
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
