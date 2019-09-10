import React from "react"
import CheckBoxItem from "./CheckBoxItem"

export default props => {
	const { values, field, isChecked, onChange } = props
	let complement = ""
	if (field === "numero_piso") complement = "Piso "
	return values.map(item => {
		return (
			<div className="col">
				<CheckBoxItem
					label={`${complement}${item}`}
					value={item}
					onChange={event => onChange(event, field)}
					isChecked={isChecked[field][item]}
				/>
			</div>
		)
	})
}
