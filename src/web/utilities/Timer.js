const SECOND = 1000

class Timer {
    constructor(callback, initial) {
        this.callback = callback
        this.initial = initial
    }

    get active() {
        console.log('get active', !!this.timerId, this.timerId)
        return !!this.timerId
    }

    getCountdownDate(duration) {
        let milliseconds, seconds, minutes

        milliseconds = 1000
        seconds = 60
        minutes = 60
        minutes = parseInt(duration) * minutes

        return new Date(Date.now() + milliseconds * seconds * minutes)
    }

    updateCountdownTime(now) {
        let distance, hours, minutes, seconds

        distance = this.date - now
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (distance <= 0) return this.stop('time\'s up!')
        return this.formatTime(hours, minutes, seconds)
    }

    updateCountupTime(now) {
        let distance, hours, minutes, seconds

        distance = now - this.date
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (distance >= (1000 * 60 * 60)) return this.stop('time\'s up!')
        return this.formatTime(hours, minutes, seconds)
    }

    formatTime(hours, minutes, seconds) {
        const pad = (num, size) => ('000000000' + num).substr(-size)
        return `${ pad(hours, 2) }:${ pad(minutes, 2) }:${ pad(seconds, 2) }`
    }

    start(duration = null) {
        if (duration) {
            this.date = this.getCountdownDate(duration)
            this.timerId = setInterval(() => {
                this.callback(this.updateCountdownTime(new Date().getTime()))
            }, SECOND)
            this.callback(this.updateCountdownTime(new Date().getTime()))
        } else {
            this.date = Date.now()
            this.timerId = setInterval(() => {
                this.callback(this.updateCountupTime(new Date().getTime()))
            }, SECOND)
            this.callback(this.updateCountupTime(new Date().getTime()))
        }
    }

    stop(msg) {
        clearInterval(this.timerId)
        delete this.date
        delete this.timerId
        this.callback(this.initial)
        if (msg) setTimeout(() => { alert(msg) }, 1)
    }
}

export default Timer
