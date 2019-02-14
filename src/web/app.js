import React from 'react'
import MyList from './MyList'
import Button from './Button'

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
    { id: 17, text: 'Post on social media' }
]

const MYLIST = [
    { id: 1, taskId: 1, checked: false },
    { id: 2, taskId: 2, checked: false },
    { id: 3, taskId: 3,  checked: false },
    { id: 4, taskId: 4, checked: false },
    { id: 5, taskId: 5, checked: false },
    { id: 6, taskId: 10, checked: false, duration: 1 },
    { id: 7, taskId: 1, checked: false },
    { id: 8, taskId: 6, checked: false },
    { id: 9, taskId: 7, checked: false },
    { id: 10, taskId: 1, checked: false },
    { id: 11, taskId: 10, checked: false, duration: 1 },
    { id: 12, taskId: 11, checked: false },
    { id: 13, taskId: 1, checked: false },
    { id: 14, taskId: 12, checked: false },
    { id: 15, taskId: 13, checked: false },
    { id: 16, taskId: 1, checked: false },
    { id: 17, taskId: 14, checked: false },
    { id: 18, taskId: 10, checked: false, duration: 1 },
    { id: 19, taskId: 15, checked: false },
    { id: 20, taskId: 1, checked: false },
    { id: 21, taskId: 16, checked: false },
    { id: 22, taskId: 10, checked: false, duration: 1 },
    { id: 23, taskId: 17, checked: false }
]


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { mylist: []}

        this.handleReset = this.handleReset.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
    }

    componentDidMount() {
        this.setState({ mylist: this.aggregate(this.flatten(MYLIST)) })
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

    aggregate(list) {
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

    save() {

    }

    load() {

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

    render() {
        // <p>better living through simple mechanics</p>
        return (
            <div>
                <h1>erryday</h1>
                <MyList list={ this.state.mylist } action={ this.handleToggle } />
                <Button action={ this.handleReset } text="reset" />
            </div>
        )
    }
}

export default App
