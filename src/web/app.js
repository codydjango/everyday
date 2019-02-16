import React from 'react'
import TaskList from './TaskList'
import List from './List'
import Button from './Button'
import Totals from './Totals'

const DEBUG = true
const NAMESPACE = 'erryday'
const TIMERINITIAL = 'start timer'

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
    { id: 6, taskId: 5, checked: false },
    { id: 7, taskId: 10, checked: false, duration: '1h' },
    { id: 8, taskId: 1, checked: false },
    { id: 9, taskId: 6, checked: false },
    { id: 10, taskId: 7, checked: false },
    { id: 11, taskId: 1, checked: false },
    { id: 12, taskId: 10, checked: false, duration: '1h' },
    { id: 13, taskId: 11, checked: false },
    { id: 14, taskId: 1, checked: false },
    { id: 15, taskId: 12, checked: false },
    { id: 16, taskId: 13, checked: false },
    { id: 17, taskId: 1, checked: false },
    { id: 18, taskId: 14, checked: false },
    { id: 19, taskId: 10, checked: false, duration: '1h' },
    { id: 20, taskId: 15, checked: false },
    { id: 21, taskId: 1, checked: false },
    { id: 22, taskId: 16, checked: false },
    { id: 23, taskId: 10, checked: false, duration: '1h' },
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
        this.state.time = TIMERINITIAL
        this.handleReset = this.handleReset.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleNotNow = this.handleNotNow.bind(this)
        this.handleToggleTimer = this.handleToggleTimer.bind(this)
        this.updateCountdownTime = this.updateCountdownTime.bind(this)
        this.updateTimerTime = this.updateTimerTime.bind(this)

        this.index = 0
        this.postponed = false

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
        this.index = 0
        this.setState({ mylist: this.state.mylist.map(i => {
            i.checked = false
            return i
        })})
    }

    handleNotNow() {
        this.postponed = true
        this.index += 1
        this.forceUpdate()
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
                this.setState({ 'time': this.updateCountdownTime(new Date().getTime()) })
            }, 1000)
            this.setState({ 'time': this.updateCountdownTime(new Date().getTime()) })
        } else {
            this.startDate = Date.now()
            this.timer = setInterval(() => {
                this.setState({ 'time': this.updateTimerTime(new Date().getTime()) })
            }, 1000)
            this.setState({ 'time': this.updateTimerTime(new Date().getTime()) })
        }
    }

    stopTimer(msg) {
        clearInterval(this.timer)
        this.timer = undefined
        this.setState({ 'time': TIMERINITIAL })
        if (msg) alert(msg)
    }

    handleToggleTimer() {
        ;(this.timer) ? this.stopTimer() : this.startTimer();
    }

    getCurrent() {
        return this.state.mylist[this.index]
    }

    getNextUp() {
        let index = this.index || 0
        let mytask = null

        while (this.state.mylist.filter(i => (i.checked === false)).length > 0 || this.postponed) {
            for (let i=index; i < this.state.mylist.length; i +=1 ) {
                mytask = this.state.mylist[i]
                if (mytask && mytask.checked) continue
                if (mytask && !mytask.checked) {
                    this.index = i
                    return mytask;
                }
            }

            this.postponed = false
            index = 0
        }

        return null
    }

    hasNext() {
        return (this.state.mylist.filter(i => (i.checked === false)).length > 0)
    }

    handleToggle(e) {
        this.setState({ mylist: this.state.mylist.map(i => {
            if (i.id == e.currentTarget.dataset.id) i.checked = !i.checked
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

    getAllTasks() {
        return TASKS
    }

    render() {
        this.save()
        // <Timer time={this.state.time} />
        return (
            <div className="app">
                <h1>everyday</h1>

                <div className="container">
                    <div className="myTasks">
                        <h2>mine</h2>
                        <TaskList list={ this.state.mylist } action={ this.handleToggle } />
                    </div>

                    <div className="nextUp">
                        { (this.hasNext()) ? (
                            <React.Fragment>
                                <h2>next up</h2>
                                <p><strong>{ this.getNextUp().task.text }</strong></p>
                                <Button data-id={ this.getNextUp().id } action={ this.handleToggle } text="done" />
                                <Button action={ this.handleNotNow } text="not now" />
                                <Button action={ this.handleToggleTimer } text={ this.state.time } />
                                <Totals totals={ this.getTotals() } />
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <h2>wow. you are so good. your brain is so strong.</h2>
                                <small>Go drink some water.</small>
                            </React.Fragment>
                        ) }
                    </div>

                    { (false) ? (
                        <div className="allTasks">
                            <h2>everyone else</h2>
                            <List list={ this.getAllTasks() } />
                        </div>
                    ) : '' }
                </div>



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
