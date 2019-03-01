import axios from 'axios'
import React from 'react'
import Button from '~/components/Button'
import { ENDPOINT } from '~/settings'

import 'babel-polyfill'

class User {
    constructor(none, publicAddress) {
        this.nonce
        this.publicAddress
    }
}

const noAccountError = new Error('no accounts')

function getOrdinal(nonce) {
    let i = parseInt(nonce)
    let j = i % 10
    let k = i % 100

    if (j == 1 && k != 11) {
        return "st"
    }

    if (j == 2 && k != 12) {
        return "nd"
    }

    if (j == 3 && k != 13) {
        return "rd"
    }

    return "th"
}

class Auth extends React.Component {
    constructor(props) {
        super(props)

        this.url = ENDPOINT
        this.state = { publicAddress: null }
        this.web3 = props.web3
        this.loginWithMetamask = this.loginWithMetamask.bind(this)

        this.checkIfNewAccount = this.checkIfNewAccount.bind(this)
    }

    componentDidMount() {
        this.pingForActiveAccount()
    }

    async checkIfNewAccount() {
        const web3 = this.web3
        let publicAddress = (await web3.eth.getAccounts())[0]
        if (!publicAddress) throw noAccountError
        if (publicAddress !== this.state.publicAddress) {
            this.setState(state => {
                state.publicAddress = publicAddress
                return state
            })
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
                this.setState(state => {
                    delete state['publicAddress']
                    return state
                })
            } else {
                console.log('err', err)
            }
        })
    }

    async signMessage(publicAddress, nonce) {
        let ordinal = getOrdinal(nonce)
        let challenge = `I'm signing into my everyday account for the ${ nonce }${ ordinal } time`
        let hexChallenge = this.web3.utils.utf8ToHex(challenge)
        let signature = await this.web3.eth.personal.sign(hexChallenge, publicAddress, null)

        return signature
    }

    async fetchNonce(publicAddress) {
        const response = await axios.get(`${ this.url }/address/${ publicAddress }/nonce`)
        return response.data.nonce
    }

    async authenticate(publicAddress, signature) {
        const response = await axios.post(`${ this.url }/authentication/`, {
            publicAddress,
            signature
        })

        return response.data
    }

    async loginWithMetamask() {
        let nonce, signature, session
        let publicAddress = this.state.publicAddress
        try {
            nonce = await this.fetchNonce(publicAddress)
            signature = await this.signMessage(publicAddress, nonce)
            session = await this.authenticate(publicAddress, signature)
            console.log('result', nonce, signature, session)
        } catch (err) {
            console.log('error login with metamask', err)
        }
    }

    render() {
        const showUser = () => {
            if (this.state.publicAddress) {
                return (<h3>Active ethereum account: { this.state.publicAddress }</h3>)
            } else {
                return (<h3>No active ethereum account: please login to your Metamask</h3>)
            }
        }
        const showPrompt = () => (<Button action={ this.loginWithMetamask } text="Login" />)

        return (<div className="auth">
            <h2>Authentication</h2>
            { showUser() }
            { (this.state.publicAddress) ? showPrompt() : '' }
        </div>)
    }
}

export default Auth

