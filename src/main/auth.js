import axios from "axios"
import credentials from "../credentials.json"

const { authUrl } = credentials.prod
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
			console.log(response)
		} catch (error) {
			console.log(error.response)
		}
	}

	const isAuthenticated = (test = "") => false

	return { signin, isAuthenticated }
}

export default auth
