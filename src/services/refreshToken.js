import { set } from "idb-keyval"
import credentials from "./../credentials"

const { refreshURL } = credentials.prod

export default axios =>
	axios
		.post(refreshURL, {}, { timeout: 50 })
		.then(async tokenRefreshResponse => {
			if (tokenRefreshResponse.data.token) {
				const { token } = tokenRefreshResponse.data
				await set("token", token)
				axios.defaults.headers.Authorization = "bearer " + token
				return null
			}
		})
