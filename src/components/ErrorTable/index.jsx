import React from "react"

export default props => {
	const errors = props.errorsTable
	const renderErrors = errors => errors.map(error => <li>{error.title}</li>)
	return (
		<div className="alert alert-danger">
			<h1>Erro!</h1>
			<ul>{renderErrors(errors)}</ul>
		</div>
	)
}
