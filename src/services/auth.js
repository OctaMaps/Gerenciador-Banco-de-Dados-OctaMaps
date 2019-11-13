import axios from "axios"
import { get, set } from "idb-keyval"
import API from "./API"
import credentials from "../credentials.json"
const api = API()

const { authURL } = credentials.prod
function auth() {
	const signin = async (email, password) => {
		const userEmail = email
		try {
			const response = await axios({
				method: "post",
				url: authURL,
				data: {
					email: userEmail,
					password
				}
			})
			const { token, name, right, siape, email, id } = response.data
			try {
				await set("token", token)
				await set("name", name)
				await set("id", id)
				await set("right", right)
				await set("siape", siape)
				await set("email", email)
				return { message: "Sucesso!", color: "green" }
			} catch (error) {
				return { message: "Problemas internos com a aplicação", color: "red" }
			}
		} catch (error) {
			try {
				const { status } = error.response
				if (status === 400) {
					return {
						message:
							"Os campos de Email e senha precisam ser preenchidos corretamente",
						color: "red"
					}
				}
				if (status === 401 || status === 404) {
					return { message: "Usuário ou senha incorreta", color: "red" }
				}
			} catch (error) {
				return { message: "Servidor Indisponível", color: "red" }
			}
		}
	}

	const isAuthenticated = async () => {
		const token = await get("token")
		const isValid = await api.isValidToken(token)
		return isValid
	}

	return { signin, isAuthenticated }
}

export default auth
