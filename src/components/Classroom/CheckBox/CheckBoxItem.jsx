import React from "react"

export default props => {
	const { label, onChange, isChecked, value } = props
	return (
		<div className="form-check form-check-inline">
			<input
				type="checkbox"
				value={value}
				onChange={onChange}
				checked={isChecked}
				className="form-check-input"
			/>
			<label className="form-check-label">{label}</label>
		</div>
	)
}
