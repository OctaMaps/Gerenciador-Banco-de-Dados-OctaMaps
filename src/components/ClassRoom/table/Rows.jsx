import React from "react"

export default props => {
	return props.values.map(classRoom => {
		return (
			<tr key={classRoom.id}>
				<td>{classRoom.id}</td>
				<td>{classRoom.titulo_bloco}</td>
				<td>{classRoom.numero_piso}</td>
				<td>{classRoom.codigo_sala}</td>
				<td>{classRoom.titulo_sala}</td>
				<td>
					<button
						className="btn btn-warning"
						onClick={() => props.load(classRoom)}
					>
						<i className="fa fa-pencil" />
					</button>
					<button
						className="btn btn-danger ml-2"
						onClick={() => props.remove(classRoom)}
					>
						<i className="fa fa-trash" />
					</button>
				</td>
			</tr>
		)
	})
}
