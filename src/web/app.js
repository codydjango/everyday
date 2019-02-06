import React from 'react'
import MyList from './MyList'

class App extends React.Component {
  render() {
    const list = [
        {id: 1, text: 'Commit a line of code', done: true },
        {id: 2, text: 'Do 50 crunches', done: false },
        {id: 3, text: 'Do 50 pushups', done: true },
        {id: 4, text: 'Drink a glass of water', done: false },
        {id: 5, text: 'Make my bed', done: true },
        {id: 6, text: 'Read a chapter', done: false },
        {id: 7, text: 'Do a hackerRank challenge', done: true }
    ]

    return (
        <div>
            <h1>Bragging Rights</h1>
            <MyList list={list} />
        </div>
    )
  }
}

export default App
