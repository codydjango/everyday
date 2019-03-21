class TextWriter {
    constructor(id) {
        this._root = document.getElementById(id)
        this._processString = this._processString.bind(this)

        this._root.setAttribute('style', 'max-width: 100%; width: 100%;')
    }

    startWriting(str) {
        this._str = str
        this._el = document.createElement('span')
        this._el.innerText = ''
        this._root.appendChild(this._el)

        this.pEnd = new Promise((resolve, reject) => {
            this._int = setInterval(this._processString, 12)
            this.resolve = resolve
            this.reject = reject
        })

        return this.pEnd
    }

    stopWriting() {
        clearInterval(this._int)
    }

    addSpacer() {
        this._root.appendChild(document.createTextNode(' '))
    }

    add(str) {
        return this.startWriting(`${ str }...`)
    }

    async end() {
        this.stopWriting()

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this._root.parentNode.removeChild(this._root)
                resolve(true)
            }, 3000)
        })
    }

    _processString() {
        try {
            this.writeChar()
            this.check()
        } catch (err) {
            this.end()
            this.reject(err)
        }
    }

    writeChar() {
        this._el.innerText += this._str[0]
        this._str = this._str.substring(1, (this._str.length))
    }

    check() {
        if (this._str.length === 0) {
            this.stopWriting()
            this.addSpacer()
            this.resolve(true)
        }
    }
}

export default TextWriter
