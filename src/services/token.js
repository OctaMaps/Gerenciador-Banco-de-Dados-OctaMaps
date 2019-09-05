import { get } from "idb-keyval"

const getToken = () => {
	return get("token")
}

export default getToken
