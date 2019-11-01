import React from "react"
import TextInput from "./TextInput"
import Dropdown from "./Dropdown"
import TextInputWithIcon from "./TextInputWithIcon"
import ErrorAlert from "../Classroom/ErrorAlert"

export default props => {
	const { errors, fieldState } = props

	const renderFields = fieldList => {
		return fieldList.map(field => {
			let values
			const { type, name, label } = field
			switch (type) {
				case "Dropdown":
					values = field.values
					return (
						<Dropdown
							style={renderError(name)}
							values={values}
							label={label}
							name={name}
							value={fieldState[name]}
							onChange={event => props.updateField(event)}
						/>
					)
				case "TextInput":
					return (
						<TextInput
							style={renderError(name)}
							label={label}
							name={name}
							value={fieldState[name]}
							onChange={event => props.updateField(event)}
						/>
					)
				case "TextInputWithIcon":
					const { maxLength } = field
					if (fieldState.titulo_bloco && fieldState.numero_piso) {
						values = [fieldState.titulo_bloco[6], fieldState.numero_piso]
					}
					return (
						<TextInputWithIcon
							style={renderError(name)}
							values={values}
							label={label}
							name={name}
							value={fieldState[name]}
							onChange={event => props.updateField(event)}
							maxLength={maxLength}
						/>
					)
				default:
					return <></>
			}
		})
	}

	const renderError = field => {
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
				<div className="row">{renderFields(props.fieldList)}</div>
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
