import { get, set } from "idb-keyval"
import credentials from "./../credentials"

const { refreshURL } = credentials.prod

export default axios =>
	axios.post(refreshURL).then(async tokenRefreshResponse => {
		const { token } = tokenRefreshResponse.data
		await set("token", token)
		axios.defaults.headers.Authorization = "bearer " + token
		return null
	})
