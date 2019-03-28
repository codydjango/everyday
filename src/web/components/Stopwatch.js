import React from 'react'
import { TIMERINITIAL } from '~/settings'
import Timer from '~/utilities/Timer'
import Button from '~/components/Button'

class Stopwatch extends React.Component {
    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    constructor(props) {
        super(props)

        this.timer = new Timer({
            onUpdate: time => this.setState(state => ({ time })),
            initial: TIMERINITIAL
        })

        this.state = {
            time: TIMERINITIAL,
            hasError: false,
            timerType: 'countUp',
            limit: null,
            autostart: props.autostart || false
        }

        this.startStopwatch = this.startStopwatch.bind(this)
        this.stopStopwatch = this.stopStopwatch.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
    }

    componentDidMount() {
        if (this.state.autostart) this.startStopwatch()
    }

    handleToggleTimer() {
        ;(this.timer.active) ? this.stopStopwatch() : this.startStopwatch()
    }

    stopStopwatch() {
        this.timer.stop()
    }

    startStopwatch() {
        this.timer.start(this.state.timerType, this.state.limit)
    }

    render() {
        if (this.state.hasError) return this.renderError()

        return (<Button
            action={ this.handleToggleTimer }
            text={ this.state.time } />)
    }
}

export default Stopwatch
