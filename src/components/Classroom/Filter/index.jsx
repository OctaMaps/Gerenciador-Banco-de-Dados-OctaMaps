import React from "react"
import CheckBox from "../CheckBox"

export default props => {
	const tituloBlocoList = [
		"Bloco A",
		"Bloco B",
		"Bloco C",
		"Bloco D",
		"Bloco E",
		"Bloco F"
	]
	const numeroPisoList = [0, 1, 2]
	const checkBoxStyle = {
		margin: "10px"
	}
	const { isChecked, onChange } = props
	return (
		<div className="form-group">
			<div style={checkBoxStyle} className="form-row">
				<CheckBox
					values={tituloBlocoList}
					field={"titulo_bloco"}
					isChecked={isChecked}
					onChange={onChange}
				/>
			</div>
			<div style={checkBoxStyle} className="form-row">
				<CheckBox
					values={numeroPisoList}
					field={"numero_piso"}
					isChecked={isChecked}
					onChange={onChange}
				/>
				<div className="col" />
				<div className="col" />
				<div className="col" />
			</div>
		</div>
	)
}
