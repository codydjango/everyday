import React from 'react'
import styled from 'styled-components'
import { withContext } from '~/hoc'
import { AuthContext, StatusContext } from '~/context'
import getOrdinal from '~/utilities/getOrdinal'
import comms from '~/services/comms'
import Link from '~/components/Link'

import 'babel-polyfill'

const noAccountError = new Error('no accounts')

const StyledDiv = styled.div`
    .authInfo {
        .loginWith {
            font-size: 12px;
            line-height: 12px;
            height: 12px;
            display: block;
        }

        .loginAddress {
            font-size: 18px;
            line-height: 20px;
            font-weight: 700;
            height: 20px;
            display: block;
        }
    }
`
class Auth extends React.Component {
    constructor(props) {
        super(props)
        this.web3 = window.web3
        this.state = {}
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.checkIfNewAccount = this.checkIfNewAccount.bind(this)
    }

    async componentDidMount() {
        const defaultAccount = (await window.web3.eth.getAccounts())[0]
        const token = comms.getCookie(defaultAccount)

        setTimeout(() => {
            this.pingForActiveAccount()
        }, 1000)

        await this.props.updateAuth({ account: defaultAccount, token })
    }

    async checkIfNewAccount() {
        let account = (await this.web3.eth.getAccounts())[0]
        if (!account) throw noAccountError
        if (account !== this.props.account) {
            const token = comms.getCookie(account)
            const verified = await this.props.updateAuth({ account, token })

            if (verified) {
                this.props.updateStatus('You have successfully switched verified accounts.')
            } else {
                this.props.updateStatus('You have successfully switched accounts but you are not verified.')
            }
        }
    }

    async pingForActiveAccount() {
        if (this.checkAccountTimer) return

        const promise = new Promise(async (resolve, reject) => {
            // check immediately
            this.checkIfNewAccount().catch(reject)

            // continue to check every 3 seconds
            this.checkAccountTimer = setInterval(() => { this.checkIfNewAccount().catch(reject) }, 5000)
        })

        promise.catch(err => {
            if (err === noAccountError) {
                this.props.updateAuth(undefined, undefined)
                this.props.updateStatus('You don\'t have a session with this account.')
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
        const response = await comms.get(`/account/${ account }/nonce/`)
        return response.data.nonce
    }

    async authenticate(account, signature) {
        const response = await comms.post('/authentication/', { account, signature})
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

            this.props.updateAuth({ account, token })
            this.props.updateStatus('Nice to see you again.')
        } catch (err) {
            console.error('error login with metamask', err)
            this.props.updateStatus('Error logging in with metamask.')
        }
    }

    logout(e) {
        e.preventDefault()
        this.props.updateAuth({ account: this.props.account, token: null}, true)
        this.props.updateStatus('I hope to see you again soon')
    }

    getShortAccount() {
        let account = this.props.account
        let start = account.slice(0, 4)
        let end = account.slice(-4)

        return `${ start }...${ end }`
    }

    render() {
        const showMetamaskPrompt = () => (<span className="authInfo">Log in to <a href="https://metamask.io/">MetaMask</a></span>)

        const showLoggedInName = () => (<span className="authInfo">
            <span className="loginWith">logout from</span>
            <span className="loginAddress">
                <Link onClick={ this.logout } children={ this.getShortAccount() } />
            </span>
        </span>)

        const showLoginWithActiveMetamaskAccount = () => (<div className="authInfo">
            <span className="loginWith">login with</span>
            <span className="loginAddress">
                <Link onClick={ this.login } children={ this.getShortAccount() } />
            </span>
        </div>)

        let show
        if (this.props.hasAccount()) {
            if (this.props.isLoggedIn()) {
                show = showLoggedInName
            } else {
                show = showLoginWithActiveMetamaskAccount
            }
        } else {
            show = showMetamaskPrompt
        }

        return (<StyledDiv className="auth">
            { show() }
        </StyledDiv>)
    }
}

export default withContext(Auth, [AuthContext, StatusContext])

