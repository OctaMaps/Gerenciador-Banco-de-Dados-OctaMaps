// import React from "react"

// export default props => {
// 	const { warningList } = props
// 	return warningList.map(item => {
// 		return <p> {item} </p>
// 	})
// }

import React from "react"

export default props => {
	const warningStyle = {
		marginTop: "15px",
		backgroundColor: "rgb(255, 255, 179)",
		// borderColor: "rgb(77, 77, 77)",
		// borderWidth: "2px",
		boxShadow:
			"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
	}
	const { warnings } = props
	const renderWarnings = warnings => warnings.map(warning => <li>{warning}</li>)
	return (
		<div style={warningStyle} className="alert alert">
			<h2>Atenção!</h2>
			<ul>{renderWarnings(warnings)}</ul>
		</div>
	)
}
