import axios from "axios"
import { saveAs } from "file-saver"
import credentials from "./../credentials"
import getToken from "./token"

function api() {
	const {
		// classRoomUrlRead,
		classroomUrl,
		pdfUrl,
		validateTokenUrl,
		baseURL
	} = credentials.prod

	const isValidToken = async () => {
		try {
			const token = await getToken()
			axios.defaults.headers.Authorization = "bearer " + token
			axios.defaults.baseURL = baseURL
			const response = await axios.post(validateTokenUrl)
			return response.data.isValid
		} catch (error) {
			console.log(error)
		}
	}

	const get = async () => {
		try {
			const response = await axios.get(classroomUrl)
			return response.data.result
		} catch (error) {
			return new Error(error)
		}
	}

	const remove = async classroom => {
		try {
			await axios.delete(`${classroomUrl}/${classroom.id}`)
		} catch (error) {
			return new Error(error)
		}
	}

	const save = async classroom => {
		const method = classroom.id ? "put" : "post"
		const finalUrl = classroom.id
			? `${classroomUrl}/${classroom.id}`
			: classroomUrl
		try {
			const response = await axios[method](finalUrl, classroom)
			console.log(response.data)
			return response.data
		} catch (error) {
			return new Error(error)
		}
	}

	const fetchAndGetList = async list => {
		try {
			await axios.post(pdfUrl, { data: list })
			const response = await axios.get(pdfUrl, {
				responseType: "blob"
			})
			const listBlob = new Blob([response.data], { type: "application/pdf" })
			saveAs(listBlob, "list.pdf")
		} catch (error) {
			return new Error(error)
		}
	}

	return {
		get,
		save,
		remove,
		classroomUrl,
		fetchAndGetList,
		isValidToken
	}
}

export default api
