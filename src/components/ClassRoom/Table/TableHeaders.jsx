import React from "react"

export default props => {
	const thStyle = {
		cursor: "pointer"
	}
	let icon
	return props.values.map(item => {
		if (item.showSort) {
			icon = props.listOrder === "increasing" ? "fa-sort-up" : "fa-sort-down"
		} else {
			icon = "fa-sort text-muted"
		}
		return (
			<th key={item.id} onClick={() => props.onClick(item.id)}>
				<span style={thStyle}>
					{item.label}
					<i className={`fa ${icon} fa-fw`} />
				</span>
			</th>
		)
	})
}
