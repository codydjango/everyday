import React from 'react'

import Button from '~/components/Button'
import Totals from '~/components/Totals'
import { TIMERINITIAL } from '~/settings'

class Next extends React.Component {
    static nothingActive(list) {
        return (list.filter(i => (i.active)).length === 0)
    }

    static hasTasks(list) {
        return (list.filter(i => {
            return (i && (i.checked === false))
        }).length > 0)
    }

    static hasTasksAndActive(list) {
        return (Next.hasTasks(list) && (Next.nothingActive(list) === false))
    }

    static bumpActive(list, index = 0) {
        let nextIndex, task

        // loop through the list starting at the active index until there are
        // no tasks left to be completed
        while (list.filter(i => (i.checked === false)).length > 0) {
            task = list[index]

            if (task && (task.checked === false)) {
                task.active = true
                break
            }

            index = ((index + 1) < list.length) ? (index + 1) : 0
        }

        return list
    }

    constructor(props) {
        super(props)

        this.state = { 'time': TIMERINITIAL }

        if (Next.nothingActive(props.list) && Next.hasTasks(props.list)) {
            this.state.list = Next.bumpActive(props.list)
        } else {
            this.state.list = props.list
        }

        this.handleDone = this.handleDone.bind(this)
        this.handleUndo = this.handleUndo.bind(this)
        this.handleNotNow = this.handleNotNow.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
        this.updateCountdownTime = this.updateCountdownTime.bind(this)
        this.updateTimerTime = this.updateTimerTime.bind(this)
    }

    handleUndo() {
        this.state.list.filter(i=>i.active)[0].checked = false
        window.setState({ mine: this.state.list })
    }

    handleDone() {
        const activeIndex = this.getActiveIndex()
        const list = this.state.list
        list[activeIndex].checked = true
        list[activeIndex].active = false
        window.setState({ mine: Next.bumpActive(list, activeIndex + 1) })
    }

    handleNotNow() {
        const activeIndex = this.getActiveIndex()
        const list = this.state.list
        list[activeIndex].active = false
        window.setState({ mine: Next.bumpActive(list, activeIndex + 1) })
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
        const task = this.getActiveTask()

        if (task.duration) {
            this.futureDate = this.getCountdownDate(task.duration)
            this.timer = setInterval(() => {
                this.setState({ time: this.updateCountdownTime(new Date().getTime()) })
            }, 1000)
            this.setState({ time: this.updateCountdownTime(new Date().getTime()) })
        } else {
            this.startDate = Date.now()
            this.timer = setInterval(() => {
                this.setState({ time: this.updateTimerTime(new Date().getTime()) })
            }, 1000)
            this.setState({ time: this.updateTimerTime(new Date().getTime()) })
        }
    }

    stopTimer(msg) {
        clearInterval(this.timer)
        this.timer = undefined
        this.setState({ time: TIMERINITIAL })
        if (msg) alert(msg)
    }

    handleToggleTimer() {
        ;(this.timer) ? this.stopTimer() : this.startTimer()
    }

    getActiveIndex() {
        let index = this.state.list.indexOf(this.state.list.filter(i => i.active)[0])
        return (index !== -1) ? index : null
    }

    getActiveTask() {
        return this.state.list[this.getActiveIndex()]
    }

    render() {
        return (<div className="next">
            { (Next.hasTasksAndActive(this.state.list)) ? (
                <React.Fragment>
                    <h2>next</h2>
                    <p><strong>{ this.getActiveTask().task.text }</strong></p>
                    { (this.getActiveTask().checked)
                        ? (<Button action={ this.handleUndo } text="undo" />)
                        : (<Button action={ this.handleDone } text="done" />)}

                    <Button action={ this.handleNotNow } text="not now" />
                    <Button action={ this.handleToggleTimer } text={ this.state.time } />
                    <Totals totals={ this.getTotals() } />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <h2>you are so good. your brain is so strong.</h2>
                    <p><small>Go drink some water.</small></p>
                </React.Fragment>
            ) }
        </div>)
    }
}

export default Next
