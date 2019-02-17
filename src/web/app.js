import React, { useState } from 'react'
import Theirs from '~/components/Theirs'
import Mine from '~/components/Mine'
import Next from '~/components/Next'
import storage from '~/storage'

import { TASKS, DEFAULTLIST } from '~/settings'

window.setState = (state) => {
    setTimeout(() => {
        window.ttt.setState(state)
    }, 1)
}

class App extends React.Component {
    constructor(props) {
        super(props)

        let state

        try {
            state = storage.load()
        } catch (err) {
            state = { mine: this.aggregates(this.flatten(DEFAULTLIST))}
        }

        window.ttt = this

        this.state = state
        this.handleReset = this.handleReset.bind(this)
        this.handleClearDone = this.handleClearDone.bind(this)
        this.handleToggleDone = this.handleToggleDone.bind(this)
        this.handleSetActive = this.handleSetActive.bind(this)
    }

    getTask(taskId) {
        return TASKS[taskId - 1]
    }

    flatten(list) {
        return list.map(i => {
            i.task = this.getTask(i.taskId)
            return i
        })
    }

    aggregates(list) {
        const counts = {}
        return list.map(i => {
            if (counts[i.taskId]) {
                counts[i.taskId] += 1
                i.multiple = counts[i.taskId]
            } else {
                counts[i.taskId] = 1
            }

            return i
        })
    }

    handleClearDone() {
        this.index = 0
        this.setState({ mine: this.state.mine.map(i => {
            i.checked = false
            return i
        })})
    }

    handleReset() {
        this.setState({ mine: this.aggregates(this.flatten(DEFAULTLIST))})
    }

    handleToggleDone(e) {
        this.setState({ mine: this.state.mine.map(i => {
            if (i.id == e.currentTarget.dataset.id) i.checked = !i.checked
            return i
        })})
    }

    handleSetActive(e) {
        e.preventDefault()
        this.setState({ mine: this.state.mine.map(i => {
            i.active = (i.id == e.currentTarget.dataset.id)
            return i
        })})
    }

    render() {
        storage.save({ mine: this.state.mine })

        return (
            <div className="app">
                <h1>everyday</h1>
                <div className="container">
                    <Next list={ this.state.mine } handleAction={ this.handleToggleDone } />
                    <Mine list={ this.state.mine } handleAction={ this.handleSetActive } />
                    <Theirs list={ TASKS } />
                </div>
            </div>
        )
    }
}

export default App
