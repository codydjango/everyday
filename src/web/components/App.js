import React from 'react'
import Theirs from '~/components/Theirs'
import Mine from '~/components/Mine'
import Next from '~/components/Next'
import Header from '~/components/Header'
import remote from '~/services/remote'
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

        this.state = {
            account: props.defaultAccount,
            token: props.token,
            data: {
                mine: []
            }
        }

        let list = App.resetList()
        list[0].active = true

        this.state.data.mine = list

        this.doneRef = React.createRef()

        // handlers
        this.handleReset = this.handleReset.bind(this)
        this.handleClearDone = this.handleClearDone.bind(this)
        this.handleSetActive = this.handleSetActive.bind(this)

        // callback
        this.updateList = this.updateList.bind(this)
        this.updateAuthentication = this.updateAuthentication.bind(this)
    }

    hasToken() {
        return (this.state.account && this.state.token)
    }

    async load() {
        if (!this.hasToken()) return console.error('require token')

        let data

        try {
            data = await remote.load(this.state.account)
            this.setState(state => {
                state.data = data
                return state
            })
        } catch (err) {
            console.error('err loading', err)
        }
    }

    async save() {
        if (!this.hasToken()) return console.error('require token')
        try {
            await remote.save(this.state.account, this.state.data)
        } catch (err) {
            console.error('err saving', err)
        }
    }

    componentDidMount() {
        this.load()
    }

    componentDidUpdate() {
        this.save()
    }

    handleClearDone() {
        let list = this.state.data.mine.slice(0).map(i => {
            i.checked = false
            i.active = false
            return i
        })
        list[0].active = true

        this.setState(state => {
            state.data.mine = list
            return state
        })
    }

    updateList(list) {
        this.setState(state => {
            state.data.mine = list
            return state
        })
    }

    updateAuthentication(account, token=null) {
        if ((token === null) || (token === undefined)) {
            this.setState(state => {
                state.account = account
                delete state.token
                return state
            })
        } else {
            this.setState(state => {
                state.account = account
                state.token = token
                return state
            })
        }

        this.load()
    }

    handleReset() {
        this.setState(state => {
            state.data.mine = App.resetList()
            return state
        })
    }

    handleSetActive(id) {
        this.setState(state => {
            state.data.mine = state.data.mine.slice(0).map(i => {
                i.active = (i.id == id)
                return i
            })
            return state
        })

        this.doneRef.current.focus()
    }

    render() {
        const doneRef = this.doneRef

        return (
            <div className="app">
                <Header web3={ this.props.web3 }
                        account={ this.state.account }
                        token={ this.state.token }
                        callback={ this.updateAuthentication } />

                { (this.state.token) ? (
                    <div className="container">
                        <Next
                            doneRef={ doneRef }
                            list={ this.state.data.mine }
                            updateList={ this.updateList }/>
                        <Mine
                            list={ this.state.data.mine }
                            updateList={ this.updateList }
                            handleAction={ this.handleSetActive }
                            handleClearDone={ this.handleClearDone }/>
                        <Theirs
                            list={ TASKS } />
                    </div>
                ) : (
                    <div className="container">
                        <span>login to restore session</span>
                    </div>
                )}
            </div>
        )
    }
}

export default App
