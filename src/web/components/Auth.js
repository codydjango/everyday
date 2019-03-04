import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ENDPOINT, ENVIRONMENT } from '~/settings'
import { getOrdinal } from '~/utilities'

import 'babel-polyfill'

const noAccountError = new Error('no accounts')

class Auth extends React.Component {
    static parseJwt(token) {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace('-', '+').replace('_', '/')

        return JSON.parse(window.atob(base64))
    }

    static verifyTokenForAccount(account, token) {
        if (!account) return false

        try {
            return (account === Auth.parseJwt(token).account)
        } catch (err) {
            console.log(`Auth error parsing ${ token }`, err)
            return false
        }
    }

    constructor(props) {
        super(props)

        this.url = ENDPOINT
        this.web3 = props.web3

        // upstream callbacks
        this.callback = props.callback

        // handlers
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.attemptSwitchAccount = this.attemptSwitchAccount.bind(this)
        this.checkIfNewAccount = this.checkIfNewAccount.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            this.pingForActiveAccount()
        }, 1)

        if (Auth.verifyTokenForAccount(this.props.account, this.props.token)) {
            this.setToken(this.props.account, this.props.token)
        }
    }

    async checkIfNewAccount() {
        let account = (await this.web3.eth.getAccounts())[0]
        if (!account) throw noAccountError
        if (account !== this.props.account) {
            this.callback(account, this.attemptSwitchAccount(account))
        }
    }

    async pingForActiveAccount() {
        const promise = new Promise(async (resolve, reject) => {
            // check immediately
            this.checkIfNewAccount().catch(reject)

            // continue to check every 3 seconds
            this.checkAccountTimer = setInterval(() => {
                this.checkIfNewAccount().catch(reject)
            }, 3000)
        })

        promise.catch(err => {
            if (err === noAccountError) {
                this.callback(undefined, undefined)
            } else {
                console.error('err', err)
            }
        })
    }

    async signMessage(account, nonce) {
        let ordinal = getOrdinal(nonce)
        let challenge = `I'm signing into my everyday account for the ${ nonce }${ ordinal } time`
        let hexChallenge = this.web3.utils.utf8ToHex(challenge)
        let signature = await this.web3.eth.personal.sign(hexChallenge, account, null)

        return signature
    }

    async fetchNonce(account) {
        const response = await axios.get(`${ this.url }/account/${ account }/nonce/`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response.data.nonce
    }

    async authenticate(account, signature) {
        const response = await axios.post(`${ this.url }/authentication/`, {
            account,
            signature
        })

        return response.data.token
    }

    async login(e) {
        e.preventDefault()

        let nonce, signature, session, token = false
        let account = this.props.account

        try {
            nonce = await this.fetchNonce(account)
            signature = await this.signMessage(account, nonce)
            token = await this.authenticate(account, signature)
        } catch (err) {
            console.error('error login with metamask', err)
            alert('error logging in with metamask')
            return
        }

        this.setToken(account, token)
        this.callback(account, token)
    }

    logout(e) {
        e.preventDefault()
        const account = this.props.account
        Cookies.remove(account)
        delete axios.defaults.headers.common['Authorization']
        this.callback(account, null)
    }

    attemptSwitchAccount(account) {
        const oldAccount = this.props.account
        Cookies.remove(oldAccount)
        delete axios.defaults.headers.common['Authorization']

        const token = Cookies.get(account)

        if (token) {
            Cookies.set(account, token, { secure: (ENVIRONMENT === 'production') })
            axios.defaults.headers.common['Authorization'] = token
        }

        return token
    }

    setToken(account, token) {
        const oldAccount = this.props.account

        Cookies.remove(oldAccount)
        delete axios.defaults.headers.common['Authorization']

        if (account && token) {
            Cookies.set(account, token, { secure: (ENVIRONMENT === 'production') })
            axios.defaults.headers.common['Authorization'] = token
        }

        console.log('token set', account, token)
    }

    isLoggedIn() {
        return (!!this.props.token)
    }

    hasAccount() {
        return (!!this.props.account)
    }

    getShortAccount() {
        let account = this.props.account
        let start = account.slice(0, 4)
        let end = account.slice(-4)

        return `${ start }...${ end }`
    }

    render() {
        const showMetamaskPrompt = () => (<span className="authInfo">Log in to MetaMask</span>)

        const showLoggedInName = () => (<span className="authInfo">
            <span className="loginWith">Logout from</span>
            <span className="loginAddress"><a href="#" onClick={ this.logout }>{ this.getShortAccount() }</a></span>
        </span>)

        const showLoginWithActiveMetamaskAccount = () => (<div className="authInfo">
            <span className="loginWith">Login with</span>
            <span className="loginAddress"><a href="#" onClick={ this.login }>{ this.getShortAccount() }</a></span>
        </div>)

        let show
        if (this.hasAccount()) {
            if (this.isLoggedIn()) {
                show = showLoggedInName
            } else {
                show = showLoginWithActiveMetamaskAccount
            }
        } else {
            show = showMetamaskPrompt
        }

        return (<div className="auth">
            { show() }
        </div>)
    }
}

export default Auth

