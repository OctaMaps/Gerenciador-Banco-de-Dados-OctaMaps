// const isValidPasswordChange = array => {
// 	if (
// 		array.includes("old_user_password") &&
// 		array.includes("new_user_password")
// 	) {
// 		return false
// 	} else {
// 		return true
// 	}
// }

const emptyKeys = state => {
	const stateKeys = Object.keys(state)
	const emptyKeys = stateKeys.filter(
		key => !state[key] && key !== "id" && key !== "titulo_campus"
	)
	return emptyKeys.filter(
		key =>
			!state[key] && key !== "new_password_user" && key !== "old_password_user"
	)
}

const formValidation = async (state, errors, type) => {
	const emptyKeysArray = emptyKeys(state)
	if (emptyKeysArray.length >= 1) {
		const fields = [...emptyKeysArray]
		const error = {
			title: "Todos os campos devem ser preenchidos",
			fields
		}
		errors.push(error)
		return { isValid: false, formErrors: errors }
	} else {
		return { isValid: true }
	}
}

export default formValidation
