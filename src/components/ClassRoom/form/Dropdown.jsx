import React from "react"

export default props => {
	const showOptions = array => {
		return array.map(item => <option>{item}</option>)
	}
	return (
		<div className="col-12 col-md-6">
			<div className="form-group">
				<label>{props.label}</label>
				<select
					value={props.value}
					onChange={props.onChange}
					className="form-control"
					name={props.name}
				>
					{showOptions(props.values)}
				</select>
			</div>
		</div>
	)
}
