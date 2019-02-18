import React, { useState } from 'react'
import Theirs from '~/components/Theirs'
import Mine from '~/components/Mine'
import Next from '~/components/Next'
import storage from '~/storage'
import { TASKS, DEFAULTLIST } from '~/settings'

class App extends React.Component {
    constructor(props) {
        super(props)

        let state
        try {
            state = storage.load()
        } catch (err) {
            state = { mine: this.aggregates(this.flatten(DEFAULTLIST))}
        }

        this.state = state

        window.ttt = this

        // handlers
        this.handleReset = this.handleReset.bind(this)
        this.handleClearDone = this.handleClearDone.bind(this)
        this.handleSetActive = this.handleSetActive.bind(this)

        // callback
        this.updateList = this.updateList.bind(this)
    }

    static flatten(list) {
        return list.map(i => {
            i.task = TASKS[i.taskId - 1]
            return i
        })
    }

    static aggregates(list) {
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
        let list = this.state.mine.map(i => {
            i.checked = false
            i.active = false
            return i
        })

        list[0].active = true

        this.setState({ mine: list})
    }

    updateList(list) {
        this.setState({ mine: list })
    }

    resetList() {
        return App.aggregates(App.flatten(DEFAULTLIST))
    }

    handleReset() {
        this.setState({ mine: this.resetList() })
    }

    handleSetActive(id) {
        this.setState((state) => {
            return { mine: state.mine.map(i => {
                i.active = (i.id == id)
                return i
            })}
        })
    }

    save() {
        storage.save({ mine: this.state.mine })
    }

    render() {
        this.save()

        return (
            <div className="app">
                <h1>everyday</h1>
                <div className="container">
                    <Next list={ this.state.mine }
                          updateList={ this.updateList }/>
                    <Mine list={ this.state.mine }
                          updateList={ this.updateList }
                          handleAction={ this.handleSetActive }
                          handleClearDone={ this.handleClearDone }/>
                    <Theirs list={ TASKS } />
                </div>
            </div>
        )
    }
}

export default App
