function getOrdinal(nonce) {
    let i = parseInt(nonce)
    let j = i % 10
    let k = i % 100

    if (j == 1 && k != 11) {
        return "st"
    }

    if (j == 2 && k != 12) {
        return "nd"
    }

    if (j == 3 && k != 13) {
        return "rd"
    }

    return "th"
}

function debounce(func, wait, immediate) {
    let timeout
	return function() {
		let context = this, args = arguments
		let later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		let callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

export {
    getOrdinal,
    debounce
}
