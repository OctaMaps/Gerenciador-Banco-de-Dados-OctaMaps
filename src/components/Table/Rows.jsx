import React from "react"

export default props => {
	const renderTd = item => {
		if (item.titulo_campus) delete item.titulo_campus
		if (item.password_user) delete item.password_user
		const itemKeys = Object.keys(item)
		return itemKeys.map(key => {
			return <td>{item[key]}</td>
		})
	}

	return props.values.map(item => {
		return (
			<tr>
				{renderTd(item)}
				<td>
					<button className="btn btn-warning" onClick={() => props.load(item)}>
						<i className="fa fa-pencil" />
					</button>
					<button
						className="btn btn-danger ml-2"
						onClick={() => props.remove(item)}
					>
						<i className="fa fa-trash" />
					</button>
				</td>
			</tr>
		)
	})
}
