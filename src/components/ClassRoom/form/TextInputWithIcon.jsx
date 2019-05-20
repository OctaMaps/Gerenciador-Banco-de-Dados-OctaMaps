import React from "react"

export default props => {
	const { label, name, value, onChange, values, maxLength, style } = props
	const spanStyle = {
		padding: "4px",
		fontSize: "110%"
	}
	const textInputStyle = {
		paddingLeft: "3px",
		fontSize: "110%"
	}
	const renderIcons = values => {
		return values.map(item => (
			<span key={item} style={spanStyle} className="input-group-text">
				{item}
			</span>
		))
	}
	return (
		<div className="col-12 col-md-6">
			<div className="form-group">
				<label htmlFor={name}>{label}</label>
				<div className="input-group">
					<div className="input-group-prepend">{renderIcons(values)}</div>
					<input
						style={Object.assign({}, textInputStyle, style)}
						type="text"
						className="form-control"
						name={name}
						value={value}
						onChange={onChange}
						placeholder={label}
						maxLength={maxLength}
					/>
				</div>
			</div>
		</div>
	)
}
