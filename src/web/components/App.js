import React from 'react'
import Mine from '~/components/Mine'
import Next from '~/components/Next'
import Header from '~/components/Header'
import remote from '~/services/remote'
import local from '~/services/local'
import { messages, randomFromList } from '~/services/messages'
import { DEFAULTLIST } from '~/settings'
import Auth from './Auth';
import { CODYLIST } from '../settings';

class App extends React.Component {
    static resetList(defaultList='default') {
        const listType = (defaultList === 'cody') ? CODYLIST : DEFAULTLIST
        const list = App.flatten(listType)

        list[0].active = true
        return list
    }

    static flatten(list) {
        return list.map((i, ii) => {
            i.id = ii
            i.checked = false
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

        window.ttt = this

        this.doneRef = React.createRef()

        // handlers
        this.handleReset = this.handleReset.bind(this)
        this.handleClearDone = this.handleClearDone.bind(this)
        this.handleSetActive = this.handleSetActive.bind(this)
        this.createSession = this.createSession.bind(this)

        this.load = this.load.bind(this)
        this.save = this.save.bind(this)

        // callback
        this.updateList = this.updateList.bind(this)
        this.updateAuthentication = this.updateAuthentication.bind(this)
    }

    async load() {
        this.store = (this.state.token) ? remote : local

        try {
            this.setState({ message: 'Loading...' })
            let data = await this.store.load(this.state.account)
            if (!(data.mine && data.mine.length > 0)) throw new Error('lost session')
            this.updateList(data.mine, false)
            this.setState({ message: `Loaded from ${ this.store.name }.` })
        } catch (err) {
            console.log('err loading', err)
            this.setState({ message: `Error from ${ this.store.name }.` })
        } finally {
            setTimeout(()=> {
                this.setState({ message: randomFromList(messages.working) })
            }, 1000 * 5)
        }
    }

    async save() {
        try {
            this.setState({ message: 'Saving...' })
            await this.store.save(this.state.account, this.state.data)
            this.setState({ message: `Saved to ${ this.store.name }.` })
        } catch (err) {
            console.log('err saving', err)
            this.setState({ message: `Error from ${ this.store.name }.` })
        } finally {
            setTimeout(()=> {
                this.setState({ message: randomFromList(messages.working) })
            }, 1000 * 5)
        }
    }

    componentDidMount() {
        this.load()

        setInterval(() => {
            this.setState({
                message: randomFromList(messages.working)
            })
        }, 1000 * 60 * 60);
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

    handleReset(listType='default') {
        this.updateList(App.resetList(listType))
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
        return Auth.verifyTokenForAccount(this.state.account, this.state.token)
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
                            updateList={ this.updateList } />
                        <Mine
                            list={ this.state.data.mine }
                            updateList={ this.updateList }
                            handleAction={ this.handleSetActive }
                            handleClearDone={ this.handleClearDone } />
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
