import React from 'react'
import styled from 'styled-components'

import { TIMERINITIAL } from '~/settings'
import Button from '~/components/Button'
import Timer from '~/utilities/Timer'
import audios from '~/utilities/audios'
import { StatusContext, ListContext } from '~/context'
import { withContext } from '~/hoc'

const StyledDiv = styled.div`
    margin-bottom: 14px;
`

export default withContext(class Now extends React.Component {
    static activeIndex(list) {
        const index = list.indexOf(list.filter(i => i.active)[0])
        return (index !== -1) ? index : null
    }

    static nothingActive(list) {
        return (list.filter(i => (i.active)).length === 0)
    }

    static hasTasks(list) {
        return (list.filter(i => {
            return (i && (i.checked === false))
        }).length > 0)
    }

    static hasTasksAndActive(list) {
        return (Now.hasTasks(list) && (Now.nothingActive(list) === false))
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
            { (Now.hasTasksAndActive(this.props.list)) ? (
                <React.Fragment>
                    <h2>{ this.activeTask.text.toLowerCase() }</h2>

                    { (this.activeTask.checked)
                        ? (<Button
                            id="undo"
                            action={ this.props.undoActiveListItem }
                            text="undo" />)
                        : (<Button
                            id="done"
                            action={ this.props.doneActiveListItem }
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
            ) : (
                <React.Fragment>
                    <h2>Your brain is so strong.</h2>
                    <p><small>Go drink more water.</small></p>
                </React.Fragment>
            ) }
        </StyledDiv>)
    }
}, [ListContext, StatusContext])
