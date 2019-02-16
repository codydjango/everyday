import React from 'react'
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
            state = { 'mylist': this.aggregates(this.flatten(DEFAULTLIST))}
        }

        this.state = state
        this.handleReset = this.handleReset.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
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

    handleReset() {
        this.index = 0
        this.setState({ mylist: this.state.mylist.map(i => {
            i.checked = false
            return i
        })})
    }

    handleToggle(e) {
        this.setState({ mylist: this.state.mylist.map(i => {
            if (i.id == e.currentTarget.dataset.id) i.checked = !i.checked
            return i
        })})
    }

    render() {
        storage.save({ mylist: this.state.mylist })

        return (
            <div className="app">
                <h1>everyday</h1>
                <div className="container">
                    <Next list={ this.state.mylist } action={ this.handleToggle } />
                    <Mine list={ this.state.mylist } action={ this.handleToggle } />
                    <Theirs list={ TASKS } />
                </div>
            </div>
        )
    }
}

export default App
