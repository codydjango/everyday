import React from 'react'
import styled from 'styled-components'

import { TIMERINITIAL } from '~/settings'
import Button from '~/components/Button'
import Timer from '~/utilities/Timer'
import audios from '~/utilities/audios'
import { StatusContext, ListContext } from '~/context'
import { withContext } from '~/hoc'

const StyledDiv = styled.div`
    margin-bottom: 28px;
`

export default withContext(class Now extends React.Component {
    static activeIndex(list) {
        const index = list.indexOf(list.filter(i => i.active)[0])
        return (index !== -1) ? index : null
    }

    static hasActive(list) {
        return (list.filter(i => (i.active)).length === 1)
    }

    static starting(list) {
        return (list.length === 0)
    }

    static processing(list) {
        if (!Now.hasActive(list)) return false
        return (list.length > 0) && (list.every(i => i.checked === true) === false)
    }

    static finished(list) {
        return (list.length > 0) && (list.every(i => i.checked === true) === true)
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    constructor(props) {
        super(props)

        this.timer = new Timer({
            onUpdate: time => this.setState(state => ({ time: time })),
            onDone: () => audios.playBeep(),
            initial: TIMERINITIAL,
        })

        this.state = { 'time': TIMERINITIAL, 'hasError': false }
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
    }

    componentDidCatch(error, info) {
        console.log(this.constructor.name, 'error', error)
        console.log(this.constructor.name, 'info', info)
    }

    get activeTask() {
        return this.props.list[Now.activeIndex(this.props.list)]
    }

    handleToggleTimer() {
        let timerType, limit

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

    renderError() {
        return (<div className="notes">
            <h1>Something is wrong</h1>
        </div>)
    }

    render() {
        if (this.state.hasError) return this.renderError()

        return (<StyledDiv>
            { (Now.starting(this.props.list)) && (
                <React.Fragment>
                    <h2>your brain is ready</h2>
                    <p><small>add a few tasks to your routine to get started.</small></p>
                </React.Fragment>
            ) }

            { (Now.processing(this.props.list)) && (
                <React.Fragment>
                    <h2>{ this.activeTask.text.toLowerCase() }</h2>

                    { (this.activeTask.checked)
                        ? (<Button
                            id="undo"
                            action={ this.props.undoActiveListItem }
                            text="undo" />)
                        : (<Button
                            id="done"
                            action={ () => {
                                this.props.doneActiveListItem()
                                audios.playBeep()
                            } }
                            text="done"
                            ref={ this.props.doneRef } />)
                    }

                    <Button
                        id="postpone"
                        action={ this.props.postponeActiveListItem }
                        text="postpone" />
                    <Button
                        id="timer"
                        action={ this.handleToggleTimer }
                        text={ this.state.time } />
                    {/* <label htmlFor="autoStartTimer">
                        <input id="autoStartTimer" type="checkbox"></input>
                        <span>auto-start</span>
                    </label> */}
                    {/* <Totals totals={ this.getTotals() } /> */}
                </React.Fragment>
            ) }

            { (Now.finished(this.props.list)) && (
                <React.Fragment>
                    <h2>your brain is so strong</h2>
                    <p><small>go relax. you deserve it.</small></p>
                </React.Fragment>
            ) }
        </StyledDiv>)
    }
}, [ListContext, StatusContext])
