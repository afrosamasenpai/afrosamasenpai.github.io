const select = (selector, parent = document) => {
	let foundEl = [...parent.querySelectorAll(selector)]
	return (foundEl.length === 1) ? foundEl[0] : foundEl
}

export default select