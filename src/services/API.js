import axios from "axios"
import { saveAs } from "file-saver"
import credentials from "./../credentials"

function api() {
	const { classroomUrl, pdfUrl } = credentials.prod
	const get = async () => {
		console.log("Link: ", classroomUrl)
		const response = await axios.get(classroomUrl)
		return response.data.result
	}

	const remove = async classroom => {
		await axios["delete"](`${classroomUrl}/${classroom.id}`)
	}

	const save = async classroomParam => {
		const classroom = classroomParam
		const method = classroom.id ? "put" : "post"
		const finalUrl = classroom.id
			? `${classroomUrl}/${classroom.id}`
			: classroomUrl
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
		classroomUrl,
		fetchAndGetList
	}
}

export default api
