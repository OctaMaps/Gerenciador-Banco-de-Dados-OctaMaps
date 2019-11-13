import React from "react"
import "./Header.css"

// Icon e title inutilizados

const titleStyle = {
	fontWeight: "bold"
}

export default props => {
	return (
		<header className="header flex-column">
			<h1 className="mt-3 lead" style={titleStyle}>
				<i className={`fa fa-${props.icon} fa-fw`} />
				{props.title}
			</h1>
			<h3 className="mt-3 lead">{props.subtitle}</h3>
		</header>
	)
}
