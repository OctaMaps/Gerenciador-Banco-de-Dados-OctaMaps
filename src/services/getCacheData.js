import { get, set } from "idb-keyval"
import axios from "axios"

const { REACT_APP_ACCOUNT_URL } = process.env
// Obter dados online

const getCacheData = async () => {
	let userName, userEmail, userSiape, userRight
	const userID = await get("id")
	try {
		const response = await axios.get(`${REACT_APP_ACCOUNT_URL}/${userID}`)
		const user = response.data
		userName = user.name_user
		userEmail = user.email_user
		userSiape = user.siape_user
		userRight = user.right_user
		await set("name", userName)
		await set("right", userRight)
		await set("siape", userSiape)
		await set("email", userEmail)
	} catch (error) {
		userName = await get("name")
		userEmail = await get("email")
		userSiape = await get("siape")
		userRight = await get("right")
	}
	return { userName, userEmail, userSiape, userID, userRight }
}

export default getCacheData
