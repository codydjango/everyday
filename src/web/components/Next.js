import React from 'react'

import Button from '~/components/Button'
import Totals from '~/components/Totals'
import { TIMERINITIAL } from '~/settings'

class NextUp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            'time': TIMERINITIAL,
            'list': props.list
        }

        this.index = 0
        this.postponed = false

        this.handleToggle = props.handleAction
        this.handleNotNow = this.handleNotNow.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
        this.updateCountdownTime = this.updateCountdownTime.bind(this)
        this.updateTimerTime = this.updateTimerTime.bind(this)
    }

    handleNotNow() {
        this.postponed = true
        this.index += 1
        this.forceUpdate()
    }

    getTotals() {
        return {
            total: this.state.list.length,
            done: this.state.list.filter(i => i.checked).length
        }
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

        distance = this.futureDate - now
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (distance <= 0) return this.stopTimer('time\'s up!')
        return this.formatTime(hours, minutes, seconds)
    }

    updateTimerTime(now) {
        let distance, hours, minutes, seconds

        distance = now - this.startDate
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (distance >= (1000 * 60 * 60)) return this.stopTimer('time\'s up!')
        return this.formatTime(hours, minutes, seconds)
    }

    formatTime(hours, minutes, seconds) {
        const pad = (num, size) => ('000000000' + num).substr(-size)
        return `${ pad(hours, 2) }:${ pad(minutes, 2) }:${ pad(seconds, 2) }`
    }

    startTimer() {
        const task = this.getCurrent()

        if (task.duration) {
            this.futureDate = this.getCountdownDate(task.duration)
            this.timer = setInterval(() => {
                this.setState({ 'time': this.updateCountdownTime(new Date().getTime()) })
            }, 1000)
            this.setState({ 'time': this.updateCountdownTime(new Date().getTime()) })
        } else {
            this.startDate = Date.now()
            this.timer = setInterval(() => {
                this.setState({ 'time': this.updateTimerTime(new Date().getTime()) })
            }, 1000)
            this.setState({ 'time': this.updateTimerTime(new Date().getTime()) })
        }
    }

    stopTimer(msg) {
        clearInterval(this.timer)
        this.timer = undefined
        this.setState({ 'time': TIMERINITIAL })
        if (msg) alert(msg)
    }

    handleToggleTimer() {
        ;(this.timer) ? this.stopTimer() : this.startTimer();
    }

    getCurrent() {
        return this.state.list[this.index]
    }

    getNextUp() {
        let index = this.index || 0
        let mytask = null

        while (this.state.list.filter(i => (i.checked === false)).length > 0 || this.postponed) {
            for (let i=index; i < this.state.list.length; i +=1 ) {
                mytask = this.state.list[i]
                if (mytask && mytask.checked) continue
                if (mytask && !mytask.checked) {
                    this.index = i
                    return mytask;
                }
            }

            this.postponed = false
            index = 0
        }

        return null
    }

    hasNext() {
        return (this.state.list.filter(i => {
            return (i && (i.checked === false))
        }).length > 0)
    }

    render() {
        return (<div className="next">
            { (this.hasNext()) ? (
                <React.Fragment>
                    <h2>next</h2>
                    <p><strong>{ this.getNextUp().task.text }</strong></p>
                    <Button data-id={ this.getNextUp().id } action={ this.handleToggle } text="done" />
                    <Button action={ this.handleNotNow } text="not now" />
                    <Button action={ this.handleToggleTimer } text={ this.state.time } />
                    <Totals totals={ this.getTotals() } />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <h2>you are so good. your brain is so strong.</h2>
                    <small>Go drink some water.</small>
                </React.Fragment>
            ) }
        </div>)
    }
}

export default NextUp
