const SECOND = 1000

class Timer {
    constructor({ onUpdate, onDone, initial }) {
        this.onUpdate = onUpdate,
        this.onDone = onDone,
        this.initial = initial,
        this.timerCount
        this.TIMER_IN_SECONDS = 60 * 60 // one hour
    }

    get active() {
        return !!this.timerId
    }

    getCountdownDate(duration) {
        let milliseconds, seconds, minutes

        milliseconds = 1000
        seconds = 60
        minutes = 60
        minutes = parseInt(duration) //* minutes

        return new Date(Date.now() + milliseconds * seconds * minutes)
    }

    updateCountdownTime(now) {
        let distance, hours, minutes, seconds

        distance = this.date - now
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (distance <= 0) return this.done()
        return this.formatTime(hours, minutes, seconds)
    }

    updateCountupTime(now, limit=null) {
        let distance, hours, minutes, seconds

        distance = now - this.date
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (limit) {
            if (distance >= (1000 * 60 * limit)) return this.done()
        }

        return this.formatTime(hours, minutes, seconds)
    }

    formatTime(hours, minutes, seconds) {
        const pad = (num, size) => ('000000000' + num).substr(-size)
        return `${ pad(hours, 2) }:${ pad(minutes, 2) }:${ pad(seconds, 2) }`
    }

    startCountUp(limit=null) {
        this.date = Date.now()
        this.timerId = setInterval(() => {
            this.onUpdate(this.updateCountupTime(new Date().getTime(), limit))
        }, SECOND)
        this.onUpdate(this.updateCountupTime(new Date().getTime(), limit))
    }

    startDuration(duration) {
        this.date = this.getCountdownDate(duration)
        this.timerId = setInterval(() => {
            this.onUpdate(this.updateCountdownTime(new Date().getTime()))
        }, SECOND)
        this.onUpdate(this.updateCountdownTime(new Date().getTime()))
    }

    start(timerType, limit = null) {
        if (timerType === 'countUp') {
            this.startCountUp()
        } else if (timerType === 'limit') {
            this.startCountUp(limit)
        } else if (timerType === 'countDown') {
            this.startDuration(limit)
        } else {
            throw new Error(`timer type not supported: ${ timerType }`)
        }
    }

    stop() {
        clearInterval(this.timerId)
        delete this.date
        delete this.timerId
        this.onUpdate(this.initial)
    }

    done() {
        clearInterval(this.timerId)
        delete this.date
        delete this.timerId
        setTimeout(() => {this.onDone()}, 1)
        return this.initial
    }
}

export default Timer
