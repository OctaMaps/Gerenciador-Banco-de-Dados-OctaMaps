import axios from "axios"
import { isEmpty } from "lodash"
import { saveAs } from "file-saver"
import { set, get } from "idb-keyval"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import credentials from "./../credentials"
import refreshToken from "./refreshToken"
import getToken from "./token"

function api() {
	const {
		classroomURL,
		pdfURL,
		validateTokenURL,
		baseURL,
		userURL,
		accountURL,
		refreshURL,
		authURL
	} = credentials.prod

	const refreshAuthLogic = failedRequest =>
		axios.post(refreshURL).then(async tokenRefreshResponse => {
			const { token } = tokenRefreshResponse.data
			await set("token", token)
			axios.defaults.headers.Authorization = "bearer " + token

			return Promise.resolve()
		})

	const refreshTokenAPI = async () => {
		await refreshToken(axios)
	}

	const isValidToken = async () => {
		try {
			const token = await getToken()
			axios.defaults.headers.Authorization = "bearer " + token
			axios.defaults.baseURL = baseURL
			createAuthRefreshInterceptor(axios, () => refreshAuthLogic())
			let response = await axios.post(validateTokenURL)
			let { isValid } = response.data
			if (!isValid) {
				refreshTokenAPI()
				response = await axios.post(validateTokenURL)
			}
			return response.data.isValid
		} catch (error) {}
	}

	const getClassroom = async () => {
		try {
			const response = await axios.get(classroomURL)
			return response.data.result
		} catch (error) {
			if (error.response.status === 401) {
				try {
					const response = await axios.get(classroomURL)
					return response.data.result
				} catch (error) {
					const { status, statusText } = error.response
					const errorObject = { status, statusText }
					throw errorObject
				}
			}
			if (error.response.status) {
				const { status, statusText } = error.response
				const errorObject = { status, statusText }
				throw errorObject
			}
			await refreshToken(axios)
			throw Error(error)
		}
	}

	const removeClassroom = async classroom => {
		try {
			await axios.delete(`${classroomURL}/${classroom.id}`)
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return new Error(error)
		}
	}

	const saveClassroom = async classroom => {
		const method = classroom.id ? "put" : "post"
		const finalUrl = classroom.id
			? `${classroomURL}/${classroom.id}`
			: classroomURL
		try {
			const response = await axios[method](finalUrl, classroom)
			return classroom.id ? classroom : response.data.classroom[0]
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return new Error(error)
		}
	}

	const fetchAndGetList = async list => {
		try {
			await axios.post(pdfURL, { data: list })
			const response = await axios.get(pdfURL, {
				responseType: "blob"
			})
			const listBlob = new Blob([response.data], { type: "application/pdf" })
			saveAs(listBlob, "list.pdf")
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return new Error(error)
		}
	}

	const getUser = async () => {
		try {
			const response = await axios.get(userURL)
			await refreshToken(axios)
			return response.data.result
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}

			return new Error(error)
		}
	}

	const saveUser = async user => {
		const method = user.id ? "put" : "post"
		const finalUrl = user.id ? `${userURL}/${user.id}` : userURL
		try {
			const response = await axios[method](finalUrl, user)
			if (!user.id) {
				user.id = response.data.id
			}
			return user
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return new Error(error)
		}
	}

	const removeUser = async user => {
		try {
			await axios.delete(`${userURL}/${user.id}`)
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return new Error(error)
		}
	}

	// Terminar checagem de senha

	const checkPassword = async account => {
		try {
			const response = await axios.post(`${accountURL}/${account.id}`, account)
			if (response.data) {
				return true
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}

	const editUser = async user => {
		const finalURL = `${accountURL}/${user.id}`
		const { old_password_user, new_password_user } = user
		try {
			if (
				(!old_password_user && new_password_user) ||
				(old_password_user && !new_password_user)
			) {
				throw new Error("É necessário preencher ambas as senhas ou nenhuma")
			} else if (!isEmpty(old_password_user) && !isEmpty(new_password_user)) {
				if (!checkPassword(user)) throw new Error("Senha incorreta")
			} else if (isEmpty(old_password_user) && isEmpty(new_password_user)) {
				delete user.old_password_user
				delete user.new_password_user
			}
			await axios.put(finalURL, user)
		} catch (error) {
			if (error.message) {
				const errorTitle = { title: error.message }
				throw errorTitle
			}
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return error
		}
	}

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
				if (status === 404) {
					return { message: "Usuário ou senha incorreta", color: "red" }
				}
			} catch (error) {
				return { message: "Servidor Indisponível", color: "red" }
			}
		}
	}

	const classroom = {
		save: saveClassroom,
		remove: removeClassroom,
		get: getClassroom,
		fetchAndGetList
	}

	const user = {
		save: saveUser,
		remove: removeUser,
		get: getUser
	}

	const account = {
		save: editUser,
		checkPassword
	}

	const auth = {
		signin,
		isValidToken
	}

	return {
		classroom,
		user,
		account,
		isValidToken,
		auth,
		refreshToken: refreshTokenAPI
	}
}

export default api
