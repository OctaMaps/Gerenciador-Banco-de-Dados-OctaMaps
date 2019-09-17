import axios from "axios"
import { saveAs } from "file-saver"
import credentials from "./../credentials"
import getToken from "./token"

function api() {
	const {
		// classRoomUrlRead,
		classroomURL,
		pdfURL,
		validateTokenURL,
		baseURL
	} = credentials.prod

	const isValidToken = async () => {
		try {
			const token = await getToken()
			axios.defaults.headers.Authorization = "bearer " + token
			axios.defaults.baseURL = baseURL
			const response = await axios.post(validateTokenURL)
			return response.data.isValid
		} catch (error) {}
	}

	const get = async () => {
		try {
			const response = await axios.get(classroomURL)
			return response.data.result
		} catch (error) {
			if (error.response.status) {
				const { status } = error.response
				throw status
			}
			return new Error(error)
		}
	}

	const remove = async classroom => {
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

	const save = async classroom => {
		const method = classroom.id ? "put" : "post"
		const finalUrl = classroom.id
			? `${classroomURL}/${classroom.id}`
			: classroomURL
		// const finalUrl = "asdasdsadadsad"
		try {
			const response = await axios[method](finalUrl, classroom)
			if (response.status) {
			}
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

	return {
		get,
		save,
		remove,
		classroomURL,
		fetchAndGetList,
		isValidToken
	}
}

export default api
