const exists = (item, array, identifier) => {
	if (identifier) {
		if (typeof item === "object") {
			for (let index = 0; index < array.length; index++) {
				const element = array[index]
				if (element[identifier] === item[identifier]) return true
			}
			return false
		}
	} else {
		return array.includes(item)
	}
}

export default exists
