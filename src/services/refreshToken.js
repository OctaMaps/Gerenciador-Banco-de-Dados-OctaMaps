import { set } from "idb-keyval"

const { REACT_APP_REFRESH_URL } = process.env

export default axios =>
	axios
		.post(REACT_APP_REFRESH_URL, {}, { timeout: 500 })
		.then(async tokenRefreshResponse => {
			if (tokenRefreshResponse.data.token) {
				const { token } = tokenRefreshResponse.data
				await set("token", token)
				axios.defaults.headers.Authorization = "bearer " + token
				return null
			}
		})
