import React from 'react'
import TaskList from './TaskList'
import Button from './Button'
import Totals from './Totals'

const DEBUG = true
const NAMESPACE = 'erryday'

const TASKS = [
    { id: 1, text: 'Drink water' },
    { id: 2, text: 'Make bed' },
    { id: 3, text: '50 crunches' },
    { id: 4, text: '50 pushups' },
    { id: 5, text: 'Commit a line of code' },
    { id: 6, text: 'Read a chapter' },
    { id: 7, text: 'Solve HackerRank challenge' },
    { id: 8, text: 'Solve LeetCode challenge' },
    { id: 9, text: 'Apply for employment' },
    { id: 10, text: 'Code' },
    { id: 11, text: 'Process email' },
    { id: 12, text: 'Break for lunch' },
    { id: 13, text: 'Break for snack' },
    { id: 14, text: 'Do dishes' },
    { id: 15, text: 'Check voicemail' },
    { id: 16, text: 'Peruse social media' },
    { id: 17, text: 'Post on social media' },
    { id: 17, text: '50 squats' }
]

const DEFAULTLIST = [
    { id: 1, taskId: 1, checked: false },
    { id: 2, taskId: 2, checked: false },
    { id: 3, taskId: 3,  checked: false },
    { id: 4, taskId: 18, checked: false },
    { id: 5, taskId: 4, checked: false },
    { id: 6, taskId: 5, ch18cked: false },
    { id: 7, taskId: 10, checked: false, duration: 1 },
    { id: 8, taskId: 1, checked: false },
    { id: 9, taskId: 6, checked: false },
    { id: 10, taskId: 7, checked: false },
    { id: 11, taskId: 1, checked: false },
    { id: 12, taskId: 10, checked: false, duration: 1 },
    { id: 13, taskId: 11, checked: false },
    { id: 14, taskId: 1, checked: false },
    { id: 15, taskId: 12, checked: false },
    { id: 16, taskId: 13, checked: false },
    { id: 17, taskId: 1, checked: false },
    { id: 18, taskId: 14, checked: false },
    { id: 19, taskId: 10, checked: false, duration: 1 },
    { id: 20, taskId: 15, checked: false },
    { id: 21, taskId: 1, checked: false },
    { id: 22, taskId: 16, checked: false },
    { id: 23, taskId: 10, checked: false, duration: 1 },
    { id: 24, taskId: 17, checked: false },
]


class App extends React.Component {
    constructor(props) {
        super(props)

        let state

        try {
            state = this.load()
        } catch (err) {
            state = this.init()
        }

        this.state = state
        this.handleReset = this.handleReset.bind(this)
        this.handleToggle = this.handleToggle.bind(this)

        window.ttt = this
    }

    init() {
        return {
            'mylist': this.aggregates(this.flatten(DEFAULTLIST))
        }
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

    getMyList() {
        return this.state.list
    }

    save() {
        window.localStorage.setItem(NAMESPACE, JSON.stringify({
            mylist: this.state.mylist
        }))
    }

    load() {
        const saved = JSON.parse(window.localStorage.getItem(NAMESPACE))
        if (saved === null || Object.entries(saved).length === 0) throw new Error('nothing saved')
        return saved
    }

    clear() {
        window.localStorage.removeItem(NAMESPACE)
    }

    handleReset() {
        this.setState({ mylist: this.state.mylist.map(i => {
            i.checked = false
            return i
        })})
    }

    handleToggle(e) {
        this.setState({ mylist: this.state.mylist.map(i => {
            if (i.id == e.currentTarget.id) i.checked = !i.checked
            return i
        })})
    }

    setDebugTrue() {
        localStorage.setItem('DEBUG', 'true')
        this.forceUpdate()
    }

    isDebug() {
        return localStorage.getItem('DEBUG') == 'true'
    }

    getTotals() {
        return {
            total: this.state.mylist.length,
            done: this.state.mylist.filter(i => i.checked).length
        }
    }

    render() {
        this.save()

        // <p>better living through simple mechanics</p>
        return (
            <div>
                <h1>erryday</h1>
                <TaskList list={ this.state.mylist } action={ this.handleToggle } />
                <Totals totals={ this.getTotals() } />

                { (this.isDebug()) ? (<React.Fragment>
                    <Button action={ this.handleReset } text="reset" />
                    <Button action={ this.save.bind(this) } text="save" />
                    <Button action={ this.load.bind(this) } text="load" />
                    <Button action={ this.clear.bind(this) } text="clear" />
                    <Button action={ this.init.bind(this) } text="init" />
                    <Button action={ this.render.bind(this) } text="render" />
                </React.Fragment>
                ) : ''}
            </div>
        )
    }
}

export default App
