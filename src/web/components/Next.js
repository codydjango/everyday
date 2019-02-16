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

        this.handleDone = this.handleDone.bind(this)
        this.handleUndo = this.handleUndo.bind(this)
        this.handleNotNow = this.handleNotNow.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
        this.updateCountdownTime = this.updateCountdownTime.bind(this)
        this.updateTimerTime = this.updateTimerTime.bind(this)
    }

    setPageState(state) {
        window.setState(state)
    }

    handleUndo() {
        this.state.list.filter(i=>i.active)[0].checked = false
        this.setPageState({ mine: this.state.list })
    }

    handleDone() {
        this.state.list.filter(i=>i.active)[0].checked = true
        this.setPageState({ mine: this.bumpActive() })
    }

    handleNotNow() {
        this.setPageState({ mine: this.bumpActive() })
    }

    bumpActiveOld() {
        let index = this.getActiveIndex()
        let list = this.state.list
        let nextIndex

        if ((index + 1) < list.length) {
            nextIndex = index + 1
        } else {
            nextIndex = 0
        }

        list[index].active = false
        list[nextIndex].active = true

        return list
    }

    bumpActive() {
        let index = this.getActiveIndex()
        let list = this.state.list
        let nextIndex, task

        // deactivate previous
        list[index].active = false

        // loop through the list starting at the active index until there are
        // no tasks left to be completed
        while (list.filter(i => (i.checked === false)).length > 0) {
            if ((index + 1) < list.length) {
                index += 1
            } else {
                index = 0
            }

            task = list[index]
            if (task && task.checked) continue
            if (task && !task.checked) {
                task.active = true
                break
            }
        }

        return list


        // while (this.state.list.filter(i => (i.checked === false)).length > 0 || this.postponed) {
        //     for (let i=index; i < this.state.list.length; i +=1 ) {
        //         mytask = this.state.list[i]
        //         if (mytask && mytask.checked) continue
        //         if (mytask && !mytask.checked) {
        //             mytask.active = true
        //             return mytask;
        //         }
        //     }

        //     this.postponed = false
        //     index = 0
        // }
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
        try {
            return this.state.list.indexOf(this.state.list.filter(i => i.active)[0])
        } catch (err) {
            console.log('err', err)
            return 0
        }
    }

    getCurrent() {
        this.index = this.getActiveIndex()

        return this.state.list[this.index]
    }

    getNext() {
        let index = this.getActiveIndex()
        let mytask = null

        if (this.state.list[index]) {
            return this.state.list[index]
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
                    <p><strong>{ this.getNext().task.text }</strong></p>
                    { (this.getCurrent().checked)
                        ? (<Button action={ this.handleUndo } text="undo" />)
                        : (<Button action={ this.handleDone } text="done" />)}

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
