import React from 'react'
import MyList from './MyList'
import Button from './Button'


const LIST = [
    {id: 1, text: 'Commit a line of code', done: true },
    {id: 2, text: 'Do 50 crunches', done: false },
    {id: 3, text: 'Do 50 pushups', done: true },
    {id: 4, text: 'Drink a glass of water', done: false },
    {id: 5, text: 'Make my bed', done: true },
    {id: 6, text: 'Read a chapter', done: false },
    {id: 7, text: 'Do a hackerRank challenge', done: true }
]


class App extends React.Component {
    constructor(props) {
        console.log('constructor')
        super(props)
        this.state = { list: []}
        this.handleReset = this.handleReset.bind(this)
    }

    componentDidMount() {
        console.log('componendDidMount')
        const list = LIST
        this.setState({ list })
    }

    handleReset() {
        console.log('handleReset')
        const list = this.state.list

        const modifiedList = list.map(i => {
            i.done = false
            return i
        })

        // const modifiedList = list

        this.setState({ modifiedList})
    }

    render() {
        console.log('render', this.state.list)
        return (
            <div>
                <h1>Bragging Rights</h1>
                <MyList list={this.state.list} />
                <Button action={this.handleReset} text="reset" />
            </div>
        )
    }
}

export default App
