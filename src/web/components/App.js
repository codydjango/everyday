import React from 'react'
import Mine from '~/components/Mine'
import Next from '~/components/Next'
import Header from '~/components/Header'
import remote from '~/services/remote'
import local from '~/services/local'
import { messages, randomFromList } from '~/services/messages'
import { TASKS, DEFAULTLIST } from '~/settings'

class App extends React.Component {
    static resetList() {
        const list = App.flatten(DEFAULTLIST)
        list[0].active = true
        return list
    }

    static flatten(list) {
        return list.map(i => {
            i.task = TASKS[i.taskId - 1]
            return i
        })
    }

    static hasActive(list) {
        return (list && list.filter(i => i.active).length > 0)
    }

    constructor(props) {
        super(props)

        this.state = {
            account: props.defaultAccount,
            token: props.token,
            data: {},
            message: randomFromList(messages.hello)
        }

        this.doneRef = React.createRef()

        // handlers
        this.handleReset = this.handleReset.bind(this)
        this.handleClearDone = this.handleClearDone.bind(this)
        this.handleSetActive = this.handleSetActive.bind(this)
        this.createSession = this.createSession.bind(this)
        // this.hasSession = this.hasSession.bind(this)
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)

        // callback
        this.updateList = this.updateList.bind(this)
        this.updateAuthentication = this.updateAuthentication.bind(this)
    }

    async load() {
        // if (!this.hasToken()) return console.error('require token')
        try {
            this.setState({ message: 'Loading...' })
            let data = await this.store.load(this.state.account)
            this.updateList(data.mine, true)
            this.setState({ message: `Loaded from ${ this.store.name }.` })
        } catch (err) {
            console.error('err loading', err)
        } finally {
            setTimeout(()=> {
                this.setState({ message: randomFromList(messages.working) })
            }, 1000 * 5)
        }
    }

    async save() {
        // if (!this.hasToken()) return console.error('require token')
        try {
            this.setState({ message: 'Saving...' })
            await this.store.save(this.state.account, this.state.data)
            this.setState({ message: `Saved to ${ this.store.name }.` })
        } catch (err) {
            console.error('err saving', err)
        } finally {
            setTimeout(()=> {
                this.setState({ message: randomFromList(messages.working) })
            }, 1000 * 5)
        }
    }

    componentDidMount() {
        this.store = (this.state.token) ? remote : local
        this.load()

        setInterval(() => {
            this.setState({
                message: randomFromList(messages.working)
            })
        }, 1000 * 60 * 60);
    }

    componentDidUpdate() {
        this.store = (this.state.token) ? remote : local
    }

    handleClearDone() {
        let list = this.state.data.mine.slice(0).map(i => {
            i.checked = false
            i.active = false
            return i
        })
        list[0].active = true

        this.updateList(list)
    }

    updateList(list, save=true) {
        if (!App.hasActive(list)) {
            list[0].active = true
        }

        this.setState(state => {
            state.data.mine = list
            return state
        }, () => {
            if (save) this.save()
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
        this.updateList(App.resetList())
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

    hasToken() {
        function parseJwt (token) {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace('-', '+').replace('_', '/')
            return JSON.parse(window.atob(base64))
        }

        try {
            const parsed = parseJwt(this.state.token)
            console.log(parsed)
            return true
        } catch (err) {
            console.log('error parsing jwt')
            return false
        }
    }

    createSession() {
        this.updateList(App.resetList())
    }

    hasSession() {
        return (Array.isArray(this.state.data.mine))
    }

    render() {
        const doneRef = this.doneRef

        return (
            <React.Fragment>
                <Header web3={ this.props.web3 }
                        account={ this.state.account }
                        token={ this.state.token }
                        callback={ this.updateAuthentication } />

                { (this.hasSession())
                    ? (<div className="container">
                        <Next
                            doneRef={ doneRef }
                            list={ this.state.data.mine }
                            updateList={ this.updateList }/>
                        <Mine
                            list={ this.state.data.mine }
                            updateList={ this.updateList }
                            handleAction={ this.handleSetActive }
                            handleClearDone={ this.handleClearDone }/>
                    </div>)
                    : (<div className="container messageScreen">
                        <div className="message">
                            <span className="messageLine">################################################################</span>
                            <span>Session not found. Try logging in or <a href="#" onClick={ this.createSession }> create a new session.</a></span>
                            <span className="messageLine">################################################################</span>
                        </div>
                    </div>)
                }

                <footer className="footer">
                    <span className="messageLeft"><small>{ this.state.message }</small></span>
                    <span className="messageRight"><small>{
                        (this.hasToken()) ? '' : 'Login to enable session storage.'
                    }</small></span>
                </footer>
            </React.Fragment>
        )
    }
}

export default App
