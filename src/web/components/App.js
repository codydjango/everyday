import React from 'react'
import Auth from '~/components/Auth'
import Theirs from '~/components/Theirs'
import Mine from '~/components/Mine'
import Next from '~/components/Next'
import storage from '~/storage'
import { TASKS, DEFAULTLIST } from '~/settings'

class App extends React.Component {
    static resetList() {
        return App.flatten(DEFAULTLIST)
    }

    static flatten(list) {
        return list.map(i => {
            i.task = TASKS[i.taskId - 1]
            return i
        })
    }

    constructor(props) {
        super(props)

        console.log('props.user', props.user)

        let state
        try {
            state = storage.load()
        } catch (err) {
            console.log('err', err)
            let list = App.resetList()
            list[0].active = true
            state = { mine: list }
        }

        this.state = state
        this.doneRef = React.createRef()
        this.web3 = props.web3

        // handlers
        this.handleReset = this.handleReset.bind(this)
        this.handleClearDone = this.handleClearDone.bind(this)
        this.handleSetActive = this.handleSetActive.bind(this)

        // callback
        this.updateList = this.updateList.bind(this)
    }

    componentDidUpdate() {
        this.save()
    }

    handleClearDone() {
        let list = this.state.mine.slice(0).map(i => {
            i.checked = false
            i.active = false
            return i
        })
        list[0].active = true

        this.setState({ mine: list })
    }

    updateList(list) {
        this.setState({ mine: list })
    }

    handleReset() {
        this.setState({ mine: App.resetList() })
    }

    handleSetActive(id) {
        this.setState({ mine: this.state.mine.slice(0).map(i => {
            i.active = (i.id == id)
            return i
        })})

        this.doneRef.current.focus()
    }

    save() {
        storage.save({ mine: this.state.mine })
    }

    render() {
        const doneRef = this.doneRef

        return (
            <div className="app">
                <h1>everyday</h1>
                <Auth web3={ this.props.web3 } />
            </div>
        )
    }
}


/* <div className="container">
<Next
    doneRef={ doneRef }
    list={ this.state.mine }
    updateList={ this.updateList }/>
<Mine
    list={ this.state.mine }
    updateList={ this.updateList }
    handleAction={ this.handleSetActive }
    handleClearDone={ this.handleClearDone }/>
<Theirs
    list={ TASKS } />
</div> */

export default App
