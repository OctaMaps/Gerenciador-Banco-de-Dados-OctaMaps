const emptyKeys = state => {
	const stateKeys = Object.keys(state)
	const emptyKeys = stateKeys.filter(
		key => !state[key] && key !== "id" && key !== "titulo_campus"
	)
	return emptyKeys
}

const formValidation = async (state, errors) => {
	const emptyKeysArray = emptyKeys(state)
	if (emptyKeysArray.length >= 1) {
		console.log(emptyKeysArray)
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
