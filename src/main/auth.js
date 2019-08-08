import axios from "axios"
import credentials from "../credentials.json"

const { authUrl } = credentials.prod
const signin = (email = "", password = "") => {
	axios.post(authUrl, { email, password })
}

const isAuthenticated = (test = "") => true

export { signin, isAuthenticated }
