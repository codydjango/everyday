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
        return (!!this.state.account)
    }

    isLoggedIn() {
        return (!!this.state.verified)
    }

    async forceLogout() {
        await this.updateAuth({ account: this.state.account, token: null}, true)
        store.status.updateStatus(`You've been logged out.`)
    }

    // account has been switched, so pull new data. do a lot, basically.
    async updateAuth(auth, logout = false) {
        const verified = comms.updateCredentials(auth, logout)

        await new Promise((resolve, reject) => {
            this.setState(produce(draft => {
                draft.token = auth.token
                draft.account = auth.account
                draft.verified = verified
            }), () => {
                setTimeout(() => { resolve(true) }, 500)
            })
        })

        await this.attemptLoad()

        return verified
    }

    // just error handling around store.load
    async attemptLoad() {
        try {
            await store.load(this.state)
        } catch (err) {
            if (err.response && err.response.status === 400) {
                store.status.updateStatus(`Problem with authentication with account ${ auth.account }`)
                await this.forceLogout()
            } else {
                store.status.updateStatus(`Error retrieving data from store`)
                console.log('err response', err)
                await this.forceLogout()
            }
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
