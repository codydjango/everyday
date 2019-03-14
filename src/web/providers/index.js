import React from 'react'
import comms from '~/services/comms'

import {
    StatusContext,
    AuthenticationContext,
    ListContext,
    NotesContext
} from '~/context'


window.AuthenticationContext = AuthenticationContext

class StatusProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            status: 'default message'
        }

        this.updateStatus = this.updateStatus.bind(this)
    }

    updateStatus(status) {
        this.setState({ status })
    }

    render() {
        return (
            <StatusContext.Provider value={{
                ...this.state,
                updateStatus: this.updateStatus
            }}>
            { this.props.children }
            </StatusContext.Provider>
        )
    }
}

class ListProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: []
        }
    }

    render() {
        return (
            <ListContext.Provider
                value={{
                    ...this.state,
                    updateList: list => {
                        this.setState(list)
                    }
                }}>
            { this.props.children }
            </ListContext.Provider>
        )
    }
}

class NotesProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            current: '',
            archive: []
        }
    }

    render() {
        return (
            <NotesContext.Provider
                value={{
                    ...this.state,
                    updateNotes: notes => {
                        this.setState(notes)
                    }
                }}>
            { this.props.children }
            </NotesContext.Provider>
        )
    }
}

class AuthenticationProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            token: null,
            account: null,
            verified: false
        }

        this.updateAuth = this.updateAuth.bind(this)
    }

    updateAuth(auth, logout = false) {
        const verified = comms.updateAuth(auth, logout)

        this.setState(state => {
            state.token = auth.token
            state.account = auth.account
            state.verified = verified

            return state
        })
    }

    render() {
        return (
            <AuthenticationContext.Provider
                value={{
                    ...this.state,
                    updateAuth: this.updateAuth
                }}>
            { this.props.children }
            </AuthenticationContext.Provider>
        )
    }
}

export {
    NotesProvider,
    ListProvider,
    StatusProvider,
    AuthenticationProvider
}
