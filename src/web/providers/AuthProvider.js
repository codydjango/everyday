import React from 'react'
import produce from 'immer'
import { AuthContext } from '~/context'
import comms from '~/services/comms'
import store from '~/services/store'

export default class AuthProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            token: null,
            account: null,
            verified: false
        }

        this.updateAuth = this.updateAuth.bind(this)
        this.hasAccount = this.hasAccount.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
    }

    componentDidMount() {
        store.register('auth', this)
    }

    componentWillUnmount() {
        store.register('auth', this, true)
    }

    hasAccount() {
        console.log(`has verified: ${ this.state.account } ${ this.state.verified }`)
        return (!!this.state.account)
    }

    isLoggedIn() {
        return (!!this.state.token)
    }

    // account has been switched, so pull new data. do a lot, basically.
    async updateAuth(auth, logout = false) {
        try {
            await new Promise((resolve, reject) => {
                const verified = comms.updateAuth(auth, logout)

                this.setState(state => {
                    state.token = auth.token
                    state.account = auth.account
                    state.verified = verified
                    return state
                }, () => {
                    resolve(true)
                })
            })

            const data = await store.load()

            if (data && data.notes) store.notes.updateNotes(data.notes, false)
            if (data && data.list) store.list.updateList(data.list, false)
        } catch (err) {
            console.log('error updating auth', err)
        }
    }

    render() {
        return (
            <AuthContext.Provider
                value={{
                    ...this.state,
                    updateAuth: this.updateAuth,
                    hasAccount: this.hasAccount,
                    isLoggedIn: this.isLoggedIn
                }}>
            { this.props.children }
            </AuthContext.Provider>
        )
    }
}
