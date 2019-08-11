import axios from "axios"
import { saveAs } from "file-saver"
import credentials from "./../credentials"

function api() {
	const { classRoomUrl, pdfUrl } = credentials.prod
	const get = async () => {
		const response = await axios.get(classRoomUrl)
		return response.data.result
	}

	const remove = async classroom => {
		await axios["delete"](`${classRoomUrl}/${classroom.id}`)
	}

	const save = async classroomParam => {
		const classroom = classroomParam
		const method = classroom.id ? "put" : "post"
		const finalUrl = classroom.id
			? `${classRoomUrl}/${classroom.id}`
			: classRoomUrl
		const response = await axios[method](finalUrl, classroom)
		return response
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
			throw error
		}
	}

	return {
		get,
		save,
		remove,
		classRoomUrl,
		fetchAndGetList
	}
}

export default api
