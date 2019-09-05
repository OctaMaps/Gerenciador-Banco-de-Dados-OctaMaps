import axios from "axios"
import { get, set } from "idb-keyval"
import API from "../services/API"
import credentials from "../credentials.json"
const api = API()

const { authUrl, validateTokenUrl } = credentials.prod
function auth() {
	const signin = async (email, password) => {
		try {
			const response = await axios({
				method: "post",
				url: authUrl,
				data: {
					email,
					password
				}
			})
			const { token, name } = response.data
			try {
				await set("token", token)
				await set("name", name)
				return { message: "Sucesso!", color: "green" }
			} catch (error) {
				return { message: "Problemas para armazenar o Token", color: "red" }
			}
		} catch (error) {
			const { status } = error.response
			if (status === 400) {
				const { email, password } = error.response.data
				if (email)
					return { message: "Campo de Email não preenchido", color: "red" }
				if (password)
					return { message: "Campo de senha não preenchido", color: "red" }
				if (email && password)
					return {
						message: "Os campos de Email e senha precisam ser preenchidos",
						color: "red"
					}
			}
			if (status === 401 || status === 404) {
				const errorMessage = error.response.data.error
				return { message: errorMessage, color: "red" }
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
