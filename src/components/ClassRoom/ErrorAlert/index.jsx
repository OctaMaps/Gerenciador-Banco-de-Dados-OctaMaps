import React from "react"

export default props => {
	const { errors } = props
	const renderErrors = errors => errors.map(error => <li>{error.title}</li>)
	return (
		<div className="alert alert-primary">
			<h1>Erro!</h1>
			<ul>{renderErrors(errors)}</ul>
		</div>
	)
}
