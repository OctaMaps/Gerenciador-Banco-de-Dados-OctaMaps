import axios from "axios"
import { saveAs } from "file-saver"

function API(url) {
	const get = async () => {
		const response = await axios["get"](url)
		return response.data
	}

	const remove = async classroom => {
		await axios["delete"](`${url}/${classroom.id}`)
	}

	const save = async classroomParam => {
		const classroom = classroomParam
		const method = classroom.id ? "put" : "post"
		const finalUrl = classroom.id ? `${url}/${classroom.id}` : url
		const response = await axios[method](finalUrl, classroom)
		return response
	}

	const fetchAndGetList = async list => {
		try {
			await axios.post("http://localhost:3002/fetch-list", { data: list })
			const response = await axios.get("http://localhost:3002/get-list", {
				responseType: "blob"
			})
			const listBlob = new Blob([response.data], { type: "application/pdf" })
			saveAs(listBlob, "list.pdf")
		} catch (error) {
			throw new Error(error)
		}
	}

	return {
		get,
		save,
		remove,
		url,
		fetchAndGetList
	}
}

export default API
