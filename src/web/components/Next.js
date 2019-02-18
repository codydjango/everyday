import React from 'react'

import Button from '~/components/Button'
import Totals from '~/components/Totals'
import Timer from '~/utilities/Timer'
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

        this.state = { 'time': TIMERINITIAL }

        if (Next.nothingActive(props.list) && Next.hasTasks(props.list)) {
            this.state.list = Next.bumpActiveIndex(props.list)
        } else {
            this.state.list = props.list
        }

        this.timer = new Timer(time => this.setState({ time }), TIMERINITIAL)

        this.handleDone = this.handleDone.bind(this)
        this.handleUndo = this.handleUndo.bind(this)
        this.handleNotNow = this.handleNotNow.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)

    }

    get activeTask() {
        return this.state.list[Next.activeIndex(this.state.list)]
    }

    handleUndo() {
        this.state.list.filter(i=>i.active)[0].checked = false
        this.props.updateList(this.state.list)
    }

    handleDone() {
        const activeIndex = Next.activeIndex(this.state.list)
        const list = this.state.list

        list[activeIndex].checked = true
        list[activeIndex].active = false

        this.props.updateList(Next.bumpActiveIndex(list, activeIndex + 1))
    }

    handleNotNow(e) {
        e.preventDefault()

        const activeIndex = Next.activeIndex(this.state.list)
        const list = this.state.list

        list[activeIndex].active = false

        this.props.updateList(Next.bumpActiveIndex(list, activeIndex + 1))
    }

    getTotals() {
        return {
            total: this.state.list.length,
            done: this.state.list.filter(i => i.checked).length
        }
    }

    handleToggleTimer(e) {
        e.preventDefault()

        ;(this.timer.active) ? this.timer.stop() : this.timer.start(this.activeTask.duration || null)
    }

    render() {
        return (<div className="next">
            { (Next.hasTasksAndActive(this.state.list)) ? (
                <React.Fragment>
                    <h2>next</h2>
                    <p><strong>{ this.activeTask.task.text }</strong></p>
                    { (this.activeTask.checked)
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
