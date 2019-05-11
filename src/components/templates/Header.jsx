import React from "react"
import "./Header.css"

// Icon e title inutilizados

export default props => {
	return (
		<header className="header flex-column">
			<h1 className="mt-3 lead">
				{/* <i className={`fa fa-${props.icon} fa-fw`} /> */}
				{props.subtitle}
			</h1>
			{/* <p className="lead text-muted">{props.subtitle}</p> */}
		</header>
	)
}
