import React from "react"
import Main from "../templates/Main"
import { get, set } from "idb-keyval"

export default props => {
	return (
		<Main icon="home" title="Inicio" subtitle="Sistema de Gestão do Octa Maps">
			<div className="display-4">Bem-Vindo {props.name}</div>
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>
		</Main>
	)
}
