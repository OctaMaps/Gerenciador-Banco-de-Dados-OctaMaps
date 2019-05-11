import React from "react"

export default props => {
	const { label, name, value, onChange } = props
	return (
		<div className="col-12 col-md-6">
			<div className="form-group">
				<label htmlFor={name}>{label}</label>
				<input
					type="text"
					className="form-control"
					name={name}
					value={value}
					onChange={onChange}
					placeholder={label}
				/>
			</div>
		</div>
	)
}
