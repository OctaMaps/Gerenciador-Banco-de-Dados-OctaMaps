const updateField = async (event, state) => {
	const { name, value } = event.target
	const valueHandle = value.trim()
	const itemState = { ...state }
	if (valueHandle.length < 1) {
		itemState[name] = valueHandle
	} else {
		itemState[name] = value
	}
	return itemState
}

export default updateField
