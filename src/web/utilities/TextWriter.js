
function easeInOutQuad(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b
    return -c/2 * ((--t)*(t-2) - 1) + b
}

function easeOutQuad(t, b, c, d) {
    return -c * (t/=d)*(t-2) + b
}

function easeInQuad(t, b, c, d) {
    return c*(t/=d)*t + b
}


class TextWriter {
    constructor(id) {
        this._el = document.createElement('pre')
        this._el.setAttribute('class', 'textwriter')
        this._el.setAttribute('style', 'max-width: 100%; width: 100%;')

        this._root = document.getElementById('root')

        document.body.insertBefore(this._el, this._root)

        this._processString = this._processString.bind(this)
    }

    writeWithEasing(str) {
        // let time = 100;

        // const diff = str.length;
        // const minTime = 10;
        // const maxTime = 400;

        let time = 100;

        const diff = str.length;
        const minTime = 3;
        const maxTime = 200;

        this._str = str

        this.pEnd = new Promise((resolve, reject) => {
            for( let i = 0, len = diff; i <= len; i++ ) {
                setTimeout(() => {
                    this._processString()
                    if (i === diff) resolve(true)
                }, time)
                time = easeOutQuad(i, minTime, maxTime, diff);
            }

            this.resolve = resolve
            this.reject = reject
        })

        return this.pEnd
    }

    startWriting(str) {
        return this.writeWithEasing(str)
    }

    add(str) {
        return this.startWriting(`${ str.trim() }...\n`)
    }

    async wait(time = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, time)
        })
    }

    async end(time = 1000) {
        await this.wait(time)
        this._el.parentNode.removeChild(this._el)
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
        if (this._str[0] !== undefined) {
            this._el.innerText += this._str[0]
        }

        this._str = this._str.substring(1, (this._str.length))
    }

    check() {
        if (this._str.length === 0) {
            this.resolve(true)
        }
    }
}

export default TextWriter
