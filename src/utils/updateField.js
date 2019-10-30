const updateField = async (event, state) => {
	const { name, value } = event.target
	const valueHandle = value.trim()
	const itemState = { ...state }
	itemState[name] = valueHandle
	return itemState
}

export default updateField
