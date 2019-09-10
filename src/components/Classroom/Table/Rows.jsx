import React from "react"

export default props => {
	return props.values.map(classroom => {
		return (
			<tr key={classroom.id}>
				<td>{classroom.id}</td>
				<td>{classroom.titulo_bloco}</td>
				<td>{classroom.numero_piso}</td>
				<td>{classroom.codigo_sala}</td>
				<td>{classroom.titulo_sala}</td>
				<td>
					<button
						className="btn btn-warning"
						onClick={() => props.load(classroom)}
					>
						<i className="fa fa-pencil" />
					</button>
					<button
						className="btn btn-danger ml-2"
						onClick={() => props.remove(classroom)}
					>
						<i className="fa fa-trash" />
					</button>
				</td>
			</tr>
		)
	})
}
