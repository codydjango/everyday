import React from 'react'

import { TIMERINITIAL } from '~/settings'
import Button from '~/components/Button'
import Totals from '~/components/Totals'
import Timer from '~/utilities/Timer'
import audios from '~/utilities/audios'

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

    static bumpActiveIndex(list, index = 0) {
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

    static activeIndex(list) {
        const index = list.indexOf(list.filter(i => i.active)[0])
        return (index !== -1) ? index : null
    }

    constructor(props) {
        super(props)

        this.timer = new Timer({
            onUpdate: time => this.setState(state => ({ time: time })),
            onDone: () => audios.playBeep(),
            initial: TIMERINITIAL,
        })

        this.state = { 'time': TIMERINITIAL }
        this.handleDone = this.handleDone.bind(this)
        this.handleUndo = this.handleUndo.bind(this)
        this.handleNotNow = this.handleNotNow.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
    }

    get activeTask() {
        return this.props.list[Next.activeIndex(this.props.list)]
    }

    handleUndo() {
        let list = this.props.list.slice(0)
        list.filter(i=>i.active)[0].checked = false
        this.props.updateList(list)
    }

    handleDone() {
        const list = this.props.list.slice(0)
        const activeIndex = Next.activeIndex(list)

        list[activeIndex].checked = true
        list[activeIndex].active = false

        this.props.updateList(Next.bumpActiveIndex(list, activeIndex + 1))
    }

    handleNotNow(e) {
        e.preventDefault()

        const list = this.props.list.slice(0)
        const activeIndex = Next.activeIndex(list)

        list[activeIndex].active = false

        this.props.updateList(Next.bumpActiveIndex(list, activeIndex + 1))
    }

    handleToggleTimer(e) {
        e.preventDefault()
        let timerType, limit;
        if (this.activeTask.limit) {
            timerType = 'limit'
            limit = this.activeTask.limit
        } else if (this.activeTask.duration) {
            timerType = 'countDown'
            limit = this.activeTask.duration
        } else {
            timerType = 'countUp'
            limit = null
        }

        ;(this.timer.active) ? this.timer.stop() : this.timer.start(timerType, limit)
    }

    getTotals() {
        let list = this.props.list
        return {
            total: list.length,
            done: list.filter(i => i.checked).length
        }
    }

    render() {
        return (<div className="next">
            { (Next.hasTasksAndActive(this.props.list)) ? (
                <React.Fragment>
                    <h2>next up</h2>
                    <p><strong>{ this.activeTask.text }</strong></p>
                    { (this.activeTask.checked)
                        ? (<Button id="undo" ref={ this.props.doneRef } action={ this.handleUndo } text="undo" />)
                        : (<Button id="done" ref={ this.props.doneRef } action={ this.handleDone } text="done" />)}

                    <Button action={ this.handleNotNow } text="not now" />
                    <Button action={ this.handleToggleTimer } text={ this.state.time } />
                    {/* <Totals totals={ this.getTotals() } /> */}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <h2>Your brain is so strong.</h2>
                    <p><small>Go drink more water.</small></p>
                </React.Fragment>
            ) }
        </div>)
    }
}

export default Next
