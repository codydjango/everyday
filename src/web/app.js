import React from 'react'
import MyList from './MyList'

class App extends React.Component {
  render() {
    const list = [
        {id: 1, text: 'Commit a line of code'},
        {id: 2, text: 'Do 50 crunches'},
        {id: 3, text: 'Do 50 pushups'},
        {id: 4, text: 'Drink a glass of water'},
        {id: 5, text: 'Make my bed'},
        {id: 6, text: 'Read a chapter'},
        {id: 7, text: 'Do a hackerRank challenge'}
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
