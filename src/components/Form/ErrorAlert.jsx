import React from "react"

export default props => {
	const { errors } = props
	const renderErrors = errors => errors.map(error => <li>{error.title}</li>)
	return (
		<div className="alert alert-danger">
			<h2>Erro!</h2>
			<ul>{renderErrors(errors)}</ul>
		</div>
	)
}
